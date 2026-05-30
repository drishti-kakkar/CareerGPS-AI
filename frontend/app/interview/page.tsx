"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

interface Question {
  id: number;
  type: "Technical" | "HR";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  hint: string;
}

interface Feedback {
  score: number;
  verdict: string;
  strengths: string;
  improvements: string;
  idealAnswer: string;
}

export default function InterviewPage() {
  const [careerData, setCareerData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<{ question: string; score: number; verdict: string }[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("careerData");
    if (stored) setCareerData(JSON.parse(stored));
  }, []);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career_data: careerData || {} }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
      setStarted(true);
      setCurrentIndex(0);
      setResults([]);
      setFinished(false);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setFeedbackLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("http://localhost:8000/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentIndex].question,
          answer: answer,
          career_data: careerData || {},
        }),
      });
      const data = await res.json();
      setFeedback(data);
      setResults(prev => [...prev, {
        question: questions[currentIndex].question,
        score: data.score,
        verdict: data.verdict,
      }]);
    } catch {
      setFeedback(null);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswer("");
      setFeedback(null);
      setShowHint(false);
    }
  };

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (d === "Medium") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  const getTypeColor = (t: string) => {
    return t === "Technical"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : "text-purple-400 bg-purple-400/10 border-purple-400/20";
  };

  const getScoreColor = (s: number) => {
    if (s >= 8) return "text-green-400";
    if (s >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const avgScore = results.length
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length * 10)
    : 0;

  // FINISHED STATE
  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="max-w-2xl mx-auto px-6 pt-28 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Interview Complete! 🎉</h1>
            <p className="text-gray-500 text-sm mb-8">Here's your performance summary</p>

            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">Overall Score</p>
              <p className={"text-7xl font-bold " + getScoreColor(avgScore / 10)}>
                {avgScore}%
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {results.map((r, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center">
                  <p className="text-gray-300 text-sm flex-1 mr-4 line-clamp-1">{r.question}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={"text-sm font-bold " + getScoreColor(r.score)}>{r.score}/10</span>
                    <span className="text-xs text-gray-500">{r.verdict}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStarted(false); setFinished(false); setResults([]); }}
                className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Retry Interview →
              </button>
              <a
                href="/dashboard"
                className="flex-1 py-3 border border-white/20 text-white rounded-xl font-semibold text-center hover:border-white/40 transition"
              >
                Back to Dashboard
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold">Interview Prep</h1>
          <p className="text-gray-500 text-sm mt-1">
            AI mock interview — answer questions, get instant feedback
          </p>
        </motion.div>

        {/* START SCREEN */}
        {!started && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 mb-6">
              <p className="text-5xl mb-4">🎯</p>
              <h2 className="text-xl font-semibold mb-2">Ready for your mock interview?</h2>
              <p className="text-gray-400 text-sm mb-2">
                Target Role: <span className="text-white">{careerData?.targetRole || "Software Developer"}</span>
              </p>
              <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
                <span>📝 8 Questions</span>
                <span>💻 5 Technical</span>
                <span>🤝 3 HR</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startInterview}
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Preparing questions... ⏳" : "Start Mock Interview →"}
            </motion.button>
          </motion.div>
        )}

        {/* INTERVIEW IN PROGRESS */}
        {started && questions.length > 0 && !finished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* PROGRESS */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={"w-6 h-1 rounded-full " + (i < currentIndex ? "bg-green-400" : i === currentIndex ? "bg-white" : "bg-white/20")}
                  ></div>
                ))}
              </div>
            </div>

            {/* QUESTION CARD */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-4"
              >
                <div className="flex gap-2 mb-4">
                  <span className={"text-xs px-2 py-1 rounded-full border " + getTypeColor(questions[currentIndex].type)}>
                    {questions[currentIndex].type}
                  </span>
                  <span className={"text-xs px-2 py-1 rounded-full border " + getDifficultyColor(questions[currentIndex].difficulty)}>
                    {questions[currentIndex].difficulty}
                  </span>
                </div>
                <p className="text-white text-lg leading-relaxed mb-4">
                  {questions[currentIndex].question}
                </p>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                >
                  {showHint ? "Hide hint ↑" : "Show hint 💡"}
                </button>
                {showHint && (
                  <p className="text-gray-400 text-xs mt-2 italic">
                    {questions[currentIndex].hint}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ANSWER INPUT */}
            {!feedback && (
              <div className="space-y-3">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitAnswer}
                  disabled={feedbackLoading || !answer.trim()}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {feedbackLoading ? "Evaluating... ⏳" : "Submit Answer →"}
                </motion.button>
              </div>
            )}

            {/* FEEDBACK */}
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">AI Feedback</h3>
                    <div className="flex items-center gap-2">
                      <span className={"text-2xl font-bold " + getScoreColor(feedback.score)}>
                        {feedback.score}/10
                      </span>
                      <span className="text-xs text-gray-400">{feedback.verdict}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/20">
                      <p className="text-xs text-green-400 mb-1">✅ Strengths</p>
                      <p className="text-gray-300 text-sm">{feedback.strengths}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
                      <p className="text-xs text-yellow-400 mb-1">⚠️ Improve</p>
                      <p className="text-gray-300 text-sm">{feedback.improvements}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-400/5 border border-blue-400/20">
                      <p className="text-xs text-blue-400 mb-1">💡 Ideal Answer</p>
                      <p className="text-gray-300 text-sm">{feedback.idealAnswer}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  {currentIndex + 1 >= questions.length ? "See Results →" : "Next Question →"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}