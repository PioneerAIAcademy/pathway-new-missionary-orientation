# NMO Training Bot - Implementation Plan for Developers

**Version:** 1.0 (MVP)
**Target:** Entry-level engineers
**Estimated Time:** 5 days

---

## Overview

You're building a training quiz app for new missionaries. The app:
1. Shows questions from a CSV file
2. Accepts user answers
3. Uses OpenAI to evaluate if the answer is correct
4. Shows feedback based on whether they got it right
5. Remembers progress using browser storage

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repo-url>
cd pathway-new-missionary-orientation
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv

# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install streamlit openai pandas python-dotenv streamlit-js-eval
```

Create `requirements.txt`:
```
streamlit==1.31.0
openai==1.12.0
pandas==2.2.0
python-dotenv==1.0.0
streamlit-js-eval==0.1.7
```

### Step 4: Set Up Environment Variables

Create a file called `.env` in your project folder:
```
OPENAI_API_KEY=sk-your-api-key-here
```

**IMPORTANT:** Never commit this file to git! Add it to `.gitignore`.

### Step 5: Create `.gitignore`

```
.env
venv/
__pycache__/
.streamlit/secrets.toml
```

---

## Project Structure

```
pathway-new-missionary-orientation/
├── src/
│   ├── app.py             # Main application (start here!)
│   └── crawler.py         # Rise360 scraper (optional tool, not used in MVP)
├── data/
│   └── questions.csv      # Quiz questions
├── docs/
│   └── IMPLEMENTATION_PLAN.md  # This file
├── requirements.txt       # Python dependencies
├── .env                   # API key (don't commit!)
├── .env.example           # Template for .env
├── .gitignore
└── README.md
```

---

## How the App Works (Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                        STREAMLIT APP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. LOAD DATA                                                   │
│     └── Read questions.csv using pandas                         │
│                                                                 │
│  2. CHECK PROGRESS                                              │
│     └── Read from browser localStorage                          │
│         - Which questions have been answered?                   │
│         - What question are we on?                              │
│                                                                 │
│  3. DISPLAY CURRENT QUESTION                                    │
│     └── Show question text                                      │
│     └── Show text input or Yes/No buttons                       │
│                                                                 │
│  4. WHEN USER SUBMITS ANSWER                                    │
│     └── Send to OpenAI for evaluation                           │
│         - Question text                                         │
│         - Correct answer criteria                               │
│         - User's answer                                         │
│     └── OpenAI returns: is_correct + feedback                   │
│                                                                 │
│  5. SHOW FEEDBACK                                               │
│     └── Display success/error message                           │
│     └── Show instructional content if needed                    │
│                                                                 │
│  6. SAVE PROGRESS                                               │
│     └── Update localStorage with completed questions            │
│                                                                 │
│  7. MOVE TO NEXT QUESTION (if correct)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## CSV File Format

Your `questions.csv` needs these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `question_id` | Yes | Unique ID like Q1, Q2, Q3 |
| `question` | Yes | The question text shown to the user |
| `correct_answer` | Yes | What counts as a correct answer |
| `feedback_correct` | Yes | Message to show when they're right |
| `feedback_incorrect` | Yes | Message to show when they're wrong |
| `question_type` | Yes | `text`, `yes_no`, or `choice` |
| `choices` | No | For choice questions: options separated by `\|` |
| `refer_to_trainer` | No | `yes` if wrong answers need human help |

---

## Key Concepts for Entry-Level Devs

### What is Streamlit?
Streamlit is a Python library that turns Python scripts into web apps. You write Python, and it creates the HTML/CSS/JavaScript automatically.

```python
import streamlit as st

st.title("Hello!")           # Creates an <h1> heading
st.write("Some text")        # Creates a <p> paragraph
name = st.text_input("Name") # Creates an <input> field
```

### What is Session State?
Streamlit reruns your entire script every time the user interacts with the app. To remember values between reruns, use `st.session_state`:

```python
# Initialize a value (only runs once)
if "counter" not in st.session_state:
    st.session_state.counter = 0

# Update the value
st.session_state.counter += 1
```

### What is localStorage?
Browser localStorage lets you save data that persists even if the user closes the browser. We use the `streamlit-js-eval` library to access it from Python.

### What is OpenAI's API?
We send a prompt to OpenAI and get back a response. We'll ask it to evaluate whether the user's answer is correct.

---

## Implementation Steps

### Day 1: Basic App Structure

**Goal:** Display questions from CSV, navigate between them

**Tasks:**
1. Create `data/questions.csv` with sample questions
2. Create `app.py` with basic Streamlit structure
3. Load and display questions
4. Add "Next" and "Previous" buttons

**Test:** Can you see questions and navigate between them?

---

### Day 2: Answer Input & OpenAI Integration

**Goal:** Accept answers and evaluate them with AI

**Tasks:**
1. Add text input for answers
2. Set up OpenAI client
3. Create evaluation function
4. Display AI feedback

**Test:** Can you submit an answer and see if it's correct?

---

### Day 3: Different Question Types

**Goal:** Support yes/no and multiple choice questions

**Tasks:**
1. Add yes/no button rendering
2. Add multiple choice radio buttons
3. Route to correct input type based on `question_type`

**Test:** Do all three question types work?

---

### Day 4: Progress Persistence

**Goal:** Save and restore progress using localStorage

**Tasks:**
1. Install and configure `streamlit-js-eval`
2. Save completed questions to localStorage
3. Load progress on app start
4. Show progress indicator

**Test:** Close browser, reopen - does it remember where you were?

---

### Day 5: Polish & Testing

**Goal:** Clean up UI, handle edge cases, test thoroughly

**Tasks:**
1. Add completion screen
2. Add "Start Over" button
3. Handle API errors gracefully
4. Test with real questions from Elder Edwards
5. Deploy to Streamlit Cloud (optional)

---

## Testing Checklist

Before calling it "done", verify:

- [ ] App loads without errors
- [ ] All questions display correctly
- [ ] Text input questions work
- [ ] Yes/No questions work
- [ ] Multiple choice questions work (if implemented)
- [ ] Correct answers show success feedback
- [ ] Incorrect answers show error feedback
- [ ] Progress is saved when you close the browser
- [ ] Progress is restored when you reopen
- [ ] "Start Over" resets everything
- [ ] Completion screen shows when done
- [ ] API errors show a friendly message

---

## Common Issues & Solutions

### "ModuleNotFoundError: No module named 'streamlit'"
You forgot to activate your virtual environment. Run `source venv/bin/activate`.

### "openai.AuthenticationError"
Your API key is wrong or missing. Check your `.env` file.

### "FileNotFoundError: questions.csv"
Make sure the file is in the `data/` folder and the path is correct.

### "The app keeps resetting my answers"
You're not using `st.session_state`. All variables need to be stored there to persist between reruns.

### "localStorage isn't working"
Make sure you installed `streamlit-js-eval` and are using it correctly. Also, localStorage only works in a real browser, not in some embedded views.

---

## Deployment (When Ready)

### Option 1: Streamlit Cloud (Easiest)

1. Push code to GitHub
2. Go to share.streamlit.io
3. Connect your repo
4. Add `OPENAI_API_KEY` in the secrets section
5. Deploy!

### Option 2: Docker (More Control)

Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501"]
```

---

## Questions? Stuck?

1. Check this document first
2. Read the error message carefully
3. Google the error message
4. Ask your team lead
5. Check Streamlit docs: https://docs.streamlit.io

---

## Appendix: Useful Links

- [Streamlit Documentation](https://docs.streamlit.io)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [Pandas CSV Reading](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)
