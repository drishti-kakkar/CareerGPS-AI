import pdfplumber
import requests
from groq import Groq
import io
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ─────────────────────────────────────────
# HELPER: Extract text from PDF
# ─────────────────────────────────────────
def extract_pdf_text(pdf_bytes):
    text = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


# ─────────────────────────────────────────
# HELPER: Fetch GitHub repos
# ─────────────────────────────────────────
def fetch_github_data(username):
    url = f"https://api.github.com/users/{username}/repos?per_page=10&sort=updated"
    res = requests.get(url)
    if res.status_code != 200:
        return "GitHub data unavailable"
    repos = res.json()
    summary = []
    for r in repos:
        summary.append(f"{r['name']} — {r['language']} — ⭐{r['stargazers_count']}")
    return "\n".join(summary)


# ─────────────────────────────────────────
# MAIN: Analyze career (Groq)
# ─────────────────────────────────────────
def analyze_career(github: str, pdf_bytes: bytes):
    resume_text = extract_pdf_text(pdf_bytes)
    github_data = fetch_github_data(github)

    prompt = """
You are a senior career intelligence AI.

Analyze this EXACT developer profile below and return personalized JSON.
Do NOT use example/placeholder data. Base everything on the actual resume and GitHub repos provided.

Return ONLY this JSON structure (no markdown, no explanation):
{
  "targetRole": "<most suitable role based on their actual skills>",
  "skillMatchScore": "<realistic % based on their profile>",
  "marketDemand": "<High/Medium/Low based on their target role>",
  "aiRiskLevel": "<Low/Medium/High based on their role>",
  "jobsAvailable": "<realistic number>",
  "salaryRange": {
    "min": "<based on Indian market for their experience>",
    "max": "<based on Indian market for their experience>"
  },
  "topSkills": ["<skill actually found in resume/github>", "..."],
  "skillGaps": [
    {"skill": "<skill they are MISSING for target role>", "level": <0-100 current level>},
    {"skill": "<another missing skill>", "level": <0-100>}
  ],
  "roadmap": [
    {"week": "Week 1-2", "task": "<specific task based on THEIR gaps>"},
    {"week": "Week 3-4", "task": "<specific task>"},
    {"week": "Week 5-6", "task": "<specific task>"},
    {"week": "Week 7-8", "task": "<specific task>"},
    {"week": "Week 9-10", "task": "<specific task>"},
    {"week": "Week 11-12", "task": "<specific task>"}
  ],
  "strengthSummary": "<specific strengths found in THEIR resume and github>",
  "improvementSummary": "<specific areas THEY need to improve>"
}

ACTUAL RESUME TEXT:
""" + resume_text[:3000] + """

ACTUAL GITHUB REPOS:
""" + github_data + """

IMPORTANT: Analyze the above data carefully. Give personalized results, not generic ones.
Return ONLY the JSON. No explanation. No markdown.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("Groq analyze error:", e)
        return {"error": str(e)}

def generate_linkedin_tips(career_data: dict):
    prompt = """
You are a LinkedIn profile expert and career coach.

Based on this developer's profile, generate specific LinkedIn optimization tips.

Profile:
- Target Role: """ + career_data.get('targetRole', 'Not specified') + """
- Top Skills: """ + ', '.join(career_data.get('topSkills', [])) + """
- Skill Gaps: """ + ', '.join([s['skill'] for s in career_data.get('skillGaps', [])]) + """
- Strength: """ + career_data.get('strengthSummary', '') + """
- Improvement: """ + career_data.get('improvementSummary', '') + """

Return ONLY a JSON array with exactly 6 tips in this structure:
[
  {
    "section": "Headline",
    "priority": "High",
    "tip": "<specific actionable tip>",
    "example": "<concrete example for this person>"
  },
  {
    "section": "About",
    "priority": "High",
    "tip": "<specific tip>",
    "example": "<example>"
  },
  {
    "section": "Experience",
    "priority": "Medium",
    "tip": "<specific tip>",
    "example": "<example>"
  },
  {
    "section": "Skills",
    "priority": "High",
    "tip": "<specific tip>",
    "example": "<example>"
  },
  {
    "section": "Projects",
    "priority": "Medium",
    "tip": "<specific tip>",
    "example": "<example>"
  },
  {
    "section": "Networking",
    "priority": "Low",
    "tip": "<specific tip>",
    "example": "<example>"
  }
]

Be specific to their profile. No generic advice.
Return ONLY the JSON array. No explanation. No markdown.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("LinkedIn tips error:", e)
        return []
# ─────────────────────────────────────────
# JOB FETCH FUNCTION
# ──────────────────────────────────────

def fetch_jobs(role: str, country: str = "in"):
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": 10,
        "what": role,
        "content-type": "application/json"
    }
    
    try:
        res = requests.get(url, params=params)
        data = res.json()
        jobs = []
        for job in data.get("results", []):
            jobs.append({
                "title": job.get("title", ""),
                "company": job.get("company", {}).get("display_name", ""),
                "location": job.get("location", {}).get("display_name", ""),
                "salary_min": job.get("salary_min", None),
                "salary_max": job.get("salary_max", None),
                "description": job.get("description", "")[:200],
                "url": job.get("redirect_url", ""),
                "created": job.get("created", "")
            })
        return jobs
    except Exception as e:
        print(f"Adzuna error: {e}")
        return []

def fetch_linkedin_profile(linkedin_url: str):
    username = linkedin_url.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "").strip("/").split("?")[0]
    
    # RapidAPI se real LinkedIn data fetch karo
    rapidapi_key = os.getenv("RAPIDAPI_KEY")
    
    if not rapidapi_key:
        return None
    
    try:
        url = "https://linkedin-profile-data.p.rapidapi.com/linkedin-data"
        headers = {
            "x-rapidapi-key": rapidapi_key,
            "x-rapidapi-host": "linkedin-profile-data.p.rapidapi.com"
        }
        params = {"url": linkedin_url}
        res = requests.get(url, headers=headers, params=params)
        return res.json()
    except Exception as e:
        print("LinkedIn fetch error:", e)
        return None


def generate_linkedin_tips(career_data: dict, linkedin_url: str = "", connections: str = ""):
    # Real profile fetch karo
    profile = fetch_linkedin_profile(linkedin_url)
    
    profile_context = ""
    if profile:
        profile_context = """
Real LinkedIn Profile Data:
- Name: """ + str(profile.get('name', '')) + """
- Headline: """ + str(profile.get('headline', '')) + """
- Summary: """ + str(profile.get('summary', ''))[:500] + """
- Experience: """ + str([e.get('title','') + ' at ' + e.get('company','') for e in profile.get('experience', [])[:3]]) + """
- Education: """ + str([e.get('school','') for e in profile.get('education', [])[:2]]) + """
- Skills: """ + str(profile.get('skills', [])[:10]) + """
- Connections: """ + connections + """
"""
    else:
        profile_context = """
LinkedIn URL: """ + linkedin_url + """
Connections: """ + (connections or "Unknown") + """
(Profile data unavailable — analyzing based on career data)
"""

    username = linkedin_url.replace("https://linkedin.com/in/", "").replace("https://www.linkedin.com/in/","").strip("/")

    prompt = """
You are an expert LinkedIn profile coach and career analyst.

Analyze this developer's profile completely and return a detailed JSON analysis.

""" + profile_context + """

Career Data (from Resume + GitHub):
- Target Role: """ + career_data.get('targetRole', 'Not specified') + """
- Top Skills: """ + ', '.join(career_data.get('topSkills', [])) + """
- Skill Gaps: """ + ', '.join([s['skill'] for s in career_data.get('skillGaps', [])]) + """
- Strength: """ + career_data.get('strengthSummary', '') + """
- Improvement: """ + career_data.get('improvementSummary', '') + """
- Market Demand: """ + career_data.get('marketDemand', '') + """

Return ONLY this JSON structure:
{
  "overallScore": 65,
  "topSkills": ["Python", "React", "Node.js"],
  "experienceSummary": "<2-3 line summary of their experience>",
  "projectsSummary": "<2-3 line summary of their projects>",
  "educationSummary": "<1 line>",
  "jobRoleProbability": [
    {"role": "Full Stack Developer", "probability": 85},
    {"role": "Backend Developer", "probability": 75},
    {"role": "DevOps Engineer", "probability": 40},
    {"role": "AI/ML Engineer", "probability": 55},
    {"role": "Frontend Developer", "probability": 60}
  ],
  "tips": [
    {"section": "Headline", "priority": "High", "tip": "<specific tip>", "example": "<rewritten headline>"},
    {"section": "About", "priority": "High", "tip": "<specific tip>", "example": "<example>"},
    {"section": "Experience", "priority": "Medium", "tip": "<specific tip>", "example": "<example>"},
    {"section": "Skills", "priority": "High", "tip": "<specific tip>", "example": "<example>"},
    {"section": "Projects", "priority": "Medium", "tip": "<specific tip>", "example": "<example>"},
    {"section": "Networking", "priority": "Low", "tip": "<specific tip>", "example": "<example>"}
  ]
}

Be specific and personalized. Return ONLY JSON. No markdown.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("LinkedIn tips error:", e)
        return {}

def generate_interview_questions(career_data: dict):
    prompt = """
You are a senior tech interviewer at a top company.

Generate 8 interview questions for this candidate. Mix of Technical and HR.

Candidate Profile:
- Target Role: """ + career_data.get('targetRole', 'Software Developer') + """
- Top Skills: """ + ', '.join(career_data.get('topSkills', [])) + """
- Skill Gaps: """ + ', '.join([s['skill'] for s in career_data.get('skillGaps', [])]) + """
- Strength: """ + career_data.get('strengthSummary', '') + """

Return ONLY a JSON array:
[
  {
    "id": 1,
    "type": "Technical",
    "difficulty": "Medium",
    "question": "<specific technical question based on their skills>",
    "hint": "<one line hint>"
  },
  {
    "id": 2,
    "type": "HR",
    "difficulty": "Easy",
    "question": "<behavioral question>",
    "hint": "<one line hint>"
  }
]

Mix: 5 Technical + 3 HR questions.
Make questions specific to their target role and skills.
Return ONLY JSON array. No markdown.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("Questions error:", e)
        return []


def evaluate_answer(question: str, answer: str, career_data: dict):
    prompt = """
You are a strict but fair technical interviewer.

Evaluate this interview answer and give detailed feedback.

Question: """ + question + """

Candidate's Answer: """ + answer + """

Candidate's Target Role: """ + career_data.get('targetRole', 'Software Developer') + """

Return ONLY this JSON:
{
  "score": <0-10>,
  "verdict": "<Excellent/Good/Average/Poor>",
  "strengths": "<what they did well in 1-2 lines>",
  "improvements": "<what they should improve in 1-2 lines>",
  "idealAnswer": "<a model answer in 3-4 lines>"
}

Be specific. Return ONLY JSON. No markdown.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("Feedback error:", e)
        return {}
# ─────────────────────────────────────────
# CHAT: Career advisor (Groq)
# ─────────────────────────────────────────
def chat_with_advisor(message: str, career_data: dict, history: list):
    context = f"""
You are an expert AI Career Advisor. You have already analyzed this person's profile.

Their Analysis Results:
- Target Role: {career_data.get('targetRole', 'Not specified')}
- Skill Match Score: {career_data.get('skillMatchScore', 'N/A')}
- Market Demand: {career_data.get('marketDemand', 'N/A')}
- AI Risk Level: {career_data.get('aiRiskLevel', 'N/A')}
- Top Skills: {', '.join(career_data.get('topSkills', []))}
- Skill Gaps: {', '.join([s['skill'] for s in career_data.get('skillGaps', [])])}
- Salary Range: {career_data.get('salaryRange', {})}
- Strength: {career_data.get('strengthSummary', '')}
- Improvement Areas: {career_data.get('improvementSummary', '')}

Be friendly, specific, and encouraging. Give actionable advice.
Keep responses concise — 2-4 sentences max unless they ask for detail.
"""
    messages = [{"role": "system", "content": context}]

    for h in history[-6:]:
        role = h.get("role", "")
        content = h.get("content", "")
        if role in ("user", "assistant") and content.strip():
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq chat error: {e}")
        return f"Error from AI: {str(e)}"