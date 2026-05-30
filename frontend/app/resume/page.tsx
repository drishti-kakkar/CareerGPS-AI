"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function ResumePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("careerData");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">No resume data found.</p>
          <a href="/analyze" className="px-6 py-3 bg-white text-black rounded-xl font-semibold">
            Analyze First →
          </a>
        </div>
      </main>
    );
  }

  const scoreNum = parseInt(data.skillMatchScore) || 0;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-400";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Strong Profile";
    if (score >= 50) return "Decent Profile";
    return "Needs Improvement";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold">Resume Score</h1>
          <p className="text-gray-500 text-sm mt-1">
            Detailed breakdown of your profile strength
          </p>
        </motion.div>

        {/* SCORE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl border border-white/10 bg-white/5 mb-6 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Overall Score</p>
          <p className={"text-8xl font-bold mb-2 " + getScoreColor(scoreNum)}>
            {data.skillMatchScore}
          </p>
          <span className={"px-3 py-1 rounded-full text-xs font-semibold text-black " + getScoreBg(scoreNum)}>
            {getScoreLabel(scoreNum)}
          </span>
          <p className="text-gray-500 text-sm mt-4">
            Target Role: <span className="text-white font-medium">{data.targetRole}</span>
          </p>
        </motion.div>

        {/* STATS ROW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Market Demand", value: data.marketDemand, color: "text-blue-400" },
            { label: "AI Risk", value: data.aiRiskLevel, color: "text-yellow-400" },
            { label: "Jobs Available", value: data.jobsAvailable, color: "text-purple-400" },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl border border-white/10 bg-white/5 text-center">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={"text-xl font-bold " + s.color}>{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* TOP SKILLS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">✅ Top Skills Detected</h2>
          <div className="flex flex-wrap gap-2">
            {(data.topSkills || []).map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* SKILL GAPS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-5">⚠️ Skill Gaps</h2>
          <div className="space-y-4">
            {(data.skillGaps || []).map((s: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{s.skill}</span>
                  <span className="text-gray-500">{s.level}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: s.level + "%" }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-2 rounded-full bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* STRENGTHS & IMPROVEMENTS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
            <h2 className="text-lg font-semibold mb-3 text-green-400">💪 Strengths</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {data.strengthSummary}
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
            <h2 className="text-lg font-semibold mb-3 text-yellow-400">🎯 Improvements</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {data.improvementSummary}
            </p>
          </div>
        </motion.div>

        {/* SALARY RANGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">💰 Expected Salary Range</h2>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Minimum</p>
              <p className="text-2xl font-bold text-green-400">
                {data.salaryRange?.min || "N/A"}
              </p>
            </div>
<div className="flex-1 mx-6 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Maximum</p>
              <p className="text-2xl font-bold text-blue-400">
                {data.salaryRange?.max || "N/A"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4"
        >
          <a
            href="/jobs"
            className="flex-1 py-3 bg-white text-black rounded-xl font-semibold text-center hover:bg-gray-200 transition"
          >
            View Matching Jobs →
          </a>
          <a
            href="/analyze"
            className="flex-1 py-3 border border-white/20 text-white rounded-xl font-semibold text-center hover:border-white/40 transition"
          >
            Re-Analyze
          </a>
        </motion.div>

      </section>
    </main>
  );
}