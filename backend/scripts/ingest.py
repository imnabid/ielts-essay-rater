from __future__ import annotations
from config import settings
from utils.loader import load_pdfs_from_dir, load_webpages
from chains.rag_chain import ingest

essay_links = [
    "https://www.ieltspodcast.com/band-9-sample-essays/technology-social/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/intellectual-skills/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/the-number-of-shootings/",
    "https://www.ieltspodcast.com/sample-essay-no-10-sochi-essay/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/crime-big-problem-in-the-world/",
    "https://www.ieltspodcast.com/band-9-sample-essays/develop-better-skills/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/improvements-in-health-and-trade/",
    "https://www.ieltspodcast.com/band-9-sample-essays/biology-transformed/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/world-consuming-natural-resources/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/leisure-activities-must-be-educational/",
    "https://www.ieltspodcast.com/band-9-sample-essays/governments-spend-large-money-on-art/",
    "https://www.ieltspodcast.com/writing-task-2/band-9-sample-essays/september-2022-band-9-sample-essay/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/green-energy-more-prevalent/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/children-and-behaviour/",
    "https://www.ieltspodcast.com/band-9-sample-essays/pets-children/",
    "https://www.ieltspodcast.com/band-9-sample-essays/secondary-school-children/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/some-products-can-be-made-by-machine/",
    "https://www.ieltspodcast.com/band-9-sample-essays/women-equal-chances/",
    "https://www.ieltspodcast.com/band-9-sample-essays/most-schools-planning-to-replace-sport/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/people-think-schools-have-to-be-more-entertaining/",
    "https://www.ieltspodcast.com/writing-task-2/band-9-sample-essays/",
    "https://www.ieltspodcast.com/band-9-sample-essays/humans-adapt/",
    "https://www.ieltspodcast.com/band-9-sample-essays/copyright-laws-limit-creativity/",
    "https://www.ieltspodcast.com/band-9-sample-essays/education-should-be-free/",
    "https://www.ieltspodcast.com/band-9-sample-essays/disadvantage-of-children-using-computers/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/high-school-graduates-should-travel/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/sporting-events/",
    "https://www.ieltspodcast.com/writing-task-2/negative-positive-essay/",
    "https://www.ieltspodcast.com/band-9-sample-essays/people-like-to-travel/",
    "https://www.ieltspodcast.com/writing-task-2/ielts-band-9-sample-essay-no-9/gender-equality/"
]

def main():
    urls = essay_links 
    local_docs = load_pdfs_from_dir(settings.DATA_SOURCES_DIR)
    web_docs = load_webpages(urls)
    added = ingest(web_docs+local_docs)
    print(f"Added {added} documents to vectorstore at {settings.VECTORSTORE_DIR}")


if __name__ == "__main__":
    main()
