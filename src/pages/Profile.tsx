import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../store/auth";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/users/me/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // atualiza contexto
      setUser(res.data.user);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <img
        className="w-24 h-24 rounded-full object-cover border"
        src={user?.photoUrl || "https://placehold.co/96x96?text=User"}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        onClick={handleUpload}
        disabled={!file || busy}
      >
        {busy ? "Enviando..." : "Salvar foto"}
      </button>
    </div>
  );
}
