import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Trash2, BookOpen, Layers } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";
import { buttonPrimary, cardStyle, inputStyle, labelStyle, buttonSoft } from "../utils/styles";

function FlashcardManager({ flashcards, onChange }) {
  const addCard = () => {
    onChange([...flashcards, { question: "", answer: "" }]);
  };

  const removeCard = (index) => {
    onChange(flashcards.filter((_, i) => i !== index));
  };

  const updateCard = (index, field, value) => {
    const updated = flashcards.map((c, i) => {
      if (i === index) {
        return { ...c, [field]: value };
      }
      return c;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/80 pt-3 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Interactive Flashcards ({flashcards.length})
        </p>
        <button
          type="button"
          onClick={addCard}
          className={`${buttonSoft} px-2.5 py-1 text-xs flex items-center gap-1 font-semibold`}
        >
          <Plus size={12} /> Add Card
        </button>
      </div>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {flashcards.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">No flashcards added yet. Revisions will fall back to self-reflection mode.</p>
        ) : (
          flashcards.map((card, idx) => (
            <div key={idx} className="flex gap-2 items-start bg-slate-100/60 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200/65 dark:border-slate-800/40 relative">
              <span className="absolute left-2 top-2 text-[10px] font-bold text-slate-400">#{idx + 1}</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 pl-3">
                <input
                  className={`${inputStyle} !py-1 text-xs`}
                  placeholder="Question..."
                  value={card.question}
                  onChange={(e) => updateCard(idx, "question", e.target.value)}
                  required
                />
                <input
                  className={`${inputStyle} !py-1 text-xs`}
                  placeholder="Answer..."
                  value={card.answer}
                  onChange={(e) => updateCard(idx, "answer", e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeCard(idx)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:scale-105 transition-all mt-0.5"
                title="Remove flashcard"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StudiedItem({ item, onChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    topic: item.topic,
    subject: item.subject,
    notes: item.notes,
    confidence: item.confidence,
    duration: item.duration,
    flashcards: item.flashcards || [],
  });

  const save = async () => {
    await api.put(`/studied/${item._id}`, form);
    setEditing(false);
    onChange();
  };

  const nextRevisionDate = (item.revisionDates || [])
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()) && date.getTime() >= Date.now())
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <div className={`${cardStyle} hover:scale-[1.005] transition-all`}>
      {editing ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className={labelStyle}>Topic</p>
              <input className={inputStyle} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </div>
            <div className="space-y-1">
              <p className={labelStyle}>Subject</p>
              <input className={inputStyle} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className={labelStyle}>Notes</p>
              <textarea className={inputStyle} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className={labelStyle}>Confidence</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{form.confidence}/5</p>
              </div>
              <input
                className="w-full accent-indigo-600"
                type="range"
                min="1"
                max="5"
                step="1"
                value={form.confidence}
                onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className={labelStyle}>Duration</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{form.duration} min</p>
              </div>
              <input
                className={inputStyle}
                type="number"
                min="0"
                step="5"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              />
            </div>
          </div>

          <FlashcardManager
            flashcards={form.flashcards}
            onChange={(cards) => setForm({ ...form, flashcards: cards })}
          />

          <div className="pt-2 flex gap-2">
            <button className={`${buttonPrimary} px-4 py-1.5 text-xs`} onClick={save}>
              Save changes
            </button>
            <button className={`${buttonSoft} px-4 py-1.5 text-xs text-slate-500`} onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{item.topic}</p>
              <p className="text-sm text-slate-500 dark:text-slate-455">
                {item.subject} • Confidence {item.confidence}/5 • {item.duration} min
              </p>
            </div>
            {item.flashcards?.length > 0 && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Layers size={10} />
                {item.flashcards.length} cards
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 mt-1.5">
            Next dynamic review:{" "}
            {nextRevisionDate ? nextRevisionDate.toLocaleDateString() : "No upcoming review"}
          </p>
          {item.notes && <p className="text-sm mt-2 opacity-80 pl-2 border-l-2 border-slate-300 dark:border-slate-700 italic">{item.notes}</p>}
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1 text-xs rounded bg-indigo-600 text-white" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="px-3 py-1 text-xs rounded bg-rose-600 text-white"
              onClick={async () => {
                await api.delete(`/studied/${item._id}`);
                onChange();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function StudiedPage() {
  const location = useLocation();
  const [form, setForm] = useState({ topic: "", subject: "", notes: "", confidence: 3, duration: 60, flashcards: [] });
  const { data, refetch } = useFetch("/studied");

  // Autofill duration from Pomodoro focus timer redirect
  useEffect(() => {
    if (location.state?.autofillDuration) {
      setForm((f) => ({ ...f, duration: location.state.autofillDuration }));
    }
  }, [location.state]);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/studied", form);
    setForm({ topic: "", subject: "", notes: "", confidence: 3, duration: 60, flashcards: [] });
    refetch();
  };

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Studied Topics</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Log studied topics to start generating active recall reminders. Add flashcards optionally.
        </p>
      </div>

      <form onSubmit={add} className={`${cardStyle} space-y-4`}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className={labelStyle}>Topic</p>
            <input
              className={inputStyle}
              placeholder="e.g. Binary Search Trees"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <p className={labelStyle}>Subject</p>
            <input
              className={inputStyle}
              placeholder="e.g. Computer Science"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className={labelStyle}>Notes</p>
            <textarea
              className={inputStyle}
              placeholder="Key concepts or summaries..."
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className={labelStyle}>Confidence level</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{form.confidence}/5</p>
            </div>
            <input
              className="w-full accent-indigo-600"
              type="range"
              min="1"
              max="5"
              step="1"
              value={form.confidence}
              onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className={labelStyle}>Duration (minutes)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{form.duration} min</p>
            </div>
            <input
              className={inputStyle}
              type="number"
              min="0"
              step="5"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </div>
        </div>

        <FlashcardManager
          flashcards={form.flashcards}
          onChange={(cards) => setForm({ ...form, flashcards: cards })}
        />

        <button className={`${buttonPrimary} py-2.5 w-full flex items-center justify-center gap-2`} disabled={!form.topic.trim()}>
          <Plus size={16} /> Log studied topic
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <BookOpen className="text-indigo-500" size={18} />
          Logs history ({data.length})
        </h3>
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className={`${cardStyle} p-8 text-center`}>
              <p className="font-semibold">No studied topics yet</p>
              <p className="text-sm text-slate-655 mt-1">
                Log a completed topic above to start active recall dynamic scheduling.
              </p>
            </div>
          ) : (
            data.map((topic) => <StudiedItem key={topic._id} item={topic} onChange={refetch} />)
          )}
        </div>
      </div>
    </AppLayout>
  );
}
