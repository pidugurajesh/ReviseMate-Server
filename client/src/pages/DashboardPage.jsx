import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import {
  Play,
  Pause,
  RotateCcw,
  Award,
  Flame,
  BookOpen,
  CheckCircle2,
  Clock,
  Coffee,
  BrainCircuit,
  Volume2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { cardStyle, buttonPrimary, buttonSoft } from "../utils/styles";

// Web Audio API chime synthesizer
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a nice double-tone study chime
    const playTone = (freq, time, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.25, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.start(time);
      osc.stop(time + duration);
    };

    playTone(523.25, ctx.currentTime, 0.8); // C5
    playTone(659.25, ctx.currentTime + 0.15, 1.0); // E5
  } catch (error) {
    console.error("Failed to synthesize chime:", error);
  }
};

export default function DashboardPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: revisions } = useFetch("/revisions");
  const { data: todos } = useFetch("/todos?status=pending");
  const { data: studied } = useFetch("/studied");
  const { data: analytics } = useFetch("/analytics", {});

  const dueToday = revisions.filter((r) => r.status === "due" && !r.overdue).length;

  // Pomodoro Timer States
  const [timerMode, setTimerMode] = useState("study"); // study (25m), short (5m), long (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef(null);

  const quotes = [
    "Focus is a muscle, and you are building it right now.",
    "One Pomodoro session at a time. You've got this.",
    "Deep work yields deep results. Eliminate all distractions.",
    "Don't count the minutes; make the minutes count.",
    "Your future self will thank you for the effort you put in today.",
    "Quiet the mind, focus the gaze, and let the intellect work.",
    "Success is the sum of small efforts repeated day in and day out.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes every 12 seconds while timer is active
  useEffect(() => {
    if (timerActive) {
      const qInterval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 12000);
      return () => clearInterval(qInterval);
    }
  }, [timerActive]);

  const getModeDuration = (mode) => {
    if (mode === "study") return 25 * 60;
    if (mode === "short") return 5 * 60;
    return 15 * 60;
  };

  useEffect(() => {
    setTimeLeft(getModeDuration(timerMode));
    setTimerActive(false);
  }, [timerMode]);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimerActive(false);
            playChime();
            if (timerMode === "study") {
              addToast("Focus session complete! 🎉 Great job.", "success");
              setIsFullscreen(false);
              setShowTimerModal(true);
            } else {
              addToast("Break complete! Time to focus. 🧠", "info");
              setIsFullscreen(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, timerMode]);

  const toggleTimer = () => {
    setTimerActive((prev) => {
      const nextActive = !prev;
      if (nextActive && timerMode === "study") {
        setIsFullscreen(true);
        addToast("Entering Fullscreen Deep Focus Mode 🧘", "info");
      }
      return nextActive;
    });
  };
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(getModeDuration(timerMode));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Gamified Achievements / Badges definition
  const achievements = [
    {
      id: "first_topic",
      title: "First Step",
      desc: "Log your first studied topic",
      icon: BookOpen,
      unlocked: (analytics.totalTopicsStudied || studied.length) >= 1,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "streak_3",
      title: "Streak Starter",
      desc: "Achieve a 3-day study streak",
      icon: Flame,
      unlocked: (user?.longestStreak || 0) >= 3,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "streak_7",
      title: "Consistency King",
      desc: "Achieve a 7-day study streak",
      icon: Award,
      unlocked: (user?.longestStreak || 0) >= 7,
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      id: "collector_10",
      title: "Knowledge Collector",
      desc: "Study 10 topics in total",
      icon: BrainCircuit,
      unlocked: (analytics.totalTopicsStudied || studied.length) >= 10,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "revision_guru",
      title: "Revision Guru",
      desc: "Complete 5 spacing reviews",
      icon: CheckCircle2,
      unlocked: (analytics.completedRevisions || 0) >= 5,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "deep_focus",
      title: "Deep Focus",
      desc: "Study any topic for 60+ minutes",
      icon: Clock,
      unlocked: studied.some((topic) => topic.duration >= 60),
      color: "from-cyan-500 to-teal-500",
    },
  ];

  const totalSeconds = getModeDuration(timerMode);
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <AppLayout>
      {/* Header Panel */}
      <div className={`${cardStyle} mb-5 p-6 bg-gradient-to-r from-indigo-600/85 via-violet-600/80 to-fuchsia-600/80 text-white border-0 relative overflow-hidden shadow-xl`}>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/90 mt-1 max-w-xl">
            Welcome back, <span className="font-semibold">{user?.username || "Scholar"}</span>! Keep up the momentum, view daily reviews, or start a structured Pomodoro study session.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-6 translate-y-6">
          <BrainCircuit size={160} />
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Today's Revisions", value: dueToday, sub: "due now", color: "text-amber-500" },
          { label: "Pending Tasks", value: todos.length, sub: "in to-do list", color: "text-indigo-500" },
          { label: "Total Topics Studied", value: analytics.totalTopicsStudied || studied.length, sub: "records logged", color: "text-fuchsia-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${cardStyle} p-5 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300`}
          >
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h2 className="text-4xl font-bold mt-2 tracking-tight">{stat.value}</h2>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              {stat.value > 0 ? `${stat.value} active items` : "No items"} {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Secondary Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pomodoro Timer - 7 Cols */}
        <div className={`${cardStyle} lg:col-span-7 p-6 flex flex-col items-center justify-center relative min-h-[380px]`}>
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="text-indigo-500 animate-pulse" size={20} />
              Pomodoro Focus Timer
            </h3>
            <div className="flex gap-1.5 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl">
              {[
                { id: "study", label: "Study", icon: BrainCircuit },
                { id: "short", label: "Short Break", icon: Coffee },
                { id: "long", label: "Long Break", icon: Volume2 },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTimerMode(m.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timerMode === m.id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical Progress & Digital Clock */}
          <div className="relative my-4 flex items-center justify-center w-52 h-52">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="92"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="104"
                cy="104"
                r="92"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 92}
                animate={{ strokeDashoffset: (2 * Math.PI * 92) * (1 - progressPercent / 100) }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <h2 className="text-4xl font-extrabold font-mono tracking-tight text-slate-800 dark:text-slate-100">
                {formatTime(timeLeft)}
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-1">
                {timerActive ? "Focusing..." : "Paused"}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={toggleTimer}
              className={`${buttonPrimary} p-3 rounded-full flex items-center justify-center shadow-lg`}
              title={timerActive ? "Pause" : "Start"}
            >
              {timerActive ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className={`${buttonSoft} p-3 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300`}
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className={`${buttonSoft} p-3 rounded-full flex items-center justify-center text-slate-655 dark:text-slate-300`}
              title="Enter Fullscreen Deep Focus"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Gamified Achievements - 5 Cols */}
        <div className={`${cardStyle} lg:col-span-5 p-6 min-h-[380px]`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Award className="text-fuchsia-500" size={20} />
              Study Achievements
            </h3>
            {user?.longestStreak > 0 && (
              <span className="text-xs bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Flame size={12} className="fill-current" />
                Streak Record: {user.longestStreak}d
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                    ach.unlocked
                      ? "bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80"
                      : "bg-slate-100/40 dark:bg-slate-950/20 border-slate-200/40 dark:border-slate-800/30 opacity-55"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl text-white bg-gradient-to-br ${
                      ach.unlocked ? ach.color : "from-slate-400 to-slate-500 dark:from-slate-700 dark:to-slate-800"
                    } shadow-md`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm leading-tight ${ach.unlocked ? "text-slate-800 dark:text-slate-150" : "text-slate-500 dark:text-slate-400"}`}>
                      {ach.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{ach.desc}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 rounded-lg">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800/40 px-2 py-0.5 rounded-lg">
                      Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pomodoro Study Session Log Modal */}
      <AnimatePresence>
        {showTimerModal && (
          <div className="fixed inset-0 grid place-items-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${cardStyle} max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative z-10 border border-indigo-500/30 bg-white/95 dark:bg-slate-900/95`}
            >
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 grid place-items-center mx-auto shadow-md shadow-indigo-500/5">
                <BrainCircuit size={28} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-150">Great Session!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  You completed 25 minutes of high-focus study. Would you like to log this study topic into your logs right now?
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowTimerModal(false);
                    navigate("/studied", { state: { autofillDuration: 25 } });
                  }}
                  className={`${buttonPrimary} px-5 py-2 text-sm font-semibold`}
                >
                  Yes, log topic
                </button>
                <button
                  onClick={() => setShowTimerModal(false)}
                  className={`${buttonSoft} px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-350`}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Focus Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 text-white z-[9999] flex flex-col justify-between p-8"
          >
            {/* Background glowing mesh */}
            <div className="glow-orb h-[40rem] w-[40rem] bg-indigo-500/10 top-[-10%] left-[-10%] filter blur-[100px] opacity-60 animate-pulse pointer-events-none" />
            <div className="glow-orb h-[40rem] w-[40rem] bg-fuchsia-500/10 bottom-[-10%] right-[-10%] filter blur-[100px] opacity-60 animate-pulse pointer-events-none" />

            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-indigo-400 animate-pulse" size={24} />
                <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-400">
                  Deep Focus Mode
                </span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1.5"
              >
                <Minimize2 size={14} /> Exit Fullscreen
              </button>
            </div>

            {/* Center Timer */}
            <div className="flex flex-col items-center justify-center text-center z-10 flex-1 my-10 max-w-xl mx-auto space-y-8">
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm uppercase tracking-widest text-indigo-400 font-extrabold">
                  {timerMode === "study" ? "Time to Learn" : "Rest Period"}
                </h4>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {timerMode === "study" ? "Focus on the task" : "Recharge your energy"}
                </p>
              </div>

              {/* Huge Timer Digital Representation */}
              <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-indigo-500"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 140}
                    animate={{ strokeDashoffset: (2 * Math.PI * 140) * (1 - progressPercent / 100) }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <h1 className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    {formatTime(timeLeft)}
                  </h1>
                </div>
              </div>

              {/* Rotating Motivational Quotes */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.8 }}
                  className="text-sm sm:text-base text-slate-400 italic font-medium max-w-md h-12"
                >
                  "{quotes[quoteIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-center gap-6 z-10">
              <button
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20"
              >
                {timerActive ? <Pause size={24} /> : <Play size={24} className="translate-x-0.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 active:scale-95 text-slate-300 flex items-center justify-center"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
