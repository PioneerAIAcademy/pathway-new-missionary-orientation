"""
Question Generator for BYU-Pathway New Missionary Orientation
Generates assessment questions from crawled course content using OpenAI GPT-4o-mini.
"""

import os
import json
import yaml
import logging
from pathlib import Path
from typing import Dict, List, Any
from dotenv import load_dotenv
from openai import OpenAI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
QUESTIONS_PER_PAGE = int(os.getenv("QUESTIONS_PER_PAGE", "3"))
TEMPERATURE = float(os.getenv("QUESTION_TEMPERATURE", "0.7"))

# Course structure from crawler
COURSE_STRUCTURE = {
    "course_title": "New Missionary Orientation for BYU-Pathway",
    "introduction": {
        "title": "Introduction to Serving with BYU-Pathway Worldwide",
        "file": "01_Introduction.md"
    },
    "modules": [
        {
            "module_number": 1,
            "module_title": "Access to Essential Systems",
            "lessons": [
                {"title": "Access to a Zoom Account", "file": "01_Access_to_a_Zoom_Account.md"},
                {"title": "Access the Student Information System", "file": "02_Access_the_Student_Information_System.md"},
                {"title": "Access to Resources and Ongoing Training Material", "file": "03_Access_to_Resources_and_Ongoing_Training_Material.md"}
            ]
        },
        {
            "module_number": 2,
            "module_title": "Zoom for Virtual Gatherings",
            "lessons": [
                {"title": "Basic Zoom Skills for Your First Gathering", "file": "01_Basic_Zoom_Skills_for_Your_First_Gathering.md"},
                {"title": "Download and Install the Zoom App", "file": "02_Download_and_Install_the_Zoom_App.md"},
                {"title": "How to Open Your Zoom Room", "file": "03_How_to_Open_Your_Zoom_Room.md"},
                {"title": "Learn Your Zoom Room Tools", "file": "04_Learn_Your_Zoom_Room_Tools.md"},
                {"title": "How to Update Your Personal Profile", "file": "05_How_to_Update_Your_Personal_Profile.md"},
                {"title": "How to Share Your Screen in Zoom", "file": "06_How_to_Share_Your_Screen_in_Zoom.md"},
                {"title": "Share Your Zoom Room Link", "file": "07_Share_Your_Zoom_Room_Link.md"}
            ]
        },
        {
            "module_number": 3,
            "module_title": "Contacting Your Students",
            "lessons": [
                {"title": "Who Are Your Students?", "file": "01_Who_Are_Your_Students_.md"},
                {"title": "Contact Your Students", "file": "02_Contact_Your_Students.md"},
                {"title": "Send an Email Message or Group Chat", "file": "03_Send_an_Email_Message_or_Group_Chat.md"},
                {"title": "New Student Visits", "file": "04_New_Student_Visits.md"}
            ]
        },
        {
            "module_number": 4,
            "module_title": "Your First Gathering",
            "lessons": [
                {"title": "Your Role in the First Gathering", "file": "01_Your_Role_in_the_First_Gathering.md"},
                {"title": "Lead and Observing Students", "file": "02_Lead_and_Observing_Students.md"},
                {"title": "Former PathwayConnect Completer", "file": "03_Former_PathwayConnect_Completer.md"}
            ]
        },
        {
            "module_number": 5,
            "module_title": "Learning More About the Student Information System",
            "lessons": [
                {"title": "My Gatherings Portal and Student Information", "file": "01_My_Gatherings_Portal_and_Student_Information.md"},
                {"title": "Monitor Student Progress", "file": "02_Monitor_Student_Progress.md"},
                {"title": "Create Gathering Meeting Outlines", "file": "03_Create_Gathering_Meeting_Outlines.md"}
            ]
        },
        {
            "module_number": 6,
            "module_title": "Next Steps in Your Orientation Training",
            "lessons": [
                {"title": "Missionary Training and Resources", "file": "01_Missionary_Training_and_Resources.md"},
                {"title": "Your Orientation Trainer and Additional Training Resources", "file": "02_Your_Orientation_Trainer_and_Additional_Training_Resources.md"}
            ]
        }
    ]
}


class QuestionGenerator:
    """Generate assessment questions from course content using OpenAI."""
    
    def __init__(self, output_dir: str = "docs/output"):
        """Initialize the question generator."""
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.output_dir = Path(output_dir)
        self.questions = []
        
        if not self.output_dir.exists():
            logger.warning(f"Output directory {self.output_dir} does not exist")
    
    def generate_prompt(self, page_content: str, page_title: str, module_context: str) -> str:
        """Create the prompt for question generation."""
        return f"""You are an expert instructional designer creating assessment questions for BYU-Pathway missionary training.

**Context:**
This is the "{page_title}" page from the module "{module_context}". Missionaries complete online training, and these questions assess if they already know the material. If they answer correctly, they can skip this page.

**Content to Assess:**
{page_content}

**Task:**
Generate {QUESTIONS_PER_PAGE} high-quality assessment questions that test whether missionaries understand the ESSENTIAL information from this page.

**Requirements:**
1. **Question Types:** Mix of comprehension and application questions (avoid pure recall/memorization)
2. **Focus:** Test understanding of key concepts, procedures, and practical application
3. **Difficulty:** Minimum competency level - if they demonstrate understanding, they pass
4. **Clarity:** Questions should be clear, specific, and answerable based on the content
5. **Relevance:** Focus on information missionaries MUST know to perform their role effectively

**Format your response as a JSON array:**
```json
[
  {{
    "question": "The question text here",
    "answer": "A clear, complete answer that demonstrates understanding",
    "type": "comprehension|application",
    "key_concept": "The main concept being tested"
  }}
]
```

Generate exactly {QUESTIONS_PER_PAGE} questions now:"""
    
    def generate_questions_for_page(
        self, 
        page_title: str, 
        page_file: str, 
        module_context: str,
        page_number: int
    ) -> Dict[str, Any]:
        """Generate questions for a single page."""
        logger.info(f"\n{'='*60}")
        logger.info(f"Page {page_number}: {page_title}")
        logger.info(f"{'='*60}")
        
        # Read the markdown file
        file_path = self.output_dir / page_file
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            return None
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract main content (remove metadata sections)
        content_lines = content.split('\n')
        main_content = []
        skip_sections = ['## Images', '## Videos', '## External Resources', '---']
        
        include_line = True
        for line in content_lines:
            # Skip sections we don't need for questions
            if any(skip in line for skip in skip_sections):
                include_line = False
            elif line.startswith('## ') and not any(skip in line for skip in skip_sections):
                include_line = True
            
            if include_line and line.strip():
                main_content.append(line)
        
        page_content = '\n'.join(main_content[:100])  # Limit content length
        
        # Generate prompt
        prompt = self.generate_prompt(page_content, page_title, module_context)
        
        # Call OpenAI API
        try:
            logger.info(f"Calling OpenAI API ({OPENAI_MODEL})...")
            response = self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert instructional designer creating assessment questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=TEMPERATURE,
                response_format={"type": "json_object"}
            )
            
            # Parse response
            result = json.loads(response.choices[0].message.content)
            questions = result if isinstance(result, list) else result.get('questions', [])
            
            logger.info(f"✓ Generated {len(questions)} questions")
            
            # Create page entry
            page_data = {
                "page_number": page_number,
                "page_title": page_title,
                "module_context": module_context,
                "page_file": str(page_file),
                "questions": questions
            }
            
            return page_data
            
        except Exception as e:
            logger.error(f"Error generating questions: {e}")
            return None
    
    def generate_all_questions(self) -> List[Dict[str, Any]]:
        """Generate questions for all pages in the course."""
        all_questions = []
        page_number = 1
        
        # Introduction
        logger.info("\n" + "#"*60)
        logger.info("# INTRODUCTION")
        logger.info("#"*60)
        
        intro = COURSE_STRUCTURE['introduction']
        intro_file = self.output_dir / intro['file']
        
        if intro_file.exists():
            page_data = self.generate_questions_for_page(
                page_title=intro['title'],
                page_file=intro['file'],
                module_context="Introduction",
                page_number=page_number
            )
            if page_data:
                all_questions.append(page_data)
                page_number += 1
        else:
            logger.warning(f"Introduction file not found: {intro_file}")
        
        # Modules
        for module in COURSE_STRUCTURE['modules']:
            module_num = module['module_number']
            module_title = module['module_title']
            
            logger.info(f"\n{'#'*60}")
            logger.info(f"# MODULE {module_num}: {module_title}")
            logger.info(f"{'#'*60}")
            
            module_dir = self.output_dir / f"Module_{module_num:02d}_{self._sanitize_filename(module_title)}"
            
            for lesson in module['lessons']:
                lesson_file = module_dir / lesson['file']
                
                if lesson_file.exists():
                    page_data = self.generate_questions_for_page(
                        page_title=lesson['title'],
                        page_file=str(lesson_file.relative_to(self.output_dir)),
                        module_context=f"Module {module_num}: {module_title}",
                        page_number=page_number
                    )
                    if page_data:
                        all_questions.append(page_data)
                        page_number += 1
                else:
                    logger.warning(f"Lesson file not found: {lesson_file}")
        
        self.questions = all_questions
        return all_questions
    
    def save_yaml_output(self, output_path: str = "docs/questions.yaml"):
        """Save questions in YAML format for programmatic use."""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        output_data = {
            "course_title": COURSE_STRUCTURE['course_title'],
            "total_pages": len(self.questions),
            "total_questions": sum(len(page['questions']) for page in self.questions),
            "pages": self.questions
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            yaml.dump(output_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        
        logger.info(f"\n✓ YAML output saved to: {output_file}")
        return output_file
    
    def save_text_output(self, output_path: str = "docs/questions_review.txt"):
        """Save questions in simple text format for Elder Edwards review."""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("BYU-PATHWAY NEW MISSIONARY ORIENTATION\n")
            f.write("ASSESSMENT QUESTIONS FOR REVIEW\n")
            f.write("="*80 + "\n\n")
            f.write(f"Course: {COURSE_STRUCTURE['course_title']}\n")
            f.write(f"Total Pages: {len(self.questions)}\n")
            f.write(f"Total Questions: {sum(len(page['questions']) for page in self.questions)}\n")
            f.write("\n")
            f.write("PURPOSE: If missionaries can answer all questions for a page correctly,\n")
            f.write("         they can skip that page in their training.\n")
            f.write("\n")
            f.write("="*80 + "\n\n")
            
            for page in self.questions:
                f.write(f"{'='*80}\n")
                f.write(f"PAGE {page['page_number']}: {page['page_title']}\n")
                f.write(f"{'='*80}\n")
                f.write(f"Module: {page['module_context']}\n")
                f.write(f"File: {page['page_file']}\n\n")
                
                for i, q in enumerate(page['questions'], 1):
                    f.write(f"Q{i}: {q['question']}\n")
                    f.write(f"A{i}: {q['answer']}\n")
                    f.write(f"Type: {q.get('type', 'N/A')}\n")
                    f.write(f"Key Concept: {q.get('key_concept', 'N/A')}\n")
                    f.write("\n")
                
                f.write("\n")
        
        logger.info(f"✓ Text output saved to: {output_file}")
        return output_file
    
    def _sanitize_filename(self, filename: str) -> str:
        """Remove invalid characters from filename."""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename.strip()[:100]


def main():
    """Main function to generate questions."""
    logger.info("="*80)
    logger.info("BYU-PATHWAY QUESTION GENERATOR")
    logger.info("="*80)
    logger.info(f"Model: {OPENAI_MODEL}")
    logger.info(f"Questions per page: {QUESTIONS_PER_PAGE}")
    logger.info(f"Temperature: {TEMPERATURE}")
    logger.info("="*80)
    
    try:
        # Initialize generator
        generator = QuestionGenerator()
        
        # Generate questions for all pages
        questions = generator.generate_all_questions()
        
        if not questions:
            logger.error("No questions were generated. Check if crawler output exists.")
            return
        
        logger.info("\n" + "="*80)
        logger.info("GENERATION COMPLETE")
        logger.info("="*80)
        logger.info(f"Total pages processed: {len(questions)}")
        logger.info(f"Total questions generated: {sum(len(p['questions']) for p in questions)}")
        
        # Save outputs
        logger.info("\n" + "="*80)
        logger.info("SAVING OUTPUTS")
        logger.info("="*80)
        
        yaml_file = generator.save_yaml_output()
        text_file = generator.save_text_output()
        
        logger.info("\n" + "="*80)
        logger.info("SUCCESS!")
        logger.info("="*80)
        logger.info(f"\nOutputs generated:")
        logger.info(f"  1. {yaml_file} (for programmatic use)")
        logger.info(f"  2. {text_file} (for Elder Edwards review)")
        logger.info("\nNext steps:")
        logger.info("  1. Review questions_review.txt")
        logger.info("  2. Share with Elder Edwards for validation")
        logger.info("  3. Iterate based on feedback")
        
    except Exception as e:
        logger.error(f"\nFailed to generate questions: {e}")
        raise


if __name__ == "__main__":
    main()
