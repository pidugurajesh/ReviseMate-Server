import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";
import { buttonPrimary, cardStyle, inputStyle, labelStyle } from "../utils/styles";

function TodoItem({ todo, onChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: todo.title,
    subject: todo.subject,
    priority: todo.priority,
  });

  const save = async () => {
    await api.put(`/todos/${todo._id}`, form);
    setEditing(false);
    onChange();
  };

  return (
    <div className={`${cardStyle} flex justify-between items-center gap-2`}>
      {editing ? (
        <div className="flex-1 grid md:grid-cols-3 gap-2">
          <input className={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputStyle} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <select className={inputStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      ) : (
        <div>
          <p className={`font-semibold ${todo.completed ? "line-through opacity-60" : ""}`}>{todo.title}</p>
          <p className="text-sm">
            {todo.subject} • {todo.priority}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        {editing ? (
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={save}>
            Save
          </button>
        ) : (
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        <button
          className="px-3 py-1 rounded bg-emerald-600 text-white"
          onClick={async () => {
            await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
            onChange();
          }}
        >
          Toggle
        </button>
        <button
          className="px-3 py-1 rounded bg-rose-600 text-white"
          onClick={async () => {
            await api.delete(`/todos/${todo._id}`);
            onChange();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TodosPage() {
  const [form, setForm] = useState({ title: "", subject: "", priority: "Medium" });
  const [q, setQ] = useState("");
  const { data, refetch } = useFetch(`/todos?q=${encodeURIComponent(q)}`);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/todos", form);
    setForm({ title: "", subject: "", priority: "Medium" });
    refetch();
  };

  return (
    <AppLayout>
      <div className="mb-3">
        <h1 className="text-2xl font-bold">To-Do</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Plan what you’ll study — separate from what you’ve already studied.
        </p>
      </div>

      <form onSubmit={add} className={`${cardStyle} grid md:grid-cols-4 gap-3`}>
        <div className="space-y-1 md:col-span-2">
          <p className={labelStyle}>Title</p>
          <input
            className={inputStyle}
            placeholder="e.g. Learn React Hooks"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <p className={labelStyle}>Subject</p>
          <input className={inputStyle} placeholder="e.g. Web Dev" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div className="space-y-1">
          <p className={labelStyle}>Priority</p>
          <select className={inputStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <button className={`${buttonPrimary} md:col-span-4 py-2`} disabled={!form.title.trim()}>
          Add todo
        </button>
      </form>

      <div className="mt-3 space-y-1">
        <p className={labelStyle}>Search</p>
        <input className={inputStyle} placeholder="Search todos..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="space-y-2">
        {data.length === 0 ? (
          <div className={`${cardStyle} p-8 text-center`}>
            <p className="font-semibold">No to-dos found</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Create a study task and keep your plan organized.
            </p>
          </div>
        ) : (
          data.map((todo) => <TodoItem key={todo._id} todo={todo} onChange={refetch} />)
        )}
      </div>
    </AppLayout>
  );
}
