import asyncio
import logging
import os
import json
from pathlib import Path
from playwright.async_api import async_playwright
from playwright._impl._errors import TimeoutError as PlaywrightTimeoutError

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Rise360Crawler:
    def __init__(self, course_url: str, output_dir: str = "docs/output", headless: bool = False):
        self.course_url = course_url
        self.output_dir = output_dir
        self.headless = headless
        self.playwright = None
        self.browser = None
        self.page = None
        self.course_frame = None
        
        # Define the exact course structure
        self.course_structure = {
            "course_title": "New Missionary Orientation for BYU-Pathway",
            "introduction": {
                "title": "Introduction to Serving with BYU-Pathway Worldwide",
                "nav_index": 0
            },
            "modules": [
                {
                    "module_number": 1,
                    "module_title": "Access to Essential Systems",
                    "lessons": [
                        {"title": "Access to a Zoom Account", "nav_index": 1},
                        {"title": "Access the Student Information System", "nav_index": 2},
                        {"title": "Access to Resources and Ongoing Training Material", "nav_index": 3}
                    ]
                },
                {
                    "module_number": 2,
                    "module_title": "Zoom for Virtual Gatherings",
                    "lessons": [
                        {"title": "Basic Zoom Skills for Your First Gathering", "nav_index": 4},
                        {"title": "Download and Install the Zoom App", "nav_index": 5},
                        {"title": "How to Open Your Zoom Room", "nav_index": 6},
                        {"title": "Learn Your Zoom Room Tools", "nav_index": 7},
                        {"title": "How to Update Your Personal Profile", "nav_index": 8},
                        {"title": "How to Share Your Screen in Zoom", "nav_index": 9},
                        {"title": "Share Your Zoom Room Link", "nav_index": 10}
                    ]
                },
                {
                    "module_number": 3,
                    "module_title": "Contacting Your Students",
                    "lessons": [
                        {"title": "Who Are Your Students?", "nav_index": 11},
                        {"title": "Contact Your Students", "nav_index": 12},
                        {"title": "Send an Email Message or Group Chat", "nav_index": 13},
                        {"title": "New Student Visits", "nav_index": 14}
                    ]
                },
                {
                    "module_number": 4,
                    "module_title": "Your First Gathering",
                    "lessons": [
                        {"title": "Your Role in the First Gathering", "nav_index": 15},
                        {"title": "Lead and Observing Students", "nav_index": 16},
                        {"title": "Former PathwayConnect Completer", "nav_index": 17}
                    ]
                },
                {
                    "module_number": 5,
                    "module_title": "Learning More About the Student Information System",
                    "lessons": [
                        {"title": "My Gatherings Portal and Student Information", "nav_index": 18},
                        {"title": "Monitor Student Progress", "nav_index": 19},
                        {"title": "Create Gathering Meeting Outlines", "nav_index": 20}
                    ]
                },
                {
                    "module_number": 6,
                    "module_title": "Next Steps in Your Orientation Training",
                    "lessons": [
                        {"title": "Missionary Training and Resources", "nav_index": 21},
                        {"title": "Your Orientation Trainer and Additional Training Resources", "nav_index": 22}
                    ]
                }
            ]
        }
        
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)

    async def __aenter__(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=self.headless)
        self.page = await self.browser.new_page()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        logging.info("Crawling finished.")

    async def run(self):
        try:
            await self._navigate_to_course()
            await self._verify_structure()
            await self._crawl_course()
            await self._save_course_index()
            
        except Exception as e:
            logging.error(f"An unexpected error occurred: {e}")
            if self.page:
                await self.page.screenshot(path='debug_screenshot.png')
            raise

    async def _navigate_to_course(self):
        logging.info(f"Navigating to course URL: {self.course_url}")
        await self.page.goto(self.course_url, timeout=60000)
        await asyncio.sleep(10)

        # Look for START COURSE button
        try:
            start_button = self.page.locator("button:has-text('START COURSE'), button:has-text('Start Course')")
            await start_button.wait_for(timeout=5000)
            logging.info("'START COURSE' button found. Clicking it.")
            await start_button.click()
            await asyncio.sleep(5)
        except PlaywrightTimeoutError:
            logging.info("No 'START COURSE' button found.")

        # Find course frame
        for attempt in range(10):
            frames = self.page.frames
            for frame in frames:
                if frame.url in ["about:blank", ""] or "googletagmanager" in frame.url:
                    continue
                try:
                    html_content = await frame.content()
                    if len(html_content) > 1000:
                        lesson_count = await frame.locator("[class*='lesson']").count()
                        if lesson_count > 0:
                            self.course_frame = frame
                            logging.info(f"Found course frame")
                            return
                except Exception:
                    continue
            await asyncio.sleep(2)
        
        raise Exception("Fatal: Could not find course content frame.")

    async def _verify_structure(self):
        """Verify the navigation matches our expected structure"""
        logging.info("\n" + "="*60)
        logging.info("VERIFYING COURSE STRUCTURE")
        logging.info("="*60)
        
        nav_items = self.course_frame.locator("nav a")
        actual_count = await nav_items.count()
        
        expected_count = 1 + sum(len(m['lessons']) for m in self.course_structure['modules'])
        
        logging.info(f"Expected lessons: {expected_count}")
        logging.info(f"Found nav items: {actual_count}")
        
        # List actual navigation items
        logging.info("\nActual Navigation Items:")
        for i in range(min(actual_count, 25)):
            item = nav_items.nth(i)
            text = await item.inner_text()
            logging.info(f"  [{i}] {text.strip()}")
        
        if actual_count < expected_count:
            logging.warning(f"Warning: Found fewer items than expected!")
        
        logging.info("="*60 + "\n")

    async def _crawl_course(self):
        """Crawl the entire course following the defined structure"""
        
        # 1. Crawl Introduction (standalone)
        logging.info("\n" + "#"*60)
        logging.info("# INTRODUCTION")
        logging.info("#"*60)
        
        intro = self.course_structure['introduction']
        await self._crawl_introduction(intro)
        
        # 2. Crawl all modules
        for module in self.course_structure['modules']:
            module_num = module['module_number']
            module_title = module['module_title']
            
            logging.info(f"\n{'#'*60}")
            logging.info(f"# MODULE {module_num}: {module_title}")
            logging.info(f"{'#'*60}")
            
            # Create module directory
            module_dir = os.path.join(
                self.output_dir,
                f"Module_{module_num:02d}_{self._sanitize_filename(module_title)}"
            )
            Path(module_dir).mkdir(parents=True, exist_ok=True)
            
            # Crawl each lesson in the module
            for lesson_idx, lesson in enumerate(module['lessons'], 1):
                try:
                    await self._crawl_lesson(
                        lesson,
                        lesson_idx,
                        module_num,
                        module_title,
                        module_dir
                    )
                except Exception as e:
                    logging.error(f"Error crawling lesson: {e}")
                    continue

    async def _crawl_introduction(self, intro):
        """Crawl the introduction lesson"""
        logging.info(f"\nCrawling Introduction: {intro['title']}")
        
        # Click the introduction in navigation
        nav_items = self.course_frame.locator("nav a")
        intro_link = nav_items.nth(intro['nav_index'])
        
        await intro_link.click()
        await asyncio.sleep(4)
        
        # Extract content
        content = await self._extract_lesson_content()
        
        # Generate markdown
        markdown = self._generate_introduction_markdown(intro['title'], content)
        
        # Save to file
        filepath = os.path.join(self.output_dir, "01_Introduction.md")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        logging.info(f"✓ Saved to: {filepath}")

    async def _crawl_lesson(self, lesson, lesson_num, module_num, module_title, module_dir):
        """Crawl a single lesson within a module"""
        lesson_title = lesson['title']
        nav_index = lesson['nav_index']
        
        logging.info(f"\n{'-'*60}")
        logging.info(f"Crawling: Module {module_num}.{lesson_num} - {lesson_title}")
        logging.info(f"{'-'*60}")
        
        # Click the lesson in navigation
        nav_items = self.course_frame.locator("nav a")
        lesson_link = nav_items.nth(nav_index)
        
        await lesson_link.click()
        await asyncio.sleep(4)
        
        # Extract content
        content = await self._extract_lesson_content()
        
        # Generate markdown
        markdown = self._generate_lesson_markdown(
            lesson_title,
            lesson_num,
            module_title,
            module_num,
            content
        )
        
        # Save to file
        filename = f"{lesson_num:02d}_{self._sanitize_filename(lesson_title)}.md"
        filepath = os.path.join(module_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        logging.info(f"✓ Saved to: {filepath}")

    async def _extract_lesson_content(self):
        """Extract text, images, videos from current lesson"""
        content = {
            'text': '',
            'images': [],
            'videos': [],
            'links': []
        }
        
        # Find main content area (excluding navigation)
        content_selectors = [
            "main",
            "article", 
            "[role='main']",
            "[class*='lesson__content']"
        ]
        
        content_element = None
        for selector in content_selectors:
            try:
                element = self.course_frame.locator(selector).first
                if await element.count() > 0:
                    content_element = element
                    break
            except Exception:
                continue
        
        if not content_element:
            logging.warning("Could not find content element")
            return content
        
        # Extract text (clean version - avoiding navigation)
        try:
            # Get text but try to exclude navigation elements
            text = await content_element.inner_text()
            
            # Clean up navigation items from text
            nav_text_to_remove = [
                "Introduction to Serving with BYU-Pathway Worldwide",
                "Access to a Zoom Account",
                "Access the Student Information System",
                # Add more if needed
            ]
            
            content['text'] = text
        except Exception as e:
            logging.debug(f"Error extracting text: {e}")
        
        # Extract images
        try:
            img_elements = content_element.locator("img")
            img_count = await img_elements.count()
            seen_urls = set()
            
            for i in range(img_count):
                img = img_elements.nth(i)
                src = await img.get_attribute("src")
                if src and src not in seen_urls and "logo" not in src.lower():
                    seen_urls.add(src)
                    content['images'].append({
                        'src': src,
                        'alt': await img.get_attribute("alt") or "",
                        'title': await img.get_attribute("title") or ""
                    })
            
            logging.info(f"   Images: {len(content['images'])}")
        except Exception as e:
            logging.debug(f"Error extracting images: {e}")
        
        # Extract videos
        try:
            # Video tags
            video_elements = content_element.locator("video")
            video_count = await video_elements.count()
            for i in range(video_count):
                src = await video_elements.nth(i).get_attribute("src")
                if src:
                    content['videos'].append({'type': 'video', 'url': src})
            
            # Iframe embeds
            iframe_elements = content_element.locator("iframe")
            iframe_count = await iframe_elements.count()
            for i in range(iframe_count):
                iframe = iframe_elements.nth(i)
                src = await iframe.get_attribute("src")
                # Skip navigation iframes
                if src and "googletagmanager" not in src:
                    content['videos'].append({'type': 'iframe', 'url': src})
            
            logging.info(f"   Videos: {len(content['videos'])}")
        except Exception as e:
            logging.debug(f"Error extracting videos: {e}")
        
        # Extract links
        try:
            link_elements = content_element.locator("a[href^='http']")
            link_count = await link_elements.count()
            seen_urls = set()
            
            for i in range(link_count):
                link = link_elements.nth(i)
                href = await link.get_attribute("href")
                text = await link.inner_text()
                if href and href not in seen_urls and text.strip():
                    seen_urls.add(href)
                    content['links'].append({'url': href, 'text': text.strip()})
            
            logging.info(f"   Links: {len(content['links'])}")
        except Exception as e:
            logging.debug(f"Error extracting links: {e}")
        
        return content

    def _generate_introduction_markdown(self, title, content):
        """Generate markdown for the introduction"""
        md = f"# {title}\n\n"
        md += "**Course Introduction**\n\n"
        md += "---\n\n"
        
        # Summary
        md += "## Overview\n\n"
        md += f"- **Images:** {len(content['images'])}\n"
        md += f"- **Videos:** {len(content['videos'])}\n"
        md += f"- **External Links:** {len(content['links'])}\n\n"
        md += "---\n\n"
        
        # Main content
        if content['text']:
            md += "## Content\n\n"
            md += f"{content['text'].strip()}\n\n"
        
        # Add media sections
        md += self._format_media_sections(content)
        
        return md

    def _generate_lesson_markdown(self, lesson_title, lesson_num, module_title, module_num, content):
        """Generate formatted markdown for a lesson"""
        md = f"# {lesson_title}\n\n"
        md += f"**Module {module_num}: {module_title}**  \n"
        md += f"**Lesson {module_num}.{lesson_num}**\n\n"
        md += "---\n\n"
        
        # Summary
        md += "## Overview\n\n"
        md += f"- **Images:** {len(content['images'])}\n"
        md += f"- **Videos:** {len(content['videos'])}\n"
        md += f"- **External Links:** {len(content['links'])}\n\n"
        md += "---\n\n"
        
        # Main text content
        if content['text']:
            md += "## Lesson Content\n\n"
            md += f"{content['text'].strip()}\n\n"
        
        # Add media sections
        md += self._format_media_sections(content)
        
        return md

    def _format_media_sections(self, content):
        """Format images, videos, and links sections"""
        md = ""
        
        # Images section
        if content['images']:
            md += "---\n\n"
            md += "## Images\n\n"
            for i, img in enumerate(content['images'], 1):
                md += f"### Image {i}\n\n"
                if img['alt']:
                    md += f"**Description:** {img['alt']}\n\n"
                if img['title']:
                    md += f"**Title:** {img['title']}\n\n"
                md += f"**URL:** `{img['src']}`\n\n"
                md += f"![{img['alt']}]({img['src']})\n\n"
        
        # Videos section
        if content['videos']:
            md += "---\n\n"
            md += "## Videos\n\n"
            for i, video in enumerate(content['videos'], 1):
                md += f"### Video {i}\n\n"
                md += f"**Type:** {video['type']}\n\n"
                md += f"**URL:** `{video['url']}`\n\n"
        
        # Links section
        if content['links']:
            md += "---\n\n"
            md += "## External Resources\n\n"
            for link in content['links']:
                md += f"- [{link['text']}]({link['url']})\n"
            md += "\n"
        
        md += "---\n\n"
        md += f"*Extracted from Rise360 Course*\n"
        
        return md

    async def _save_course_index(self):
        """Save course structure to index files"""
        # JSON index
        index_file = os.path.join(self.output_dir, "course_index.json")
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(self.course_structure, f, indent=2, ensure_ascii=False)
        
        logging.info(f"\n✓ Course index saved to: {index_file}")
        
        # Markdown README
        md = f"# {self.course_structure['course_title']}\n\n"
        md += "## Course Structure\n\n"
        
        # Introduction
        md += f"### Introduction\n"
        md += f"1. {self.course_structure['introduction']['title']}\n\n"
        
        # Modules
        for module in self.course_structure['modules']:
            md += f"### Module {module['module_number']}: {module['module_title']}\n"
            for i, lesson in enumerate(module['lessons'], 1):
                md += f"{i}. {lesson['title']}\n"
            md += "\n"
        
        md_index_file = os.path.join(self.output_dir, "README.md")
        with open(md_index_file, 'w', encoding='utf-8') as f:
            f.write(md)
        
        logging.info(f"✓ Readable index saved to: {md_index_file}")

    def _sanitize_filename(self, filename: str) -> str:
        """Remove invalid characters from filename"""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename.strip()[:100]

async def main():
    course_url = "https://rise.articulate.com/share/7L8FnenKhVYRkTWnAQ-7b0IQ9jx_Brdq"
    logging.info(f"Starting crawl for BYU-Pathway course")
    async with Rise360Crawler(course_url, headless=False) as crawler:
        await crawler.run()

if __name__ == "__main__":
    asyncio.run(main())