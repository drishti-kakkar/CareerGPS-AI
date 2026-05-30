"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import ChatBot from "@/app/components/ChatBot";

export default function DashboardPage() {
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
          <p className="text-5xl mb-6">🗺️</p>
          <h2 className="text-2xl font-black mb-3">No Analysis Yet</h2>
          <p className="text-gray-400 mb-8">Upload your CV and GitHub to generate your career roadmap.</p>
          <a href="/analyze" className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition">
            Start Analysis →
          </a>
        </div>
      </main>
    );
  }

  const skillGapData = (data.skillGaps || []).map((s: any) => ({
    skill: s.skill,
    current: s.level,
    gap: 100 - s.level,
  }));

  const radarData = (data.skillGaps || []).map((s: any) => ({
    subject: s.skill,
    score: s.level,
    fullMark: 100,
  }));

  const matchScore = parseInt(data.skillMatchScore) || 70;
  const pieData = [
    { name: "Match", value: matchScore },
    { name: "Gap", value: 100 - matchScore },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="inline-block text-xs text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-3 py-1 mb-4">
            ✓ Analysis Complete
          </span>
          <h1 className="text-4xl font-black">Your Career Dashboard</h1>
          {data.targetRole && (
            <p className="text-gray-400 mt-2 text-lg">
              Best role for you: <span className="text-white font-bold">{data.targetRole}</span>
            </p>
          )}
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Skill Match", value: data.skillMatchScore, color: "text-green-400" },
            { label: "Market Demand", value: data.marketDemand, color: "text-blue-400" },
            { label: "AI Risk Level", value: data.aiRiskLevel, color: "text-yellow-400" },
            { label: "Jobs Available", value: data.jobsAvailable, color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/5"
            >
              <p className="text-gray-500 text-xs mb-2">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* SALARY + COMPANIES */}
        {data.salaryRange && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <p className="text-gray-500 text-sm mb-1">💰 Expected Salary Range</p>
              <p className="text-3xl font-black text-green-400">
                ₹{(data.salaryRange.min || 0).toLocaleString()} — ₹{(data.salaryRange.max || 0).toLocaleString()}
                <span className="text-sm text-gray-500 font-normal ml-2">/ month</span>
              </p>
            </div>
            {data.topCompanies && (
              <div>
                <p className="text-gray-500 text-sm mb-2">🏢 Top Companies Hiring You</p>
                <div className="flex flex-wrap gap-2">
                  {data.topCompanies.map((c: string) => (
                    <span key={c} className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-base font-bold mb-4">🧠 Skill Radar</h2>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Radar dataKey="score" stroke="#ffffff" fill="#ffffff" fillOpacity={0.1} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center">
            <h2 className="text-base font-bold mb-2 self-start">🎯 Match Score</h2>
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={100} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                    <Cell fill="#ffffff" />
                    <Cell fill="#1f1f1f" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black">{data.skillMatchScore}</p>
                <p className="text-gray-500 text-xs">overall match</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BAR CHART */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6">
          <h2 className="text-base font-bold mb-6">📊 Skill Gap Analysis</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillGapData} barCategoryGap="30%">
              <XAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="current" fill="#ffffff" radius={[4, 4, 0, 0]} name="Current Level" />
              <Bar dataKey="gap" fill="#222222" radius={[4, 4, 0, 0]} name="Gap to Fill" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* STRENGTHS + IMPROVEMENTS */}
        {(data.strengthSummary || data.improvementSummary) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <h2 className="text-base font-bold text-green-400 mb-3">💪 Your Strengths</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{data.strengthSummary}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
              <h2 className="text-base font-bold text-yellow-400 mb-3">🎯 Areas To Improve</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{data.improvementSummary}</p>
            </motion.div>
          </div>
        )}

        {/* TOP SKILLS */}
        {data.topSkills?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6">
            <h2 className="text-base font-bold mb-4">⚡ Your Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.topSkills.map((s: string) => (
                <span key={s} className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-sm">{s}</span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ROADMAP */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-base font-bold mb-6">🗺️ Your 90-Day Roadmap</h2>
          <div className="space-y-3">
            {(data.roadmap || []).map((r: any, i: number) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.06 }}
                className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/15 transition">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{r.week}</p>
                  <p className="text-sm text-gray-200">{r.task}</p>
                  {r.resource && <p className="text-xs text-blue-400 mt-1">📚 {r.resource}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </section>
      <ChatBot careerData={data} />
    </main>
  );
}