import { Bell, Brain, Moon, Sun, Flame } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { cardStyle } from "../utils/styles";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const links = [
    { path: "dashboard", label: "Dashboard" },
    { path: "todos", label: "To-Do" },
    { path: "studied", label: "Studied" },
    { path: "revisions", label: "Revisions" },
    { path: "analytics", label: "Analytics" },
    { path: "profile", label: "Profile" },
  ];

  const fetchNotifications = async () => {
    const { data } = await api.get("/revisions");
    const due = data.filter((r) => r.status === "due");
    setNotifications(
      due.map((item) => ({
        id: item._id,
        text: `${item.topicId?.topic || "Topic"} is ${item.overdue ? "overdue" : "due today"}`,
      }))
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const unread = notifications.length;
  const bellLabel = useMemo(() => (unread > 0 ? `${unread} reminders` : "No reminders"), [unread]);

  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      notifications.slice(0, 2).forEach((n) => new Notification("ReviseMate Reminder", { body: n.text }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="glow-orb h-56 w-56 bg-indigo-500/70 top-10 left-8" />
      <div className="glow-orb h-72 w-72 bg-fuchsia-500/60 top-40 right-10" />
      <div className="glow-orb h-64 w-64 bg-cyan-400/60 bottom-10 left-1/3" />

      <div className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
        <div className={`${cardStyle} mb-5 flex flex-wrap gap-3 items-center justify-between relative sticky top-4 z-20`}>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white grid place-items-center shadow-lg shadow-violet-500/30">
              <Brain size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">ReviseMate</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart study + spaced revision</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-violet-500/25"
                      : "bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`
                }
                to={`/${link.path}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {user && user.currentStreak > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-sm animate-pulse"
                title={`You have a ${user.currentStreak}-day study streak!`}
              >
                <Flame size={16} className="fill-orange-500 text-orange-500 animate-bounce" />
                <span>{user.currentStreak}d streak</span>
              </div>
            )}
            <button onClick={() => setDark((value) => !value)} className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:scale-105 transition-transform" title="Toggle dark mode">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => {
                setShowNotifs((value) => !value);
                requestBrowserPermission();
              }}
              className="relative p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:scale-105 transition-transform"
              title={bellLabel}
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-rose-600 text-white text-[10px] px-1">
                  {unread}
                </span>
              )}
            </button>
            <button onClick={logout} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors">
              Logout
            </button>
          </div>
          {showNotifs && (
            <div className="absolute right-2 top-14 w-80 max-h-72 overflow-y-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-lg z-50">
              {notifications.length === 0 ? (
                <p className="text-sm p-2">No pending reminders.</p>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
                    {item.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
