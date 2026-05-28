import { useState } from "react";
import confetti from "canvas-confetti";
import { useToast } from "../context/ToastContext";
import { Layers, AlertTriangle, CheckCircle, ArrowRight, Eye, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";
import { buttonPrimary, cardStyle, buttonSoft } from "../utils/styles";

// Rating definitions for SM-2
const RATINGS = [
  { value: 0, label: "Blackout", desc: "Complete failure to remember anything" },
  { value: 1, label: "Incorrect", desc: "Wrong answer, but recognized it once revealed" },
  { value: 2, label: "Hard Recall", desc: "Incorrect, but very easy to correct/remember" },
  { value: 3, label: "Effort", desc: "Correct, but required serious effort/hesitation" },
  { value: 4, label: "Good", desc: "Correct, with a small hesitation or easy recall" },
  { value: 5, label: "Perfect", desc: "Flawless, immediate active recall" },
];

export default function RevisionsPage() {
  const { addToast } = useToast();
  const { data, refetch } = useFetch("/revisions");
  const [activeRevision, setActiveRevision] = useState(null);
  
  // Interactive Modal State
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState([]); // Array of quality ratings per card
  const [recallNotes, setRecallNotes] = useState("");

  const due = data.filter((r) => r.status === "due");
  const completed = data.filter((r) => r.status === "completed").slice(0, 6);

  const startRevision = (revision) => {
    setActiveRevision(revision);
    setCardIndex(0);
    setShowAnswer(false);
    setRatings([]);
    setRecallNotes(revision.topicId?.notes || "");
  };

  const submitRevisionScore = async (finalQuality) => {
    try {
      await api.put(`/revisions/${activeRevision._id}/complete`, {
        quality: finalQuality,
        notes: recallNotes,
      });
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      addToast("Revision completed! Spaced interval updated. 🧠", "success");
      setActiveRevision(null);
      refetch();
    } catch (error) {
      console.error("Failed to complete revision:", error);
      addToast("Failed to complete revision", "error");
    }
  };

  const handleRateCard = (ratingValue) => {
    const flashcards = activeRevision.topicId?.flashcards || [];
    const newRatings = [...ratings, ratingValue];
    setRatings(newRatings);

    if (cardIndex < flashcards.length - 1) {
      setCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      // Calculate average rating across all cards for SM-2 input
      const avg = Math.round(newRatings.reduce((sum, r) => sum + r, 0) / flashcards.length);
      submitRevisionScore(avg);
    }
  };

  const flashcards = activeRevision?.topicId?.flashcards || [];
  const currentCard = flashcards[cardIndex];

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Revisions</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Complete due topics on time to improve retention and maintain your streak.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Layers size={18} className="text-indigo-500" />
        Revise Today
      </h2>
      <div className="space-y-3 mb-6">
        {due.length === 0 ? (
          <div className={`${cardStyle} p-8 text-center`}>
            <p className="font-semibold">All caught up for now</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              No due revisions at the moment. Great consistency.
            </p>
          </div>
        ) : (
          due.map((item) => (
            <div key={item._id} className={`${cardStyle} border-l-4 ${item.overdue ? "border-rose-500" : "border-amber-500"} p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{item.topicId?.topic}</p>
                <p className="text-sm text-slate-550 dark:text-slate-400 mt-0.5">
                  {item.overdue ? "Overdue" : "Due now"} • Subject: <span className="font-medium">{item.topicId?.subject || "General"}</span>
                </p>
                {item.topicId?.flashcards?.length > 0 && (
                  <span className="inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md mt-1.5">
                    {item.topicId.flashcards.length} Active Flashcards
                  </span>
                )}
              </div>
              <div className="flex gap-2 self-start md:self-center">
                <button
                  className={`${buttonPrimary} px-4 py-1.5 text-xs font-semibold`}
                  onClick={() => startRevision(item)}
                >
                  Complete
                </button>
                <button
                  className={`${buttonSoft} px-4 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold`}
                  onClick={async () => {
                    await api.put(`/revisions/${item._id}/snooze`, { minutes: 120 });
                    addToast("Revision snoozed for 2h ⏰", "info");
                    refetch();
                  }}
                >
                  Snooze 2h
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <CheckCircle size={18} className="text-emerald-500" />
        Recent Revision History
      </h3>
      <div className="space-y-2">
        {completed.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">No completed revisions yet.</p>
        ) : (
          completed.map((item) => (
            <div key={item._id} className={`${cardStyle} p-4 flex justify-between items-center bg-white/50`}>
              <div>
                <p className="font-medium text-slate-850">{item.topicId?.topic || "Topic deleted"}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completed at {new Date(item.completedAt).toLocaleString()}
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-lg">
                Done
              </span>
            </div>
          ))
        )}
      </div>

      {/* Interactive Active Recall Modal */}
      <AnimatePresence>
        {activeRevision && (
          <div className="fixed inset-0 grid place-items-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${cardStyle} max-w-lg w-full p-6 space-y-4 shadow-2xl relative z-10 border border-indigo-500/25 bg-white/95 dark:bg-slate-900/95`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-150">Active Recall Review</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Topic: <span className="font-semibold text-slate-700 dark:text-slate-350">{activeRevision.topicId?.topic}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveRevision(null)}
                  className="text-xs text-slate-400 hover:text-slate-655 font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Recall Notes/Summary plain text area */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Write down your recall points or update notes:
                </p>
                <textarea
                  className="w-full rounded-2xl border border-slate-300/70 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/55 px-4 py-2 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40 text-xs sm:text-sm"
                  placeholder="Type your recall points or summary here to save..."
                  rows={3}
                  value={recallNotes}
                  onChange={(e) => setRecallNotes(e.target.value)}
                />
              </div>

              {/* Flashcard review Mode */}
              {flashcards.length > 0 ? (
                <div className="space-y-4">
                  {/* Card Indicator */}
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Flashcard Progress</span>
                    <span className="font-bold text-indigo-500">{cardIndex + 1} of {flashcards.length}</span>
                  </div>

                  {/* Glassmorphic Flip Card Container */}
                  <div className="relative min-h-[160px] bg-slate-100/75 dark:bg-slate-950/40 rounded-2xl border border-slate-200/70 dark:border-slate-800/50 p-5 flex flex-col justify-center items-center text-center shadow-inner">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold mb-2">
                      {showAnswer ? "Answer" : "Question"}
                    </p>
                    <AnimatePresence mode="wait">
                      {!showAnswer ? (
                        <motion.h4
                          key="question"
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          className="font-bold text-lg text-slate-800 dark:text-slate-100"
                        >
                          {currentCard.question}
                        </motion.h4>
                      ) : (
                        <motion.p
                          key="answer"
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          className="text-base text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line"
                        >
                          {currentCard.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Show Answer Toggle */}
                  {!showAnswer && (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className={`${buttonPrimary} w-full py-2 flex items-center justify-center gap-2`}
                    >
                      <Eye size={16} /> Show Answer
                    </button>
                  )}

                  {/* Ratings / Self-Assessment controls */}
                  {showAnswer && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">Rate your active recall quality:</p>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {RATINGS.map((rate) => (
                          <button
                            key={rate.value}
                            onClick={() => handleRateCard(rate.value)}
                            className={`${buttonSoft} py-2 px-1 text-center group relative flex flex-col items-center justify-center transition-all`}
                          >
                            <span className="text-lg font-bold group-hover:scale-110 transition-transform">{rate.value}</span>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{rate.label}</span>
                            <span className="absolute bottom-full mb-2 hidden group-hover:block w-36 bg-slate-850 dark:bg-slate-900 border border-slate-700 text-[10px] text-white p-2 rounded-xl text-center shadow-lg z-50 pointer-events-none">
                              {rate.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Self-Reflection Fallback Mode */
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100/70 dark:bg-slate-950/40 rounded-2xl border border-slate-200/70 dark:border-slate-800/40">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold mb-2">Study Guide</p>
                    <p className="text-sm text-slate-700 dark:text-slate-350 font-medium">
                      Recall and summarize the core principles of this topic.
                    </p>
                    {activeRevision.topicId?.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your logged notes:</p>
                        <p className="text-xs text-slate-655 dark:text-slate-400 mt-1 italic whitespace-pre-line">
                          {activeRevision.topicId.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">Rate your active recall quality:</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {RATINGS.map((rate) => (
                        <button
                          key={rate.value}
                          onClick={() => submitRevisionScore(rate.value)}
                          className={`${buttonSoft} py-2 px-1 text-center group relative flex flex-col items-center justify-center transition-all`}
                        >
                          <span className="text-lg font-bold group-hover:scale-110 transition-transform">{rate.value}</span>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{rate.label}</span>
                          <span className="absolute bottom-full mb-2 hidden group-hover:block w-36 bg-slate-850 dark:bg-slate-900 border border-slate-700 text-[10px] text-white p-2 rounded-xl text-center shadow-lg z-50 pointer-events-none">
                            {rate.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
