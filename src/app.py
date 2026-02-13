"""
NMO Training Bot - Main Application
====================================

This is the main Streamlit application for the New Missionary Orientation training tool.
It uses a two-phase flow:
  1. Routing phase: Collects missionary's area, program, and format
  2. Training phase: Loads program-specific questions from a CSV and evaluates answers

To run this app (from project root):
    streamlit run src/app.py

Author: Pioneer Academy Team
Version: 2.0
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
# Install with: pip install streamlit-js-eval
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
    ("PathwayConnect", "Virtual"):   PROJECT_ROOT / "data" / "pathwayconnect_virtual.csv",
    ("PathwayConnect", "In-Person"): PROJECT_ROOT / "data" / "pathwayconnect_inperson.csv",
    ("EnglishConnect", "Virtual"):   PROJECT_ROOT / "data" / "englishconnect_virtual.csv",
    ("EnglishConnect", "In-Person"): PROJECT_ROOT / "data" / "englishconnect_inperson.csv",
}

# localStorage key for saving progress
STORAGE_KEY = "nmo_training_progress"


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

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
        st.error(f"Training content not found for this program/format. Please contact your trainer.")
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


def evaluate_answer(question: str, correct_answer: str, user_answer: str, instructions: str) -> dict:
    """
    Use OpenAI to evaluate if the user's answer is correct.

    Args:
        question: The question that was asked
        correct_answer: The expected/correct answer criteria
        user_answer: What the user typed
        instructions: What to do if correct/incorrect (from CSV)

    Returns:
        dict with keys:
            - is_correct (bool): Whether the answer is acceptable
            - feedback (str): Message to show the user
            - refer_to_trainer (bool): Whether to escalate to human trainer
    """
    client = get_openai_client()

    # Build the prompt for OpenAI
    # We ask it to return JSON so we can parse the response reliably
    system_prompt = """You are an evaluator for a missionary training program.
Your job is to determine if a trainee's answer is acceptable and provide helpful feedback.

You MUST respond with valid JSON in this exact format:
{
    "is_correct": true or false,
    "feedback": "Your feedback message here",
    "refer_to_trainer": true or false
}

Be encouraging but accurate. If the answer is partially correct, you may accept it
but note what could be improved in your feedback."""

    user_prompt = f"""Evaluate this trainee's answer:

QUESTION: {question}

CORRECT ANSWER CRITERIA: {correct_answer}

INSTRUCTIONS FOR EVALUATION: {instructions}

TRAINEE'S ANSWER: {user_answer}

Remember to respond with JSON only."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use gpt-4o-mini for cost efficiency
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},  # Force JSON response
            temperature=0.3  # Lower temperature = more consistent responses
        )

        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)

        return {
            "is_correct": result.get("is_correct", False),
            "feedback": result.get("feedback", "Unable to evaluate your answer."),
            "refer_to_trainer": result.get("refer_to_trainer", False)
        }

    except json.JSONDecodeError:
        # If OpenAI didn't return valid JSON, handle gracefully
        return {
            "is_correct": False,
            "feedback": "There was an error evaluating your answer. Please try again.",
            "refer_to_trainer": False
        }
    except Exception as e:
        # Handle any other errors (network issues, API errors, etc.)
        st.error(f"Error calling OpenAI: {e}")
        return {
            "is_correct": False,
            "feedback": "There was an error connecting to the evaluation service. Please try again.",
            "refer_to_trainer": False
        }


def save_progress():
    """
    Save current progress to browser localStorage.

    This allows the user to close the browser and resume later.
    Saves both routing state and training state.
    """
    progress = {
        # Routing state
        "phase": st.session_state.phase,
        "routing_step": st.session_state.routing_step,
        "routing_answers": st.session_state.routing_answers,
        "training_csv_path": st.session_state.training_csv_path,
        # Training state
        "current_question_index": st.session_state.current_question_index,
        "completed_questions": st.session_state.completed_questions,
        "answers": st.session_state.answers,
    }

    # Convert to JSON string and save to localStorage
    progress_json = json.dumps(progress)
    # Escape single quotes to prevent JS string breakage
    safe_json = progress_json.replace("'", "\\'")

    # This JavaScript code runs in the browser to save to localStorage
    streamlit_js_eval(
        js_expressions=f"localStorage.setItem('{STORAGE_KEY}', '{safe_json}')",
        key=f"save_progress_{st.session_state.phase}_{st.session_state.routing_step}_{st.session_state.current_question_index}"
    )


def load_progress():
    """
    Load progress from browser localStorage.

    Returns the saved progress data, or None if no saved data exists.
    """
    # This JavaScript code runs in the browser to read from localStorage
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
    """
    Clear all saved progress from localStorage and reset session state.

    Used when the user wants to start over.
    """
    # Clear localStorage
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
    st.session_state.current_question_index = 0
    st.session_state.completed_questions = []
    st.session_state.answers = {}
    st.session_state.show_feedback = False
    st.session_state.last_result = None


def initialize_session_state():
    """
    Initialize all session state variables.

    Session state persists across Streamlit reruns (but NOT across browser closes).
    """
    # Routing phase state
    if "phase" not in st.session_state:
        st.session_state.phase = "routing"

    if "routing_step" not in st.session_state:
        st.session_state.routing_step = 0

    if "routing_answers" not in st.session_state:
        st.session_state.routing_answers = {}

    if "training_csv_path" not in st.session_state:
        st.session_state.training_csv_path = None

    # Training phase state
    if "current_question_index" not in st.session_state:
        st.session_state.current_question_index = 0

    if "completed_questions" not in st.session_state:
        st.session_state.completed_questions = []

    if "answers" not in st.session_state:
        st.session_state.answers = {}

    if "show_feedback" not in st.session_state:
        st.session_state.show_feedback = False

    if "last_result" not in st.session_state:
        st.session_state.last_result = None

    if "progress_loaded" not in st.session_state:
        st.session_state.progress_loaded = False


def render_question(question_row):
    """
    Render the appropriate input widget based on question type.

    Args:
        question_row: A row from the questions DataFrame

    Returns:
        The user's answer (string)
    """
    question_type = question_row.get("question_type", "text")
    question_id = question_row["question_id"]

    if question_type == "yes_no":
        # Render Yes/No buttons
        col1, col2 = st.columns(2)

        with col1:
            if st.button("Yes", key=f"yes_{question_id}", use_container_width=True):
                return "Yes"

        with col2:
            if st.button("No", key=f"no_{question_id}", use_container_width=True):
                return "No"

        return None  # No button pressed yet

    elif question_type == "choice":
        # Render multiple choice options
        choices_str = question_row.get("choices", "")
        if choices_str:
            choices = [c.strip() for c in choices_str.split("|")]
            selected = st.radio(
                "Select your answer:",
                choices,
                key=f"choice_{question_id}",
                index=None  # No default selection
            )

            if st.button("Submit Answer", key=f"submit_{question_id}"):
                return selected

        return None

    else:
        # Default to text input
        user_answer = st.text_area(
            "Your answer:",
            key=f"answer_{question_id}",
            height=150,
            placeholder="Type your answer here..."
        )

        if st.button("Submit Answer", key=f"submit_{question_id}"):
            if user_answer.strip():
                return user_answer
            else:
                st.warning("Please enter an answer before submitting.")

        return None


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
    st.session_state.current_question_index = 0
    st.session_state.completed_questions = []
    st.session_state.answers = {}
    st.session_state.show_feedback = False
    st.session_state.last_result = None

    save_progress()


# =============================================================================
# ROUTING PHASE
# =============================================================================

TOTAL_ROUTING_STEPS = 6


def render_routing_phase():
    """
    Render the routing phase UI.

    Collects the missionary's area, program, format, and experience level
    before starting training. No OpenAI calls - just collecting information.

    Steps:
        0: Welcome
        1: Area assignment
        2: Program (PathwayConnect / EnglishConnect)
        3: Format (Virtual / In-Person)
        4: Experience level
        5: Confirmation + training preview
    """
    st.title("New Missionary Orientation")

    # Progress for routing
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
        # Area question
        st.markdown("### What is your area assignment?")
        st.markdown(
            "What area will you be assigned to for your gathering? "
            "Type \"I don't know\" if you are unsure."
        )
        area = st.text_input(
            "Your area:",
            key="routing_area",
            placeholder="e.g., North America West"
        )
        if st.button("Continue", type="primary"):
            if area.strip():
                st.session_state.routing_answers["area"] = area.strip()
                st.session_state.routing_step = 2
                save_progress()
                st.rerun()
            else:
                st.warning("Please enter your area or type \"I don't know\".")

    elif step == 2:
        # Program question
        st.markdown("### What program will you be working with?")
        program = st.radio(
            "Select your program:",
            ["PathwayConnect", "EnglishConnect"],
            key="routing_program",
            index=None
        )
        if st.button("Continue", type="primary"):
            if program:
                st.session_state.routing_answers["program"] = program
                st.session_state.routing_step = 3
                save_progress()
                st.rerun()
            else:
                st.warning("Please select a program.")

    elif step == 3:
        # Format question
        st.markdown("### What format will your gatherings be?")
        format_choice = st.radio(
            "Select your format:",
            ["Virtual", "In-Person"],
            key="routing_format",
            index=None
        )
        if st.button("Continue", type="primary"):
            if format_choice:
                st.session_state.routing_answers["format"] = format_choice
                st.session_state.routing_step = 4
                save_progress()
                st.rerun()
            else:
                st.warning("Please select a format.")

    elif step == 4:
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
            index=None
        )
        if st.button("Continue", type="primary"):
            if experience:
                st.session_state.routing_answers["experience"] = experience
                st.session_state.routing_step = 5
                save_progress()
                st.rerun()
            else:
                st.warning("Please select your experience level.")

    elif step == 5:
        # Confirmation + training preview
        st.markdown("### Review Your Information")
        st.markdown("Please confirm your details before starting training.")

        area = st.session_state.routing_answers.get("area", "")
        program = st.session_state.routing_answers.get("program", "")
        fmt = st.session_state.routing_answers.get("format", "")
        experience = st.session_state.routing_answers.get("experience", "")

        st.markdown(f"- **Area:** {area}")
        st.markdown(f"- **Program:** {program}")
        st.markdown(f"- **Format:** {fmt}")
        st.markdown(f"- **Experience:** {experience}")

        st.divider()

        # Training preview
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
        st.markdown("Estimated time: **20-30 minutes**")

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
# TRAINING PHASE
# =============================================================================

def render_training_phase():
    """
    Render the training phase UI.

    Loads program-specific questions and walks the user through them,
    evaluating answers with OpenAI.
    """
    # Load questions from the selected CSV
    questions_df = load_questions(st.session_state.training_csv_path)
    total_questions = len(questions_df)

    # Header
    st.title("New Missionary Orientation")
    program = st.session_state.routing_answers.get("program", "")
    fmt = st.session_state.routing_answers.get("format", "")
    st.caption(f"Training: {program} - {fmt}")

    # Progress indicator
    completed_count = len(st.session_state.completed_questions)
    progress_pct = completed_count / total_questions if total_questions > 0 else 0

    st.progress(progress_pct)
    st.caption(f"Progress: {completed_count} of {total_questions} questions completed")

    st.divider()

    # Check if training is complete
    if st.session_state.current_question_index >= total_questions:
        st.session_state.phase = "complete"
        save_progress()
        st.rerun()
        return

    # Display current question
    current_index = st.session_state.current_question_index
    current_question = questions_df.iloc[current_index]

    st.markdown(f"### Question {current_index + 1} of {total_questions}")
    st.markdown(current_question["question"])

    st.divider()

    # Render input and handle submission
    if not st.session_state.show_feedback:
        user_answer = render_question(current_question)

        if user_answer is not None:
            # User submitted an answer - evaluate it
            with st.spinner("Evaluating your answer..."):
                result = evaluate_answer(
                    question=current_question["question"],
                    correct_answer=current_question["correct_answer"],
                    user_answer=user_answer,
                    instructions=current_question.get("feedback_incorrect", "")
                )

            # Store the result and show feedback
            st.session_state.last_result = result
            st.session_state.answers[current_question["question_id"]] = user_answer
            st.session_state.show_feedback = True
            st.rerun()

    # Show feedback
    if st.session_state.show_feedback and st.session_state.last_result:
        result = st.session_state.last_result

        if result["is_correct"]:
            st.success("Correct!")
            st.markdown(result["feedback"])

            # Also show the "correct" feedback from CSV if available
            if pd.notna(current_question.get("feedback_correct")):
                st.info(current_question["feedback_correct"])

            # Mark as completed
            question_id = current_question["question_id"]
            if question_id not in st.session_state.completed_questions:
                st.session_state.completed_questions.append(question_id)

            # Save progress
            save_progress()

            # Show "Continue" button
            if st.button("Continue to Next Question", type="primary"):
                st.session_state.current_question_index += 1
                st.session_state.show_feedback = False
                st.session_state.last_result = None
                save_progress()
                st.rerun()

        else:
            st.error("Not quite right. Please try again.")
            st.markdown(result["feedback"])

            # Check if we need to refer to trainer
            if result.get("refer_to_trainer") or current_question.get("refer_to_trainer") == "yes":
                st.warning("Please contact your trainer for assistance with this question.")

            # Show "Try Again" button
            if st.button("Try Again"):
                st.session_state.show_feedback = False
                st.session_state.last_result = None
                st.rerun()


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
    st.write(f"**Questions completed:** {len(st.session_state.completed_questions)}")

    if st.button("Start Over"):
        clear_progress()
        st.rerun()


# =============================================================================
# SIDEBAR
# =============================================================================

def render_sidebar():
    """Render the sidebar with options and progress info."""
    with st.sidebar:
        st.markdown("### Options")

        if st.button("Start Over"):
            if st.session_state.phase != "routing" or st.session_state.routing_step > 0:
                st.warning("This will reset all your progress. Click again to confirm.")
                if st.button("Yes, Reset Everything", type="secondary"):
                    clear_progress()
                    st.rerun()
            else:
                clear_progress()
                st.rerun()

        st.divider()

        # Show routing info if available
        if st.session_state.routing_answers:
            st.markdown("### Your Info")
            for key, value in st.session_state.routing_answers.items():
                st.write(f"**{key.title()}:** {value}")
            st.divider()

        # Show progress checklist during training
        if st.session_state.phase == "training" and st.session_state.training_csv_path:
            questions_df = load_questions(st.session_state.training_csv_path)
            current_index = st.session_state.current_question_index

            st.markdown("### Your Progress")
            for i, row in questions_df.iterrows():
                q_id = row["question_id"]
                if q_id in st.session_state.completed_questions:
                    st.markdown(f"- [x] {q_id}")
                elif i == current_index:
                    st.markdown(f"- **{q_id}** (current)")
                else:
                    st.markdown(f"- [ ] {q_id}")


# =============================================================================
# MAIN APPLICATION
# =============================================================================

def main():
    """
    Main application function.

    Dispatches to the appropriate phase: routing, training, or complete.
    """
    # Initialize session state variables
    initialize_session_state()

    # Try to load saved progress (only once per session)
    if not st.session_state.progress_loaded:
        saved_progress = load_progress()
        if saved_progress:
            st.session_state.phase = saved_progress.get("phase", "routing")
            st.session_state.routing_step = saved_progress.get("routing_step", 0)
            st.session_state.routing_answers = saved_progress.get("routing_answers", {})
            st.session_state.training_csv_path = saved_progress.get("training_csv_path", None)
            st.session_state.current_question_index = saved_progress.get("current_question_index", 0)
            st.session_state.completed_questions = saved_progress.get("completed_questions", [])
            st.session_state.answers = saved_progress.get("answers", {})
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
