"""
NMO Training Bot - Main Application
====================================

This is the main Streamlit application for the New Missionary Orientation training tool.
It uses a two-phase flow:
  1. Routing phase: Collects missionary's area, program+format, and experience level
  2. Training phase: Loads program-specific questions from a CSV and evaluates answers
     using branching logic (questions navigate by ID, not linear index)

To run this app (from project root):
    streamlit run src/app.py

Author: Pioneer Academy Team
Version: 3.0
"""

# =============================================================================
# IMPORTS
# =============================================================================

import streamlit as st          # Web app framework
import pandas as pd             # For reading CSV files
import os                       # For file paths and environment variables
import json                     # For saving/loading progress data
from pathlib import Path        # For cross-platform file paths
from openai import OpenAI       # For AI evaluation
from dotenv import load_dotenv  # For loading .env file

# For browser localStorage (progress persistence)
from streamlit_js_eval import streamlit_js_eval

# =============================================================================
# CONFIGURATION
# =============================================================================

# Project root directory (one level up from src/)
PROJECT_ROOT = Path(__file__).parent.parent

# Load environment variables from .env file (at project root)
load_dotenv(PROJECT_ROOT / ".env")

# Page configuration - MUST be the first Streamlit command
st.set_page_config(
    page_title="NMO Training",
    page_icon="📚",
    layout="centered"
)

# Mapping of (program, format) -> CSV file path
CSV_MAP = {
    ("PathwayConnect", "In-Person"): PROJECT_ROOT / "data" / "pathwayconnect_inperson.csv",
    ("PathwayConnect", "Virtual"):   PROJECT_ROOT / "data" / "pathwayconnect_virtual.csv",
    ("EnglishConnect", "In-Person"): PROJECT_ROOT / "data" / "englishconnect_inperson.csv",
    ("EnglishConnect", "Virtual"):   PROJECT_ROOT / "data" / "englishconnect_virtual.csv",
}

# 24 predefined areas from the Excel file
AREAS = [
    "Africa Central", "Africa South", "Africa West",
    "Asia", "Asia North",
    "Brazil",
    "Canada", "Caribbean", "Central America",
    "Europe Central", "Eurasian", "Europe North",
    "Mexico", "Middle East/Africa North",
    "Pacific", "Philippines",
    "South America Northwest", "South America South",
    "United States Central", "United States Northeast",
    "United States Southeast", "United States Southwest",
    "United States West", "Utah",
]

# 4 combined program+format options
PROGRAM_FORMAT_OPTIONS = [
    "PathwayConnect -- In-Person",
    "PathwayConnect -- Virtual (Online)",
    "EnglishConnect -- In-Person",
    "EnglishConnect -- Virtual (Online)",
]

# localStorage key for saving progress
STORAGE_KEY = "nmo_training_progress"


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def parse_program_format(selection: str) -> tuple:
    """
    Parse a combined program+format selection into (program, format).

    E.g. "PathwayConnect -- In-Person" -> ("PathwayConnect", "In-Person")
         "EnglishConnect -- Virtual (Online)" -> ("EnglishConnect", "Virtual")
    """
    parts = selection.split(" -- ")
    program = parts[0]
    fmt_raw = parts[1] if len(parts) > 1 else ""
    # Normalize: "Virtual (Online)" -> "Virtual", "In-Person" stays
    fmt = "Virtual" if "Virtual" in fmt_raw else "In-Person"
    return program, fmt


@st.cache_data
def load_questions(file_path: str):
    """
    Load questions from a CSV file.

    Args:
        file_path: Path to the CSV file to load

    Returns:
        pandas.DataFrame: A table containing all questions and their metadata
    """
    try:
        df = pd.read_csv(file_path)
        return df
    except FileNotFoundError:
        st.error("Training content not found for this program/format. Please contact your trainer.")
        st.stop()
    except Exception as e:
        st.error(f"Error loading questions: {e}")
        st.stop()


def get_openai_client():
    """
    Create and return an OpenAI client.

    The API key is loaded from the OPENAI_API_KEY environment variable,
    which should be set in your .env file.
    """
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        st.error("OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.")
        st.stop()

    return OpenAI(api_key=api_key)


def evaluate_answer(question: str, correct_answer: str, user_answer: str, instructions: str, conversation_history: list = None) -> dict:
    """
    Use OpenAI to evaluate if the user's answer is correct.

    Args:
        question: The question that was asked
        correct_answer: The expected/correct answer criteria
        user_answer: What the user typed
        instructions: What to do if correct/incorrect (from CSV)
        conversation_history: List of previous attempts for this question (optional)

    Returns:
        dict with keys:
            - is_correct (bool): Whether the answer is acceptable
            - feedback (str): Message to show the user
            - should_advance (bool): Whether to move to the next question
    """
    client = get_openai_client()

    system_prompt = """You are an evaluator for a missionary training program.
Your job is to determine if a trainee's answer is acceptable and provide helpful feedback.

You MUST respond with valid JSON in this exact format:
{
    "is_correct": true or false,
    "feedback": "Your feedback message here",
    "should_advance": true or false
}

Guidelines:
- If the answer is correct, set both "is_correct" and "should_advance" to true
- If the answer is incorrect but the trainee has made multiple attempts, you may choose to advance them anyway with guidance
- Be encouraging and provide specific feedback
- Reference their previous attempts if they're improving
- If they're clearly struggling after 2-3 attempts, suggest they discuss with their trainer but still advance them"""

    # Build the conversation messages
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history if available
    if conversation_history:
        for entry in conversation_history:
            messages.append({"role": "user", "content": f"TRAINEE'S ANSWER: {entry['answer']}"})
            messages.append({"role": "assistant", "content": entry['feedback']})

    # Add the current prompt
    current_prompt = f"""Evaluate this trainee's answer:

QUESTION: {question}

CORRECT ANSWER CRITERIA: {correct_answer}

INSTRUCTIONS FOR EVALUATION: {instructions}

TRAINEE'S ANSWER: {user_answer}

Remember to respond with JSON only."""

    messages.append({"role": "user", "content": current_prompt})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.3
        )

        result = json.loads(response.choices[0].message.content)

        return {
            "is_correct": result.get("is_correct", False),
            "feedback": result.get("feedback", "Unable to evaluate your answer."),
            "should_advance": result.get("should_advance", result.get("is_correct", False))
        }

    except json.JSONDecodeError:
        return {
            "is_correct": False,
            "feedback": "There was an error evaluating your answer. Please try again.",
            "should_advance": False
        }
    except Exception as e:
        st.error(f"Error calling OpenAI: {e}")
        return {
            "is_correct": False,
            "feedback": "There was an error connecting to the evaluation service. Please try again.",
            "should_advance": False
        }


# =============================================================================
# SESSION STATE & PERSISTENCE
# =============================================================================

def initialize_session_state():
    """Initialize all session state variables."""
    # Routing phase state
    if "phase" not in st.session_state:
        st.session_state.phase = "routing"
    if "routing_step" not in st.session_state:
        st.session_state.routing_step = 0
    if "routing_answers" not in st.session_state:
        st.session_state.routing_answers = {}
    if "training_csv_path" not in st.session_state:
        st.session_state.training_csv_path = None

    # Training phase state (branching)
    if "current_question_id" not in st.session_state:
        st.session_state.current_question_id = "S1"
    if "question_history" not in st.session_state:
        st.session_state.question_history = []
    if "completed_questions" not in st.session_state:
        st.session_state.completed_questions = []
    if "answers" not in st.session_state:
        st.session_state.answers = {}
    if "show_feedback" not in st.session_state:
        st.session_state.show_feedback = False
    if "last_result" not in st.session_state:
        st.session_state.last_result = None
    if "training_done" not in st.session_state:
        st.session_state.training_done = False
    if "conversation_history" not in st.session_state:
        st.session_state.conversation_history = {}  # Per-question conversation history

    # Progress loading flag
    if "progress_loaded" not in st.session_state:
        st.session_state.progress_loaded = False


def save_progress():
    """Save current progress to browser localStorage."""
    progress = {
        "phase": st.session_state.phase,
        "routing_step": st.session_state.routing_step,
        "routing_answers": st.session_state.routing_answers,
        "training_csv_path": st.session_state.training_csv_path,
        "current_question_id": st.session_state.current_question_id,
        "question_history": st.session_state.question_history,
        "completed_questions": st.session_state.completed_questions,
        "answers": st.session_state.answers,
        "training_done": st.session_state.training_done,
        "conversation_history": st.session_state.conversation_history,
    }

    progress_json = json.dumps(progress)
    safe_json = progress_json.replace("'", "\\'")

    streamlit_js_eval(
        js_expressions=f"localStorage.setItem('{STORAGE_KEY}', '{safe_json}')",
        key=f"save_{st.session_state.phase}_{st.session_state.routing_step}_{st.session_state.current_question_id}"
    )


def load_progress():
    """Load progress from browser localStorage."""
    saved_data = streamlit_js_eval(
        js_expressions=f"localStorage.getItem('{STORAGE_KEY}')",
        key="load_progress"
    )

    if saved_data and saved_data != "null":
        try:
            return json.loads(saved_data)
        except json.JSONDecodeError:
            return None
    return None


def clear_progress():
    """Clear all saved progress from localStorage and reset session state."""
    streamlit_js_eval(
        js_expressions=f"localStorage.removeItem('{STORAGE_KEY}')",
        key="clear_progress"
    )

    # Reset routing state
    st.session_state.phase = "routing"
    st.session_state.routing_step = 0
    st.session_state.routing_answers = {}
    st.session_state.training_csv_path = None

    # Reset training state
    st.session_state.current_question_id = "S1"
    st.session_state.question_history = []
    st.session_state.completed_questions = []
    st.session_state.answers = {}
    st.session_state.show_feedback = False
    st.session_state.last_result = None
    st.session_state.training_done = False
    st.session_state.conversation_history = {}


# =============================================================================
# NAVIGATION HELPERS
# =============================================================================

def get_question_by_id(df, question_id):
    """Look up a question row by its question_id. Returns None if not found."""
    matches = df[df["question_id"] == question_id]
    if len(matches) == 0:
        return None
    return matches.iloc[0]


def advance_to_question(next_id):
    """
    Navigate to the next question by ID.

    Records current question in history, marks it completed, and moves forward.
    If next_id is 'DONE', marks training as complete.
    """
    current_id = st.session_state.current_question_id

    # Record in history
    if current_id not in st.session_state.question_history:
        st.session_state.question_history.append(current_id)

    # Mark completed
    if current_id not in st.session_state.completed_questions:
        st.session_state.completed_questions.append(current_id)

    # Reset feedback state
    st.session_state.show_feedback = False
    st.session_state.last_result = None

    if next_id == "DONE":
        st.session_state.training_done = True
        st.session_state.phase = "complete"
    else:
        st.session_state.current_question_id = next_id

    save_progress()


def transition_to_training():
    """Switch from routing phase to training phase based on selected program/format."""
    program = st.session_state.routing_answers["program"]
    fmt = st.session_state.routing_answers["format"]

    csv_path = CSV_MAP.get((program, fmt))

    if csv_path is None:
        st.error(f"No training content found for {program} - {fmt}. Please contact your trainer.")
        st.stop()

    st.session_state.training_csv_path = str(csv_path)
    st.session_state.phase = "training"

    # Reset training-specific state
    st.session_state.current_question_id = "S1"
    st.session_state.question_history = []
    st.session_state.completed_questions = []
    st.session_state.answers = {}
    st.session_state.show_feedback = False
    st.session_state.last_result = None
    st.session_state.training_done = False
    st.session_state.conversation_history = {}

    save_progress()


# =============================================================================
# ROUTING PHASE
# =============================================================================

TOTAL_ROUTING_STEPS = 5


def render_routing_phase():
    """
    Render the routing phase UI.

    Steps:
        0: Welcome
        1: Area assignment (dropdown with 24 areas)
        2: Program + Format (combined selection)
        3: Experience level
        4: Confirmation + training preview
    """
    st.title("New Missionary Orientation")

    step = st.session_state.routing_step
    st.progress(step / TOTAL_ROUTING_STEPS)
    st.caption(f"Setup: Step {step + 1} of {TOTAL_ROUTING_STEPS}")
    st.divider()

    if step == 0:
        # Welcome screen
        st.markdown("### Welcome!")
        st.markdown(
            "Thank you for visiting! This training will help you prepare for your role "
            "as a BYU-Pathway missionary. We'll start by collecting some information "
            "about your assignment, then walk you through program-specific training."
        )
        if st.button("Get Started", type="primary"):
            st.session_state.routing_step = 1
            save_progress()
            st.rerun()

    elif step == 1:
        # Area question - dropdown with 24 predefined areas
        st.markdown("### What area are you assigned to work in?")
        area = st.selectbox(
            "Select your area:",
            options=[""] + AREAS,
            key="routing_area",
            format_func=lambda x: "-- Select an area --" if x == "" else x,
        )
        if st.button("Continue", type="primary"):
            if area:
                st.session_state.routing_answers["area"] = area
                st.session_state.routing_step = 2
                save_progress()
                st.rerun()
            else:
                st.warning("Please select your area.")

    elif step == 2:
        # Program + Format combined
        st.markdown("### What program will you be working with?")
        program_format = st.radio(
            "Select your program and format:",
            PROGRAM_FORMAT_OPTIONS,
            key="routing_program_format",
            index=None,
        )
        if st.button("Continue", type="primary"):
            if program_format:
                program, fmt = parse_program_format(program_format)
                st.session_state.routing_answers["program"] = program
                st.session_state.routing_answers["format"] = fmt
                st.session_state.routing_answers["program_format_display"] = program_format
                st.session_state.routing_step = 3
                save_progress()
                st.rerun()
            else:
                st.warning("Please select a program.")

    elif step == 3:
        # Experience level
        st.markdown("### What is your experience level?")
        experience = st.radio(
            "Select the option that best describes you:",
            [
                "First-time missionary",
                "Former PathwayConnect student",
                "Returning/experienced missionary",
            ],
            key="routing_experience",
            index=None,
        )
        if st.button("Continue", type="primary"):
            if experience:
                st.session_state.routing_answers["experience"] = experience
                st.session_state.routing_step = 4
                save_progress()
                st.rerun()
            else:
                st.warning("Please select your experience level.")

    elif step == 4:
        # Confirmation + training preview
        st.markdown("### Review Your Information")
        st.markdown("Please confirm your details before starting training.")

        area = st.session_state.routing_answers.get("area", "")
        program_display = st.session_state.routing_answers.get("program_format_display", "")
        experience = st.session_state.routing_answers.get("experience", "")

        st.markdown(f"- **Area:** {area}")
        st.markdown(f"- **Program:** {program_display}")
        st.markdown(f"- **Experience:** {experience}")

        st.divider()

        # Training preview
        program = st.session_state.routing_answers.get("program", "")
        fmt = st.session_state.routing_answers.get("format", "")
        st.markdown("### What to Expect")
        st.markdown(
            f"Your training is tailored for **{program} - {fmt}** missionaries. "
            "You will be guided through a series of questions covering:"
        )
        st.markdown(
            "- Accessing essential systems (My Gatherings portal)\n"
            "- Contacting and connecting with your students\n"
            "- Preparing for and conducting gatherings\n"
            "- Tools and resources for your role"
        )

        st.divider()

        col1, col2 = st.columns(2)
        with col1:
            if st.button("Edit Answers", use_container_width=True):
                st.session_state.routing_step = 1
                save_progress()
                st.rerun()
        with col2:
            if st.button("Start Training", type="primary", use_container_width=True):
                transition_to_training()
                st.rerun()


# =============================================================================
# TRAINING PHASE - QUESTION RENDERERS
# =============================================================================

def render_yes_no_question(q):
    """
    Render a yes/no question with branching.

    No OpenAI call - just branches based on Yes/No answer.
    If the question has what_to_do content and the user answers Yes,
    shows that content before advancing.
    If refer_on_no == 'yes', answering No shows a trainer referral warning.
    """
    q_id = q["question_id"]

    # Show the question text
    st.markdown(q["question"])
    st.divider()

    # Check if we're showing tips/content after a Yes answer
    if st.session_state.show_feedback and st.session_state.last_result:
        result = st.session_state.last_result

        if result.get("show_tips"):
            # Show the tips content
            st.info(result["tips_content"])
            if st.button("Continue", type="primary", key=f"tips_continue_{q_id}"):
                advance_to_question(result["next_id"])
                st.rerun()
            return

        if result.get("refer_to_trainer"):
            # User answered No on a refer_on_no question
            st.warning(
                "Please contact your trainer for assistance. "
                "Do not proceed until you can answer Yes."
            )
            if st.button("Try Again", key=f"retry_{q_id}"):
                st.session_state.show_feedback = False
                st.session_state.last_result = None
                st.rerun()
            return

    # Render Yes/No buttons
    col1, col2 = st.columns(2)

    with col1:
        if st.button("Yes", key=f"yes_{q_id}", use_container_width=True):
            next_yes = str(q.get("next_yes", "")) if pd.notna(q.get("next_yes")) else ""
            what_to_do = str(q.get("what_to_do", "")) if pd.notna(q.get("what_to_do")) else ""

            st.session_state.answers[q_id] = "Yes"

            if what_to_do.strip():
                # Show tips before advancing
                st.session_state.show_feedback = True
                st.session_state.last_result = {
                    "show_tips": True,
                    "tips_content": what_to_do,
                    "next_id": next_yes,
                }
                st.rerun()
            else:
                advance_to_question(next_yes)
                st.rerun()

    with col2:
        if st.button("No", key=f"no_{q_id}", use_container_width=True):
            next_no = str(q.get("next_no", "")) if pd.notna(q.get("next_no")) else ""
            refer_on_no = str(q.get("refer_on_no", "no")).strip().lower()

            st.session_state.answers[q_id] = "No"

            if refer_on_no == "yes":
                # Show trainer referral, stay on question
                st.session_state.show_feedback = True
                st.session_state.last_result = {"refer_to_trainer": True}
                st.rerun()
            else:
                advance_to_question(next_no)
                st.rerun()


def render_text_question(q):
    """
    Render a freeform text question.

    Submits to OpenAI evaluate_answer() for evaluation.
    Maintains conversation history for this question across multiple attempts.
    Advances based on LLM's should_advance decision.
    """
    q_id = q["question_id"]

    # Show the question text
    st.markdown(q["question"])

    # Show content if present (e.g., sample messages for S6)
    content = str(q.get("content", "")) if pd.notna(q.get("content")) else ""
    if content.strip():
        st.markdown(content)

    st.divider()

    # Get conversation history for this question
    if q_id not in st.session_state.conversation_history:
        st.session_state.conversation_history[q_id] = []

    # Show feedback if available
    if st.session_state.show_feedback and st.session_state.last_result:
        result = st.session_state.last_result

        if result["is_correct"]:
            st.success("Great answer!")
        else:
            st.warning("Let's review your answer.")

        st.markdown(result["feedback"])
        st.divider()

        next_default = str(q.get("next_default", "")) if pd.notna(q.get("next_default")) else ""

        # Check if LLM says we should advance
        if result.get("should_advance", False):
            if st.button("Continue to Next Step", type="primary", key=f"continue_{q_id}"):
                # Clear conversation history for this question when advancing
                st.session_state.conversation_history[q_id] = []
                advance_to_question(next_default)
                st.rerun()
        else:
            if st.button("Try Again", key=f"retry_{q_id}"):
                st.session_state.show_feedback = False
                st.session_state.last_result = None
                st.rerun()
        return

    # Render text input
    user_answer = st.text_area(
        "Your answer:",
        key=f"answer_{q_id}",
        height=150,
        placeholder="Type your answer here...",
    )

    if st.button("Submit Answer", key=f"submit_{q_id}"):
        if not user_answer.strip():
            st.warning("Please enter an answer before submitting.")
            return

        correct_answer = str(q.get("correct_answer", "")) if pd.notna(q.get("correct_answer")) else ""
        what_to_do = str(q.get("what_to_do", "")) if pd.notna(q.get("what_to_do")) else ""

        with st.spinner("Evaluating your answer..."):
            result = evaluate_answer(
                question=q["question"],
                correct_answer=correct_answer,
                user_answer=user_answer,
                instructions=what_to_do,
                conversation_history=st.session_state.conversation_history[q_id]
            )

        # Add this attempt to the conversation history
        st.session_state.conversation_history[q_id].append({
            "answer": user_answer,
            "feedback": result["feedback"]
        })

        st.session_state.last_result = result
        st.session_state.answers[q_id] = user_answer
        st.session_state.show_feedback = True
        st.rerun()


def render_info_question(q):
    """
    Render an informational step (display-only).

    Shows question title + content with a Continue button. No input, no evaluation.
    Used for Zoom placeholder steps in Virtual training.
    """
    q_id = q["question_id"]

    # Show the question as a heading
    st.markdown(f"### {q['question']}")

    # Show content if present
    content = str(q.get("content", "")) if pd.notna(q.get("content")) else ""
    if content.strip():
        st.markdown(content)

    st.divider()

    next_default = str(q.get("next_default", "")) if pd.notna(q.get("next_default")) else ""

    if st.button("Continue", type="primary", key=f"continue_{q_id}"):
        advance_to_question(next_default)
        st.rerun()


def render_choice_question(q):
    """
    Render a multiple choice question.

    Shows radio buttons for the choices. When a choice is selected,
    displays the corresponding message from the content JSON (if available).
    No OpenAI evaluation - just shows info and continues.

    Used for S6 (contact method selection).
    """
    q_id = q["question_id"]

    # Show the question text
    st.markdown(q["question"])
    st.divider()

    # Parse choices from pipe-delimited string
    choices_str = str(q.get("choices", "")) if pd.notna(q.get("choices")) else ""
    if not choices_str.strip():
        st.error("No choices available for this question.")
        return

    choices = [c.strip() for c in choices_str.split("|")]

    # Check if we're showing the selected message
    if st.session_state.show_feedback and st.session_state.last_result:
        result = st.session_state.last_result
        selected_choice = result.get("selected_choice", "")
        message = result.get("message", "")

        st.info(f"**Sample message for {selected_choice}:**")
        st.markdown(message)
        st.divider()

        next_default = str(q.get("next_default", "")) if pd.notna(q.get("next_default")) else ""

        if st.button("Continue", type="primary", key=f"continue_{q_id}"):
            advance_to_question(next_default)
            st.rerun()
        return

    # Render radio buttons
    selected = st.radio(
        "Select an option:",
        choices,
        key=f"choice_{q_id}",
        index=None,
    )

    if st.button("View Sample Message", key=f"submit_{q_id}", disabled=selected is None):
        if selected:
            # Parse the content JSON to get messages for each choice
            content = str(q.get("content", "")) if pd.notna(q.get("content")) else ""
            message = ""

            if content.strip():
                try:
                    messages_dict = json.loads(content)
                    message = messages_dict.get(selected, "Sample message not available.")
                except (json.JSONDecodeError, KeyError):
                    message = "Sample message not available."

            # Store the result and show the message
            st.session_state.last_result = {
                "selected_choice": selected,
                "message": message,
            }
            st.session_state.answers[q_id] = selected
            st.session_state.show_feedback = True
            st.rerun()


def render_expandable_question(q):
    """
    Render an expandable question with st.expander() sections.

    The content column contains JSON: [{"title": "...", "detail": "..."}]
    Shows each topic as an expandable section the missionary can click to read more.
    """
    q_id = q["question_id"]

    # Show the question text
    st.markdown(q["question"])
    st.divider()

    # Parse the expandable content from JSON
    content = str(q.get("content", "")) if pd.notna(q.get("content")) else ""
    if content.strip():
        try:
            items = json.loads(content)
            for item in items:
                with st.expander(item["title"]):
                    st.markdown(item["detail"])
        except (json.JSONDecodeError, KeyError):
            st.warning("Error loading expandable content.")

    st.divider()

    next_default = str(q.get("next_default", "")) if pd.notna(q.get("next_default")) else ""

    if st.button("Complete Training", type="primary", key=f"complete_{q_id}"):
        advance_to_question(next_default)
        st.rerun()


# =============================================================================
# TRAINING PHASE - MAIN DISPATCHER
# =============================================================================

def render_training_phase():
    """
    Render the training phase UI.

    Loads the program-specific CSV, looks up the current question by ID,
    and dispatches to the appropriate renderer based on question_type.
    """
    # Load questions from the selected CSV
    questions_df = load_questions(st.session_state.training_csv_path)
    total_questions = len(questions_df)

    # Check for empty CSV (EnglishConnect placeholders)
    if total_questions == 0:
        st.title("New Missionary Orientation")
        st.info(
            "Training content for this program is not yet available. "
            "Please check back later or contact your trainer."
        )
        if st.button("Go Back", type="primary"):
            st.session_state.phase = "routing"
            st.session_state.routing_step = 4
            save_progress()
            st.rerun()
        return

    # Check if training is done
    if st.session_state.training_done:
        st.session_state.phase = "complete"
        save_progress()
        st.rerun()
        return

    # Header
    st.title("New Missionary Orientation")
    program = st.session_state.routing_answers.get("program", "")
    fmt = st.session_state.routing_answers.get("format", "")
    st.caption(f"Training: {program} - {fmt}")

    # Progress indicator
    completed_count = len(st.session_state.completed_questions)
    progress_pct = completed_count / total_questions if total_questions > 0 else 0
    st.progress(progress_pct)
    st.caption(f"Progress: {completed_count} of {total_questions} steps completed")

    st.divider()

    # Look up current question by ID
    current_q = get_question_by_id(questions_df, st.session_state.current_question_id)

    if current_q is None:
        st.error(f"Question '{st.session_state.current_question_id}' not found. Please contact your trainer.")
        return

    # Show step indicator
    q_id = current_q["question_id"]
    st.markdown(f"**Step {q_id}**")

    # Dispatch to the appropriate renderer
    question_type = str(current_q.get("question_type", "text")).strip()

    if question_type == "yes_no":
        render_yes_no_question(current_q)
    elif question_type == "text":
        render_text_question(current_q)
    elif question_type == "choice":
        render_choice_question(current_q)
    elif question_type == "info":
        render_info_question(current_q)
    elif question_type == "expandable":
        render_expandable_question(current_q)
    else:
        # Fallback to text
        render_text_question(current_q)


# =============================================================================
# COMPLETION SCREEN
# =============================================================================

def render_completion_screen():
    """Render the training completion screen."""
    st.title("New Missionary Orientation")

    program = st.session_state.routing_answers.get("program", "")
    fmt = st.session_state.routing_answers.get("format", "")
    area = st.session_state.routing_answers.get("area", "")

    st.success("Congratulations! You have completed the training.")
    st.balloons()

    st.markdown("### Summary")
    st.write(f"**Area:** {area}")
    st.write(f"**Program:** {program} - {fmt}")
    st.write(f"**Steps completed:** {len(st.session_state.completed_questions)}")

    if st.button("Start Over", key="completion_start_over"):
        clear_progress()
        st.rerun()


# =============================================================================
# SIDEBAR
# =============================================================================

def render_sidebar():
    """Render the sidebar with options and progress info."""
    with st.sidebar:
        st.markdown("### Options")

        if st.button("Start Over", key="sidebar_start_over"):
            clear_progress()
            st.rerun()

        st.divider()

        # Show routing info if available
        if st.session_state.routing_answers:
            st.markdown("### Your Info")
            area = st.session_state.routing_answers.get("area", "")
            program_display = st.session_state.routing_answers.get("program_format_display", "")
            experience = st.session_state.routing_answers.get("experience", "")
            if area:
                st.write(f"**Area:** {area}")
            if program_display:
                st.write(f"**Program:** {program_display}")
            if experience:
                st.write(f"**Experience:** {experience}")
            st.divider()

        # Show progress checklist during training
        if st.session_state.phase == "training" and st.session_state.training_csv_path:
            questions_df = load_questions(st.session_state.training_csv_path)
            current_id = st.session_state.current_question_id

            st.markdown("### Your Progress")
            for _, row in questions_df.iterrows():
                q_id = row["question_id"]
                if q_id in st.session_state.completed_questions:
                    st.markdown(f"- ~~{q_id}~~ Done")
                elif q_id == current_id:
                    st.markdown(f"- **{q_id}** (current)")
                else:
                    st.markdown(f"- {q_id}")


# =============================================================================
# MAIN APPLICATION
# =============================================================================

def main():
    """
    Main application function.

    Dispatches to the appropriate phase: routing, training, or complete.
    """
    initialize_session_state()

    # Try to load saved progress (only once per session)
    if not st.session_state.progress_loaded:
        saved_progress = load_progress()
        if saved_progress:
            st.session_state.phase = saved_progress.get("phase", "routing")
            st.session_state.routing_step = saved_progress.get("routing_step", 0)
            st.session_state.routing_answers = saved_progress.get("routing_answers", {})
            st.session_state.training_csv_path = saved_progress.get("training_csv_path", None)
            st.session_state.current_question_id = saved_progress.get("current_question_id", "S1")
            st.session_state.question_history = saved_progress.get("question_history", [])
            st.session_state.completed_questions = saved_progress.get("completed_questions", [])
            st.session_state.answers = saved_progress.get("answers", {})
            st.session_state.training_done = saved_progress.get("training_done", False)
            st.session_state.conversation_history = saved_progress.get("conversation_history", {})
            st.toast("Welcome back! Your progress has been restored.")
        st.session_state.progress_loaded = True

    # Phase dispatcher
    if st.session_state.phase == "routing":
        render_routing_phase()
    elif st.session_state.phase == "training":
        render_training_phase()
    elif st.session_state.phase == "complete":
        render_completion_screen()

    # Sidebar (always visible)
    render_sidebar()


# =============================================================================
# RUN THE APP
# =============================================================================

if __name__ == "__main__":
    main()
