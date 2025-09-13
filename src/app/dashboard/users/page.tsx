"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSuccessPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus user ini?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return alert("Terjadi kesalahan server");
      }
      showSuccessPopup("User berhasil dihapus!");
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus user");
    }
  };

  // Buka modal edit
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setShowEditModal(true);
  };

  // Simpan perubahan dari modal
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    if (!editName || !editEmail) return alert("Nama dan email tidak boleh kosong");

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return alert("Terjadi kesalahan server");
      }

      setUsers(
        users.map(u =>
          u.id === editingUser.id ? { ...u, name: editName, email: editEmail } : u
        )
      );
      setShowEditModal(false);
      showSuccessPopup("User berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update user");
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat data user...</p>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Dashboard Users</h1>

      {/* Popup sukses */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 w-96">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-bold text-green-700 text-center">{popupMessage}</h2>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEditModal(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <PencilSquareIcon className="h-6 w-6 mr-2" /> Edit User
            </h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => openEditModal(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(user.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-center mt-4 text-gray-500">Belum ada user terdaftar.</p>
      )}
    </div>
  );
}
