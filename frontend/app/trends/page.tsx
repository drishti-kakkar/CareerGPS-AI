"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const demandData = [
  { role: "Full Stack", demand: 92 },
  { role: "AI/ML", demand: 98 },
  { role: "DevOps", demand: 85 },
  { role: "Frontend", demand: 78 },
  { role: "Backend", demand: 82 },
  { role: "Data Eng", demand: 88 },
];

const salaryTrend = [
  { year: "2021", salary: 6 },
  { year: "2022", salary: 8 },
  { year: "2023", salary: 11 },
  { year: "2024", salary: 14 },
  { year: "2025", salary: 18 },
  { year: "2026", salary: 22 },
];

const aiRiskData = [
  { role: "Data Entry", risk: 95 },
  { role: "Testing", risk: 70 },
  { role: "Frontend", risk: 40 },
  { role: "AI/ML Eng", risk: 15 },
  { role: "Architect", risk: 10 },
  { role: "Full Stack", risk: 30 },
];

const skillDemandData = [
  { skill: "React", value: 90 },
  { skill: "Python", value: 95 },
  { skill: "Docker", value: 80 },
  { skill: "TypeScript", value: 85 },
  { skill: "AWS", value: 88 },
  { skill: "System Design", value: 78 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const SalaryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-semibold">{payload[0].value} LPA</p>
      </div>
    );
  }
  return null;
};

export default function TrendsPage() {
  const [userRole, setUserRole] = useState("Full Stack");

  useEffect(() => {
    const stored = localStorage.getItem("careerData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.targetRole) setUserRole(parsed.targetRole);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold">Market Trends</h1>
          <p className="text-gray-500 text-sm mt-1">
            Job market intelligence for <span className="text-white">{userRole}</span>
          </p>
        </motion.div>

        {/* TOP STAT CARDS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Avg Salary 2026", value: "22 LPA", color: "text-green-400" },
            { label: "YoY Growth", value: "+18%", color: "text-blue-400" },
            { label: "Open Positions", value: "1.2k", color: "text-purple-400" },
            { label: "Skill Demand", value: "High", color: "text-yellow-400" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/5"
            >
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={"text-2xl font-bold " + s.color}>{s.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CHART 1 — Role Demand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-6">📊 Role Demand Score (2026)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={demandData} barSize={32}>
              <XAxis dataKey="role" stroke="#555" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" fill="#ffffff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CHART 2 — Salary Trend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-6">📈 Average Salary Trend (LPA)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salaryTrend}>
              <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 12 }} />
              <Tooltip content={<SalaryTooltip />} />
              <Line
                type="monotone"
                dataKey="salary"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ fill: "#ffffff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CHART 3 — AI Risk */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-2">🤖 AI Replacement Risk by Role</h2>
          <p className="text-gray-500 text-xs mb-6">Lower is safer</p>
          <div className="space-y-3">
            {aiRiskData.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{r.role}</span>
                  <span className={r.risk > 60 ? "text-red-400" : r.risk > 35 ? "text-yellow-400" : "text-green-400"}>
                    {r.risk}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: r.risk + "%" }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
                    className={
                      "h-2 rounded-full " +
                      (r.risk > 60 ? "bg-red-400" : r.risk > 35 ? "bg-yellow-400" : "bg-green-400")
                    }
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CHART 4 — Skill Demand Radar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h2 className="text-lg font-semibold mb-6">🎯 Top Skills Market Demand</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillDemandData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#888", fontSize: 12 }} />
              <PolarRadiusAxis stroke="#444" tick={{ fill: "#666", fontSize: 10 }} domain={[0, 100]} />
              <Radar
                name="Demand"
                dataKey="value"
                stroke="#ffffff"
                fill="#ffffff"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

      </section>
    </main>
  );
}