# BYU-Pathway New Missionary Orientation - Question Generator

This project generates assessment questions from BYU-Pathway missionary orientation course content using AI.

## Project Overview

**Goal:** Create an assessment chatbot that tests missionaries' knowledge and recommends only the training pages they need.

**Workflow:**
1. **Crawler** extracts course content from Rise360 to markdown files
2. **Question Generator** creates 2-3 assessment questions per page using GPT-4o-mini
3. **Chatbot** (future) presents questions and provides personalized training recommendations

## Setup

### 1. Clone and Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### 2. Install Playwright Browsers

```bash
# Install Chromium for web crawling
playwright install chromium
playwright install-deps chromium  # System dependencies (requires sudo)
```

**Note:** If you encounter network issues with `playwright install chromium`, try:
- Using a different network connection
- Using a VPN
- Downloading browsers manually from the [Playwright releases](https://github.com/microsoft/playwright/releases)

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# Get your key from: https://platform.openai.com/api-keys
```

## Usage

### Step 1: Run the Crawler

Extract course content from Rise360 to markdown files:

```bash
source venv/bin/activate
python src/main.py
```

This will create markdown files in `docs/output/`:
- `01_Introduction.md`
- `Module_01_*/01_*.md` through `Module_06_*/02_*.md`
- Total: 22 pages (1 intro + 21 lessons)

### Step 2: Generate Questions

Create assessment questions from the crawled content:

```bash
source venv/bin/activate
python src/question_generator.py
```

**Outputs:**
- `docs/questions.yaml` - Structured YAML for programmatic use
- `docs/questions_review.txt` - Simple text format for Elder Edwards review

### Configuration

Edit `.env` to customize:

```bash
OPENAI_MODEL=gpt-4o-mini           # Model for question generation
QUESTIONS_PER_PAGE=3                # Questions per page (2-4 recommended)
QUESTION_TEMPERATURE=0.7            # Creativity (0.0-1.0)
```

## Course Structure

**New Missionary Orientation for BYU-Pathway** (22 pages total)

1. **Introduction** - Serving with BYU-Pathway Worldwide
2. **Module 1: Access to Essential Systems** (3 lessons)
3. **Module 2: Zoom for Virtual Gatherings** (7 lessons)
4. **Module 3: Contacting Your Students** (4 lessons)
5. **Module 4: Your First Gathering** (3 lessons)
6. **Module 5: Learning More About the Student Information System** (3 lessons)
7. **Module 6: Next Steps in Your Orientation Training** (2 lessons)

## Question Format

Each page has 2-3 questions testing:
- **Comprehension** - Understanding key concepts
- **Application** - How to perform tasks

Questions focus on essential knowledge - if missionaries can answer them correctly, they can skip that page.

