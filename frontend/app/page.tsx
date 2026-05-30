"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";

const features = [
  { icon: "↗", title: "Resume Intelligence", desc: "Deep AI scan maps every skill, gap, and opportunity in seconds." },
  { icon: "⬡", title: "GitHub Audit", desc: "Stack depth, code quality, and project impact — fully analyzed." },
  { icon: "◎", title: "Market Intelligence", desc: "Live job trends, salary benchmarks, demand forecasts." },
  { icon: "▸", title: "90-Day Roadmap", desc: "Week-by-week action plan to close your skill gaps fast." },
  { icon: "◈", title: "AI Career Advisor", desc: "Knows your profile. Gives real, specific, actionable advice." },
  { icon: "◇", title: "Mock Interviews", desc: "AI questions. Instant feedback. Real performance scores." },
];

export default function Home() {
  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <Navbar />

      {/* ANIMATED GRID BACKGROUND */}
<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
  <motion.div
    animate={{
      backgroundPosition: ["0px 0px", "80px 80px"],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute inset-0"
    style={{
      backgroundImage: "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
    }}
  />
  {/* Fade edges so grid doesn't look cut off */}
  <div className="absolute inset-0"
    style={{
      background: "radial-gradient(ellipse at center, transparent 80%, #080808 100%)"
    }}
  />
</div>

      {/* GOLD GLOW — top center */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, transparent 90%)" }}
      />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24">

        {/* EYEBROW */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400/70 mb-6"
        >
          AI Career Intelligence Platform
        </motion.p>

        {/* HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.0] max-w-4xl mb-8"
          style={{ letterSpacing: "-0.03em" }}
        >
          Your career,
          <br />
          <span style={{
            background: "linear-gradient(135deg, #FFD07A 0%, #F5A623 50%, #C17D0A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            engineered.
          </span>
        </motion.h1>

        {/* SUBHEADING */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12"
          style={{ fontWeight: 300 }}
        >
          Upload your resume and GitHub. Get a complete AI analysis —
          skill gaps, market fit, salary range, and a 90-day roadmap.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <Link
            href="/analyze"
            className="group flex items-center gap-2 px-7 py-3.5 bg-amber-400 text-black text-sm font-bold rounded-xl hover:bg-amber-300 transition-all duration-200"
          >
            Analyze My Career
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-3.5 text-sm font-medium text-gray-400 hover:text-white border border-white/8 hover:border-white/20 rounded-xl transition-all duration-200"
          >
            View Dashboard
          </Link>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-12 mt-20 text-center"
        >
          {[
            { value: "10,000+", label: "Profiles analyzed" },
            { value: "95%", label: "Accuracy rate" },
            { value: "3×", label: "Faster hiring" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <p className="text-2xl font-bold text-amber-400">{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </section>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400/60 mb-4">
            Platform
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Everything you need.<br />Nothing you don't.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-8 bg-[#080808] hover:bg-amber-400/3 transition-colors duration-300 group"
            >
              <p className="text-amber-400/60 text-2xl mb-6 font-light">{f.icon}</p>
              <h3 className="text-white text-base font-semibold mb-2 group-hover:text-amber-400 transition-colors duration-200">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400/60 mb-4">
            Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Three steps.<br />Complete clarity.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Upload", desc: "Your GitHub username and resume PDF. That's all we need." },
            { step: "02", title: "Analyze", desc: "AI processes your full profile against live market data in seconds." },
            { step: "03", title: "Execute", desc: "Your roadmap is ready. Start your 90-day sprint to the next role." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <p className="text-7xl font-bold text-white/4 mb-6 leading-none">{s.step}</p>
              <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 px-6 pb-40 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(245,166,35,0.05) 0%, transparent 60%)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400/60 mb-6">
            Get Started
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
            Your next role is<br />
            <span style={{
              background: "linear-gradient(135deg, #FFD07A 0%, #F5A623 50%, #C17D0A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              90 days away.
            </span>
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Let AI show you exactly how to get there.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-10 py-4 bg-amber-400 text-black rounded-xl font-bold text-sm hover:bg-amber-300 transition-all duration-200 group"
          >
            Analyze My Career
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </Link>
        </motion.div>
      </section>

    </main>
  );
}