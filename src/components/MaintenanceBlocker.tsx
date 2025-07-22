"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/lib/hooks/useAuth";

export default function MaintenanceBlocker({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: user, isLoading: userLoading } = useUser();

  useEffect(() => {
    // Only check maintenance status if user is logged in
    if (userLoading) {
      return; // Wait for user loading to complete
    }

    if (!user) {
      // User is not logged in, allow access to login/auth pages
      setLoading(false);
      return;
    }

    // User is logged in, check maintenance status
    api.get("/settings/maintenance-status")
      .then(res => {
        console.log("[MaintenanceBlocker] maintenance-status response:", res.data);
        setMaintenance(res.data.maintenanceMode);
        setMessage(res.data.maintenanceMessage);
        setLoading(false);
      })
      .catch((err) => {
        console.log("[MaintenanceBlocker] error:", err);
        setMaintenance(false);
        setLoading(false);
      });
  }, [user, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, show normal content (login/auth pages)
  if (!user) {
    return <>{children}</>;
  }

  // If user is logged in and maintenance is active, check if they're admin
  if (maintenance && user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Maintenance Mode</h1>
          <p className="text-gray-700">{message || "The website is currently under maintenance. Please check back later."}</p>
        </div>
      </div>
    );
  }

  // User is logged in and either maintenance is off or user is admin
  return <>{children}</>;
} 