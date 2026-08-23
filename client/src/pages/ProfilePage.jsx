import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";
import { buttonPrimary, cardStyle, inputStyle, labelStyle } from "../utils/styles";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { data: analytics } = useFetch("/analytics", {});
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "" });

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/auth/me", form);
    setUser(data);
  };

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage your account details and track your long-term learning stats.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <form onSubmit={save} className={`${cardStyle} space-y-3 p-5`}>
          <h2 className="text-xl font-bold">Profile</h2>
          <div className="space-y-1">
            <p className={labelStyle}>Username</p>
            <input className={inputStyle} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="space-y-1">
            <p className={labelStyle}>Email</p>
            <input className={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <button className={`${buttonPrimary} px-4 py-2`}>Update Profile</button>
        </form>
        <div className={`${cardStyle} p-5`}>
          <h3 className="text-lg font-semibold mb-2">Study Statistics</h3>
          <div className="space-y-1 text-sm">
            <p>Total topics studied: {analytics.totalTopicsStudied || 0}</p>
            <p>Total study hours: {Math.round((analytics.totalStudyMinutes || 0) / 60)}</p>
            <p>Completed revisions: {analytics.completedRevisions || 0}</p>
            <p>Revision completion: {analytics.revisionCompletionRate || 0}%</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
