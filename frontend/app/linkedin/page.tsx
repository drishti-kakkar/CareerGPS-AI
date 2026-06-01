"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface Tip {
  section: string;
  priority: "High" | "Medium" | "Low";
  tip: string;
  example: string;
}

interface Analysis {
  overallScore: number;
  topSkills: string[];
  experienceSummary: string;
  projectsSummary: string;
  educationSummary: string;
  jobRoleProbability: { role: string; probability: number }[];
  tips: Tip[];
}

export default function LinkedInPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState<any>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [connections, setConnections] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("careerData");
    if (stored) setCareerData(JSON.parse(stored));
  }, []);

  const analyze = async () => {
    if (!linkedinUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://careergps-backend-4sl3.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career_data: careerData || {},
          linkedin_url: linkedinUrl,
          connections: connections,
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === "High") return "text-red-400 border-red-400/30 bg-red-400/5";
    if (p === "Medium") return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5";
    return "text-green-400 border-green-400/30 bg-green-400/5";
  };

  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-400";
    if (s >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const icons: Record<string, string> = {
    Headline: "✍️", About: "📝", Experience: "💼",
    Skills: "🛠️", Projects: "🚀", Networking: "🤝",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-16">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold">LinkedIn Optimizer</h1>
          <p className="text-gray-500 text-sm mt-1">Full profile analysis + optimization tips</p>
        </motion.div>

        {/* INPUT FORM */}
        {!analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <label className="text-sm text-gray-400 mb-2 block">🔗 LinkedIn Profile URL *</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full bg-transparent text-white placeholder-gray-600 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition text-sm"
              />
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <label className="text-sm text-gray-400 mb-2 block">🤝 Connections Count (optional)</label>
              <input
                type="text"
                value={connections}
                onChange={(e) => setConnections(e.target.value)}
                placeholder="e.g. 150, 500+, 1k+"
                className="w-full bg-transparent text-white placeholder-gray-600 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyze}
              disabled={loading || !linkedinUrl.trim()}
              className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Analyzing LinkedIn... ⏳" : "Analyze My LinkedIn →"}
            </motion.button>
          </motion.div>
        )}

        {/* ANALYSIS RESULTS */}
        {analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            <div className="flex justify-end">
              <button onClick={() => setAnalysis(null)} className="text-xs text-gray-500 hover:text-white">
                ← Re-analyze
              </button>
            </div>

            {/* OVERALL SCORE */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
              <p className="text-gray-400 text-sm mb-2">LinkedIn Profile Score</p>
              <p className={"text-7xl font-bold mb-2 " + getScoreColor(analysis.overallScore)}>
                {analysis.overallScore}
              </p>
              <p className="text-gray-500 text-sm">out of 100</p>
            </div>

            {/* TOP SKILLS */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold mb-4">🛠️ Top Skills Detected</h2>
              <div className="flex flex-wrap gap-2">
                {(analysis.topSkills || []).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE + PROJECTS + EDUCATION */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "💼 Experience", content: analysis.experienceSummary },
                { title: "🚀 Projects", content: analysis.projectsSummary },
                { title: "🎓 Education", content: analysis.educationSummary },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/10 bg-white/5">
                  <h2 className="text-base font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            {/* JOB ROLE PROBABILITY */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold mb-6">🎯 Job Role Probability</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analysis.jobRoleProbability} barSize={28} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis type="category" dataKey="role" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} width={130} />
                  <Tooltip
                    contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(v: any) => [v + "%", "Match"]}
                  />
                  <Bar dataKey="probability" fill="#ffffff" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* OPTIMIZATION TIPS */}
            <div>
              <h2 className="text-lg font-semibold mb-4">💡 Optimization Tips</h2>
              <div className="space-y-4">
                {(analysis.tips || []).map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icons[tip.section] || "💡"}</span>
                        <span className="text-white font-semibold">{tip.section}</span>
                      </div>
                      <span className={"text-xs px-2 py-1 rounded-full border font-medium " + getPriorityColor(tip.priority)}>
                        {tip.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{tip.tip}</p>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Example:</p>
                      <p className="text-gray-300 text-xs italic">{tip.example}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition"
            >
              Open My LinkedIn →
            </a>
          </motion.div>
        )}
      </section>
    </main>
  );
}