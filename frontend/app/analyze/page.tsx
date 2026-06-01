"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [github, setGithub] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!github || !file) return alert("Please enter GitHub username and upload your CV!");
    setLoading(true);
    const formData = new FormData();
    formData.append("github", github);
    formData.append("resume", file);
    try {
      const res = await fetch("https://careergps-backend-4sl3.onrender.com", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem("careerData", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-3">Analyze My Career</h1>
            <p className="text-gray-400">Your data stays private. AI does the rest in 30 seconds.</p>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <label className="text-sm text-gray-400 mb-3 block font-medium">GitHub Username</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="e.g. torvalds"
                className="w-full bg-transparent text-white placeholder-gray-600 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition text-sm"
              />
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <label className="text-sm text-gray-400 mb-3 block font-medium">Upload CV / Resume (PDF)</label>
              <div
                onClick={() => document.getElementById("resume-input")?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center cursor-pointer hover:border-white/30 transition"
              >
                {file ? (
                  <p className="text-white font-medium">{file.name}</p>
                ) : (
                  <p className="text-gray-400 text-sm">Click to upload PDF</p>
                )}
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition disabled:opacity-40"
            >
              {loading ? "Analyzing..." : "Generate Career Roadmap →"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}