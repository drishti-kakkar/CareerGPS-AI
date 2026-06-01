from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_career, chat_with_advisor, generate_linkedin_tips, fetch_jobs, generate_interview_questions, evaluate_answer
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "CareerGPS AI backend running"}

@app.post("/analyze")
async def analyze(github: str = Form(...), resume: UploadFile = File(...)):
    try:
        pdf_bytes = await resume.read()
        result = analyze_career(github, pdf_bytes)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        message = body.get("message", "")
        career_data = body.get("career_data", {})
        history = body.get("history", [])
        reply = chat_with_advisor(message, career_data, history)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

@app.get("/jobs")
async def get_jobs(role: str = "software developer", country: str = "in"):
    jobs = fetch_jobs(role, country)
    return {"jobs": jobs}

@app.post("/linkedin")
async def linkedin_optimize(
    pdf: UploadFile = File(...),
    connections: str = Form(""),
    career_data: str = Form("{}"),
):
    try:
        import json
        pdf_bytes = await pdf.read()
        career = json.loads(career_data)
        result = generate_linkedin_tips(
            career_data=career,
            pdf_bytes=pdf_bytes,
            connections=connections,
        )
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/interview/questions")
async def get_interview_questions(request: Request):
    try:
        body = await request.json()
        career_data = body.get("career_data", {})
        questions = generate_interview_questions(career_data)
        return {"questions": questions}
    except Exception as e:
        return {"error": str(e)}

@app.post("/interview/feedback")
async def get_interview_feedback(request: Request):
    try:
        body = await request.json()
        question = body.get("question", "")
        answer = body.get("answer", "")
        career_data = body.get("career_data", {})
        feedback = evaluate_answer(question, answer, career_data)
        return feedback
    except Exception as e:
        return {"error": str(e)}