import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000"

st.title("JobIntelligence MVP")

tab1, tab2 = st.tabs(["Ingest Job", "Search Jobs"])

with tab1:
    jd = st.text_area("Paste Job Description")
    if st.button("Ingest"):
        if jd.strip():
            res = requests.post(f"{API_URL}/ingest/text", json={"text": jd, "source": "manual"})
            st.success(f"Stored Job ID: {res.json()['job_id']}")
        else:
            st.warning("Please paste a job description.")

with tab2:
    query = st.text_input("Search query (e.g. Senior Django backend engineer)")
    top_k = st.slider("Top K results", 1, 10, 5)

    if st.button("Search"):
        if query.strip():
            res = requests.post(f"{API_URL}/search/similar", json={"query": query, "top_k": top_k})
            results = res.json()

            st.write(f"Matches found: {len(results)}")
            for r in results:
                st.markdown("---")
                st.subheader(r.get("title", "Untitled"))
                st.write("Similarity:", r.get("similarity", 0))
                st.write("Hard Skills:", ", ".join(r.get("skills_hard", [])))
                st.write("Summary:", r.get("summary", ""))
        else:
            st.warning("Please enter a query.")
