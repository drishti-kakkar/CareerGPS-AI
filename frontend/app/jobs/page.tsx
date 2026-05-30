"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

interface Job {
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  url: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadJobs = async (searchRole: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/jobs?role=" + encodeURIComponent(searchRole));
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("careerData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const target = parsed.targetRole || "software developer";
      setSearch(target);
      loadJobs(target);
    } else {
      setSearch("software developer");
      loadJobs("software developer");
    }
  }, []);

  const handleSearch = () => {
    if (search.trim()) loadJobs(search.trim());
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const minStr = min ? "£" + Math.round(min / 1000) + "k" : "";
    const maxStr = max ? "£" + Math.round(max / 1000) + "k" : "";
    if (minStr && maxStr) return minStr + " - " + maxStr;
    return minStr || maxStr;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time jobs matched to your target role
          </p>
        </motion.div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search role e.g. React Developer"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-20">
            Fetching real jobs...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No jobs found. Try a different role.
          </div>
        )}

        <div className="space-y-4">
          {jobs.map((job, i) => {
            const salary = formatSalary(job.salary_min, job.salary_max);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base">
                      {job.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {job.company} · {job.location}
                    </p>
                    {salary && (
                      <p className="text-green-400 text-sm mt-1">
                        {salary}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                      {job.description}...
                    </p>
                  </div>
                  <a
                   href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2 border border-white/20 text-white text-sm rounded-xl hover:border-white/40 transition"
                    >
                    Apply
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}