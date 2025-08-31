import { useState, useEffect, useContext } from "react";
import axios from "axios";

import logo from "/assets/logo.png"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface User {
  name: string;
  email: string;
}

interface Note {
  _id: string;
  text: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [createNote, setCreateNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  const navigate = useNavigate();
  const { logout, token } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:4000/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const res = await axios.post("http://localhost:4000/api/notes", { text: newNote }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes([...notes, res.data]);
    setNewNote("");
  };

  const deleteNote = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(notes.filter(n => n._id !== id));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (token) {
      fetchNotes();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-white">
        <div className="w-full flex items-center justify-center px-10 py-1 mb-5">
            {/* Logo */}
            <div>
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain"/>
            </div>
            {/* Page Title */}
            <div className="w-full text-2xl font-semibold px-3">
                Dashboard
            </div>
            {/* Logout */}
            <div>
                <button className="text-xl text-primary underline text-nowrap cursor-pointer" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
      {user && (
        <div className="w-full md:w-4xl mb-6 p-5 bg-white shadow-xl border border-gray-400 rounded-xl">
          <h1 className="text-6xl font-bold mb-3">Welcome, {user.name}!</h1>
          <p className="text-2xl text-gray-600">Email: {user.email}</p>
        </div>
      )}

        <div className="w-full md:w-3xl mt-4">
            {!createNote && (
                <button onClick={()=> setCreateNote(true)} className="w-full bg-blue-500 text-white text-center px-4 py-2 mb-6 rounded-lg cursor-pointer">
                    Create Note
                </button>              
            )}
            {createNote && (
                <div className="flex gap-2 mb-6">
                    <input
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note..."
                        className="flex-1 border p-2 rounded"
                    />
                    <button onClick={addNote} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                        Add
                    </button>
                </div>
            )}

            
            <ul className="space-y-3">
                {notes.length > 0 ? (
                    <>
                        <h2 className="text-3xl mb-2">Notes: </h2>
                        {notes.map((note) => (
                            <li key={note._id} className="flex justify-between items-center bg-white p-3 border border-gray-400 rounded-lg shadow">
                            <span>{note.text}</span>
                            <button
                                onClick={() => deleteNote(note._id)}
                                className="text-red-500 font-bold cursor-pointer"
                            >
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            </li>
                        ))}
                    </>
                    
                ) :
                    <>
                        <p className="text-xl text-center mt-10">You don’t have any notes yet..</p>
                        <p className="text-2xl text-center">Start Creating your notes by clicking on "Create Note"!</p>
                    </>
                }
                
            </ul>
        </div>
    </div>
  );
}
