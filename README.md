# Pathway New Missionary Orientation

A training quiz application for New Missionary Orientation (NMO) built with Streamlit and OpenAI. The app presents questions to missionaries, evaluates their responses using AI, and tracks their progress.

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd pathway-new-missionary-orientation

# 2. Create virtual environment
python -m venv venv
source .venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# 5. Run the app
streamlit run src/app.py
```

The app will open in your browser at `http://localhost:8501`.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Streamlit UI                                 │   │
│  │  • Displays questions                                                │   │
│  │  • Captures user input (text, yes/no, multiple choice)              │   │
│  │  • Shows feedback and progress                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Browser localStorage                            │   │
│  │  • Stores progress (current question, completed questions)          │   │
│  │  • Persists across browser sessions                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STREAMLIT SERVER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        src/app.py                                    │   │
│  │  • Loads questions from CSV                                          │   │
│  │  • Manages session state                                             │   │
│  │  • Orchestrates evaluation flow                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│            ┌───────────────────────┴───────────────────────┐               │
│            ▼                                               ▼               │
│  ┌──────────────────────┐                    ┌──────────────────────┐      │
│  │   questions.csv      │                    │     OpenAI API       │      │
│  │   (Data Source)      │                    │   (AI Evaluation)    │      │
│  │                      │                    │                      │      │
│  │  • Question text     │                    │  • Evaluates answers │      │
│  │  • Correct answers   │                    │  • Returns JSON:     │      │
│  │  • Feedback messages │                    │    - is_correct      │      │
│  │  • Question types    │                    │    - feedback        │      │
│  └──────────────────────┘                    │    - refer_to_trainer│      │
│                                              └──────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
pathway-new-missionary-orientation/
├── src/
│   ├── app.py              # Main training bot application (Streamlit)
│   └── crawler.py          # Rise360 course scraper (standalone tool)
├── data/
│   └── questions.csv       # Quiz questions (edit to change content)
├── docs/
│   └── IMPLEMENTATION_PLAN.md  # Detailed guide for developers
├── requirements.txt        # Python dependencies
├── .env.example            # Template for environment variables
├── .env                    # Your API key (gitignored)
├── .gitignore
├── LICENSE
└── README.md               # This file
```

---

## Applications

### Training Bot (`src/app.py`)

The main application - a Streamlit web app that:
- Presents training questions to missionaries
- Evaluates their answers using OpenAI
- Provides feedback based on correctness
- Tracks progress in browser localStorage

**Run:** `streamlit run src/app.py`

### Rise360 Crawler (`src/crawler.py`)

A standalone utility that:
- Crawls Rise360 courses using Playwright
- Converts course content to Markdown format
- Saves structured output for documentation

**Run:** `python src/crawler.py --url "https://rise.articulate.com/share/..." --output-dir output`

*Note: The crawler requires Playwright browsers to be installed: `playwright install chromium`*

---

## CSV Format

Edit `data/questions.csv` to change quiz content:

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `question_id` | Yes | Unique identifier | `Q1`, `Q2` |
| `question` | Yes | Question text (supports multiline) | `What is your area?` |
| `correct_answer` | Yes | Criteria for correct answer | `Any of the 24 areas` |
| `feedback_correct` | Yes | Message when correct | `Great job!` |
| `feedback_incorrect` | Yes | Message when incorrect | `Please try again.` |
| `question_type` | Yes | `text`, `yes_no`, or `choice` | `text` |
| `choices` | No | For choice type, separated by `\|` | `Option A\|Option B` |
| `refer_to_trainer` | No | `yes` to escalate wrong answers | `yes` |

---

## Next Steps

### Phase 1: MVP Testing (Current)
- [ ] Get OpenAI API key and add to `.env`
- [ ] Test all sample questions
- [ ] Demo to Elder Edwards for feedback
- [ ] Refine questions based on feedback

### Phase 2: Content Finalization
- [ ] Elder Edwards provides complete question set
- [ ] Update `data/questions.csv` with final content
- [ ] Test full question flow end-to-end

### Phase 3: Deployment
- [ ] Deploy to Streamlit Cloud
- [ ] Set up `OPENAI_API_KEY` in deployment secrets
- [ ] Share URL with missionary trainers

### Phase 4: Enhancements (Post-MVP)
- [ ] Analytics and tracking
- [ ] Branching questions
- [ ] PDF completion reports
- [ ] Multiple language support

---

## Development

### Prerequisites
- Python 3.9+
- OpenAI API key

### Setup
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env
```

### Run Training Bot
```bash
streamlit run src/app.py
```

### Run Crawler (optional)
```bash
playwright install chromium
python src/crawler.py --help
```

---

## Documentation

- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - Detailed guide for developers
- **[Questions CSV](data/questions.csv)** - Quiz content (editable)

---

## License

Internal use only - Pioneer Academy / BYU-Pathway Worldwide
