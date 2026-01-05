import asyncio
import argparse
import logging

from crawler import Rise360Crawler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# --- Configuration ---
COURSE_URL = "https://rise.articulate.com/share/7L8FnenKhVYRkTWnAQ-7b0IQ9jx_Brdq"


async def main():
    """
    Main function to run the Rise360 crawler.
    """
    parser = argparse.ArgumentParser(description="Crawl a Rise360 course and convert it to Markdown.")
    parser.add_argument(
        "--output-dir",
        default="output",
        help="The directory to save the output files.",
    )
    args = parser.parse_args()

    logging.info(f"Starting crawl for course: {COURSE_URL}")

    # Use async with to properly initialize and cleanup
    async with Rise360Crawler(COURSE_URL, args.output_dir) as crawler:
        await crawler.run()

    logging.info("Crawling finished.")


if __name__ == "__main__":
    asyncio.run(main())