import { useState, useEffect } from "react";

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
//   const token = localStorage.getItem("authToken");

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      {user && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Email:{user.email}</p>
        </div>
      )}
    </div>
  );
}
