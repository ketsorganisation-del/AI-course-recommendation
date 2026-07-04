import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

env_paths = [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parents[2] / ".env.local",
    Path(__file__).resolve().parents[2] / ".env",
]
for env_path in env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "coursify")
COLLECTION_NAME = os.getenv("COURSE_COLLECTION_NAME", "course-data")
RECOMMENDATION_LIMIT = int(os.getenv("RECOMMENDATION_LIMIT", "10"))


def get_course_collection():
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGODB_DB]

    candidates = [COLLECTION_NAME, "course data", "course_data", "courses", "Course", "courseData"]
    seen = set()
    for name in candidates:
        if name and name not in seen:
            seen.add(name)
            if name in db.list_collection_names():
                return db[name]

    raise ValueError(f"No course collection found in database '{MONGODB_DB}'. Tried: {', '.join(candidates)}")


def get_course_documents():
    collection = get_course_collection()
    docs = list(collection.find({}, {"_id": 0}))
    if not docs:
        raise ValueError("The selected course collection is empty.")
    return docs


def build_text(doc):
    parts = []

    for field in ("title", "course_title", "name", "course_name"):
        value = doc.get(field)
        if value:
            parts.append(str(value))

    for field in ("description", "summary", "overview", "content"):
        value = doc.get(field)
        if value:
            parts.append(str(value))

    for field in ("category", "course_category", "topic", "subject"):
        value = doc.get(field)
        if value:
            parts.append(str(value))

    tags = doc.get("tags") or doc.get("keywords") or []
    if isinstance(tags, list):
        parts.extend(str(tag) for tag in tags if tag)
    elif isinstance(tags, str) and tags:
        parts.append(tags)

    return " ".join(parts)


def get_recommendations(query, docs, top_n=RECOMMENDATION_LIMIT):
    if not docs:
        return []

    texts = [build_text(doc) for doc in docs]
    titles = []
    for doc in docs:
        for field in ("title", "course_title", "name", "course_name"):
            value = doc.get(field)
            if value:
                titles.append(str(value))
                break
        else:
            titles.append("")

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(texts)
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    if query:
        query_text = query
    else:
        query_text = ""

    normalized_query = query_text.lower().strip()
    exact_match_index = None

    for index, title in enumerate(titles):
        if title and title.lower() == normalized_query:
            exact_match_index = index
            break

    if exact_match_index is not None:
        sim_scores = list(enumerate(cosine_sim[exact_match_index]))
        sim_scores = sorted(sim_scores, key=lambda item: item[1], reverse=True)[1:top_n + 1]
    else:
        query_vec = tfidf.transform([query_text])
        query_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
        sim_scores = list(enumerate(query_sim))
        sim_scores = sorted(sim_scores, key=lambda item: item[1], reverse=True)[:top_n]

    recommendations = []
    for idx, score in sim_scores:
        doc = docs[idx]
        recommendations.append(
            {
                "title": doc.get("title") or doc.get("course_title") or doc.get("name") or doc.get("course_name") or "Untitled",
                "category": doc.get("category") or doc.get("course_category") or doc.get("topic") or "",
                "rating": doc.get("rating") or doc.get("course_rating") or 0,
                "university": doc.get("university") or doc.get("course_organization") or doc.get("provider") or doc.get("institution") or "",
                "students": doc.get("students") or doc.get("course_students_enrolled") or doc.get("learners") or doc.get("enrolled") or 0,
                "score": round(float(score), 4),
            }
        )

    return recommendations


def main():
    search_term = sys.argv[1] if len(sys.argv) > 1 else "web development"
    output_json = "--json" in sys.argv

    try:
        docs = get_course_documents()
        recommendations = get_recommendations(search_term, docs, top_n=RECOMMENDATION_LIMIT)
    except Exception as exc:
        if output_json:
            print({"query": search_term, "recommendations": [], "error": str(exc)})
        else:
            print(f"Recommendation error: {exc}")
        return

    if output_json:
        print(json.dumps({"query": search_term, "recommendations": recommendations}))
    else:
        print(f"Recommendations for '{search_term}':")
        for item in recommendations:
            print(f"- {item['title']} | Category: {item['category']} | Rating: {item['rating']} | Score: {item['score']}")


if __name__ == "__main__":
    main()
