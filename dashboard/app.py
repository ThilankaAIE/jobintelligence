import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000"
TIMEOUT = 30


# ----------------------------
# Helpers
# ----------------------------
def api_get(path: str):
    return requests.get(f"{API_URL}{path}", timeout=TIMEOUT)


def api_post(path: str, payload: dict):
    return requests.post(f"{API_URL}{path}", json=payload, timeout=TIMEOUT)


def pill_list(items):
    """Render list items as simple pills-like text."""
    if not items:
        return "—"
    return " • ".join(items)


def show_job_card(job: dict, idx: int = 0):
    title = job.get("title") or "Untitled"
    similarity = job.get("similarity", None)

    header = f"{idx+1}. {title}"
    if similarity is not None:
        header += f"  |  Similarity: {float(similarity):.3f}"

    with st.expander(header, expanded=(idx == 0)):
        cols = st.columns([1, 1, 1])
        with cols[0]:
            st.caption("Experience Level")
            st.write(job.get("experience_level") or "—")
        with cols[1]:
            st.caption("Industry")
            st.write(job.get("industry") or "—")
        with cols[2]:
            st.caption("Job ID")
            st.write(job.get("id") or "—")

        st.caption("Summary")
        st.write(job.get("summary") or "—")

        st.caption("Hard Skills")
        st.write(pill_list(job.get("skills_hard", [])))

        st.caption("Soft Skills")
        st.write(pill_list(job.get("skills_soft", [])))

        st.caption("Tools")
        st.write(pill_list(job.get("tools", [])))

        # Optional extra fields if you later populate them
        if job.get("responsibilities"):
            st.caption("Responsibilities")
            st.write("\n".join([f"- {x}" for x in job["responsibilities"]]))

        if job.get("qualifications"):
            st.caption("Qualifications")
            st.write("\n".join([f"- {x}" for x in job["qualifications"]]))


# ----------------------------
# Page config
# ----------------------------
st.set_page_config(
    page_title="JobIntelligence MVP",
    page_icon="🧠",
    layout="wide",
)

st.title("🧠 JobIntelligence MVP")
st.caption("Paste job descriptions, extract structured insights, and run semantic search (pgvector).")


# ----------------------------
# Sidebar: API status
# ----------------------------
with st.sidebar:
    st.subheader("API Status")

    try:
        res = api_get("/health/")
        if res.status_code == 200 and res.json().get("status") == "ok":
            st.success("FastAPI is running ✅")
        else:
            st.warning(f"FastAPI responded ({res.status_code})")
    except Exception as e:
        st.error("FastAPI not reachable ❌")
        st.caption(f"{API_URL}")
        st.caption(str(e))

    st.divider()
    st.subheader("Settings")
    API_URL = st.text_input("API URL", value=API_URL)
    top_k_default = st.slider("Default Top K", 1, 10, 5)


# ----------------------------
# Tabs
# ----------------------------
tab1, tab2 = st.tabs(["📥 Ingest Job", "🔎 Search Jobs"])


# ----------------------------
# Ingest Tab
# ----------------------------
with tab1:
    st.subheader("Ingest a Job Description")
    st.write("Paste a job description, then click **Ingest** to store it in Supabase (raw + extracted + embedding).")

    jd = st.text_area("Job Description", height=220, placeholder="Paste the full job description here...")

    colA, colB = st.columns([1, 3])
    with colA:
        source = st.selectbox("Source", ["manual", "csv"], index=0)
    with colB:
        st.caption("Tip: You can ingest multiple JDs later via CSV upload (next feature).")

    if st.button("✅ Ingest", use_container_width=True):
        if not jd.strip():
            st.warning("Please paste a job description first.")
        else:
            try:
                with st.spinner("Ingesting… extracting + embedding…"):
                    res = api_post("/ingest/text", {"text": jd, "source": source})
                    res.raise_for_status()
                    job_id = res.json().get("job_id")

                st.success(f"Stored Job ID: {job_id}")

                # Optional: immediately search for similar jobs using the same JD title keywords
                st.info("You can now switch to **Search Jobs** tab to find similar roles.")
            except requests.exceptions.RequestException as e:
                st.error("Failed to ingest job.")
                st.caption(str(e))


# ----------------------------
# Search Tab
# ----------------------------
with tab2:
    st.subheader("Semantic Search (pgvector)")
    st.write("Enter a query like **'Senior Django backend engineer'** and see the most similar jobs.")

    query = st.text_input("Search query", placeholder="e.g., Data Engineer with Snowflake and dbt")
    top_k = st.slider("Top K results", 1, 10, top_k_default)

    col1, col2 = st.columns([1, 1])
    with col1:
        do_search = st.button("🔍 Search", use_container_width=True)
    with col2:
        st.caption("Results show similarity score + extracted fields (hard skills, soft skills, tools).")

    if do_search:
        if not query.strip():
            st.warning("Please enter a query.")
        else:
            try:
                with st.spinner("Searching… generating query embedding…"):
                    res = api_post("/search/similar", {"query": query, "top_k": top_k})
                    res.raise_for_status()
                    results = res.json()

                st.success(f"Matches found: {len(results)}")

                if not results:
                    st.info("No matches yet. Ingest more job descriptions to improve results.")
                else:
                    # Quick metrics row
                    best = results[0]
                    m1, m2, m3 = st.columns(3)
                    m1.metric("Top Match", best.get("title", "—"))
                    m2.metric("Top Similarity", f"{float(best.get('similarity', 0)):.3f}")
                    m3.metric("Returned", len(results))

                    st.divider()

                    for i, job in enumerate(results):
                        show_job_card(job, idx=i)

            except requests.exceptions.RequestException as e:
                st.error("Search failed.")
                st.caption(str(e))
