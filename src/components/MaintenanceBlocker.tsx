"use client";
import { useEffect, useState } from "react";

export default function MaintenanceBlocker({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch maintenance status
    fetch("/api/settings/maintenance-status")
      .then(res => res.json())
      .then(data => {
        console.log("[MaintenanceBlocker] maintenance-status response:", data);
        setMaintenance(data.maintenanceMode);
        setMessage(data.maintenanceMessage);
        // Fetch user profile (must be authenticated)
        return fetch("/api/users/profile").then(res => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        });
      })
      .then(user => {
        console.log("[MaintenanceBlocker] user profile response:", user);
        setIsAdmin(user?.role === "admin");
        setLoading(false);
      })
      .catch((err) => {
        console.log("[MaintenanceBlocker] error:", err);
        setIsAdmin(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-600">Checking maintenance status...</span>
        </div>
      </div>
    );
  }

  if (maintenance && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Maintenance Mode</h1>
          <p className="text-gray-700">{message || "The website is currently under maintenance. Please check back later."}</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
} 