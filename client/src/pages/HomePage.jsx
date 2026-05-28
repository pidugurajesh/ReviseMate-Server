import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Brain,
  Clock,
  Award,
  Flame,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { buttonPrimary, buttonSoft, cardStyle } from "../utils/styles";

export default function HomePage() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: Layers,
      title: "Spaced Repetition (SM-2)",
      desc: "An intelligent active recall scheduler based on the SuperMemo-2 algorithm. Prompts review on Day 4 and Day 7 to commit knowledge to long-term memory.",
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: Clock,
      title: "Pomodoro Focus Timer",
      desc: "Integrates focus session tracking. Spend 25 minutes studying with dynamic chime reminders, then log studied topics immediately to active recall slots.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Flame,
      title: "Gamified Streak System",
      desc: "Keep up the momentum. Tracks consecutive study days and records your longest streaks, unlocking special achievement badges as you progress.",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Award,
      title: "Sleek Analytics & Metrics",
      desc: "Visualize your progress. Interactive charts show daily focus minutes, subject time distributions, and spacing review completion rates.",
      color: "from-fuchsia-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Glow Orbs */}
      <div className="glow-orb h-80 w-80 bg-indigo-500/25 top-10 left-10" />
      <div className="glow-orb h-96 w-96 bg-fuchsia-500/20 top-40 right-20" />
      <div className="glow-orb h-72 w-72 bg-cyan-400/20 bottom-20 left-1/3" />

      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative z-25">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white grid place-items-center shadow-lg shadow-violet-500/30">
            <Brain size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">ReviseMate</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Smart spaced revision</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className={`${buttonPrimary} px-4 py-2 text-xs font-semibold`}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold hover:text-indigo-600 transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link to="/register" className={`${buttonPrimary} px-4 py-2 text-xs font-semibold`}>
                Start for Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 relative z-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6"
        >
          <Sparkles size={12} className="animate-spin-slow" /> Spaced Repetition + Focus Timer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl"
        >
          Master Any Subject with{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Spaced Revision
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-lg text-slate-655 dark:text-slate-300 mt-6 max-w-2xl leading-relaxed"
        >
          Stop forgetting what you study. Log topics, create interactive flashcards, track focused Pomodoros, and let algorithms plan your reviews dynamically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          {user ? (
            <Link to="/dashboard" className={`${buttonPrimary} px-8 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-xl shadow-violet-500/20`}>
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/register" className={`${buttonPrimary} px-8 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-xl shadow-violet-500/20`}>
                Start Revising Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className={`${buttonSoft} px-8 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-350`}>
                Sign In
              </Link>
            </>
          )}
        </motion.div>

        {/* Dashboard Preview mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl mt-16 p-2 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-fuchsia-500/20 border border-white/20 dark:border-white/10 shadow-2xl relative"
        >
          <div className="bg-slate-900 rounded-[2.2rem] overflow-hidden border border-black/40 shadow-inner flex flex-col">
            {/* Mock browser Chrome header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
              </div>
              <div className="bg-slate-900 text-slate-500 text-[10px] py-1 px-16 rounded-lg text-center mx-auto truncate max-w-sm">
                revisemate.vercel.app/dashboard
              </div>
            </div>
            {/* Mock content representation */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/70 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-indigo-400">Pomodoro Timer</span>
                    <span className="text-[10px] text-slate-500 font-mono">25:00</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-1/3 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Topic: Binary Search Trees</span>
                    <span className="text-emerald-400 font-semibold">Active Focus</span>
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/70 space-y-3">
                  <span className="text-xs font-semibold text-violet-400 block">Due Revisions</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
                      <span className="font-medium text-slate-300">Space Complexity of Sorting</span>
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">Due Now</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
                      <span className="font-medium text-slate-300">HTTP/2 Multiplexing Protocol</span>
                      <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">Overdue</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
                    <Flame size={14} className="fill-orange-400" /> Study Streak
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-100 mt-2">7 Days</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Keep it up! Keep learning every day.</p>
                </div>
                <div className="mt-8 border-t border-slate-800/70 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Completed Spacings</span>
                    <span className="font-mono text-slate-200">12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Hours Studied</span>
                    <span className="font-mono text-slate-200">18.5h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-20 border-t border-slate-200/50 dark:border-slate-800/40">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">Built for Peak Cognitive Recall</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            ReviseMate integrates classic spaced learning science with modern focus tools and active recall loops.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`${cardStyle} p-6 flex flex-col md:flex-row gap-5 hover:scale-[1.015] hover:shadow-xl transition-all duration-300`}
              >
                <div className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${feat.color} text-white grid place-items-center shadow-md`}>
                  <Icon size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Spacing Science Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-20 border-t border-slate-200/50 dark:border-slate-800/40 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">The Science of Spacing</h2>
          <p className="text-sm sm:text-base text-slate-655 dark:text-slate-350 leading-relaxed">
            The Ebbinghaus Forgetting Curve shows that memory retention decays exponentially after learning. Spaced repetition counteracts this by prompting you to retrieve information just as you are about to forget it.
          </p>
          <div className="space-y-3">
            {[
              "Review 1 (Dynamic interval) - Days 3 to 4: Retain initial learnings.",
              "Review 2 (Spaced interval) - Day 7: Consolidate data into long-term recall.",
              "Interactive flashcards allow self-reflection quality inputs for SM-2 adjustments.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-655 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className={`${cardStyle} p-6 border border-indigo-500/10`}>
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Spacing Schedule Chart</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400 font-semibold font-mono">Day 1</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-6 rounded-lg overflow-hidden flex items-center px-3">
                  <span className="text-[10px] font-bold text-slate-500">Initial Learning Session</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400 font-semibold font-mono">Day 4</span>
                <div className="flex-1 bg-indigo-500/15 border border-indigo-500/20 h-6 rounded-lg overflow-hidden flex items-center px-3 justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">1st Recall Review (+3d)</span>
                  <ChevronRight size={10} className="text-indigo-400" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400 font-semibold font-mono">Day 7</span>
                <div className="flex-1 bg-violet-500/15 border border-violet-500/20 h-6 rounded-lg overflow-hidden flex items-center px-3 justify-between">
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">2nd Recall Review (+3d)</span>
                  <ChevronRight size={10} className="text-violet-400" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400 font-semibold font-mono">Day 7+</span>
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 h-6 rounded-lg overflow-hidden flex items-center px-3">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Long-term Memory Retention Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-20 text-center">
        <div className={`${cardStyle} p-8 md:p-12 bg-gradient-to-br from-indigo-600/90 to-violet-600/95 text-white border-0 shadow-2xl relative overflow-hidden`}>
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold">Ready to study smarter?</h2>
            <p className="text-xs sm:text-sm text-indigo-100">
              Join ReviseMate today to track studied topics, optimize your Pomodoros, and review efficiently with SM-2 spaced repetition algorithms.
            </p>
            <div className="pt-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-slate-100 font-semibold px-8 py-3 rounded-2xl text-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                {user ? "Go to Dashboard" : "Create Free Account"} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {/* Subtle orb background in CTA */}
          <div className="absolute right-[-10%] top-[-20%] opacity-15">
            <Brain size={250} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 relative z-20 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-455">
        <p>© {new Date().getFullYear()} ReviseMate. Active Spaced Repetition Study Companion.</p>
      </footer>
    </div>
  );
}
