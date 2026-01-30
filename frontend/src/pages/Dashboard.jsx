import { useAuth } from "../context/AuthContext";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    // 🔒 Not logged in
    if (!user) {
      navigate("/auth/login");
      return;
    }

    // 🧭 Logged in but onboarding not done
    if (!user.profileCompleted) {
      setLoading(false);
      navigate("/onboarding");
      return;
    }

    // ✅ Fully allowed
    fetchDashboard();
  }, [user, loading]);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getData();
      setDashboard(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Failed to load dashboard</div>
        </div>
      </div>
    );
  }

  const stages = [
    { id: 1, name: "Building Profile", icon: "👤" },
    { id: 2, name: "Discovering Universities", icon: "🔍" },
    { id: 3, name: "Finalizing Universities", icon: "⭐" },
    { id: 4, name: "Preparing Applications", icon: "📝" },
  ];

  const getStageStatus = (stageId) => {
    if (stageId < dashboard.currentStage) return "completed";
    if (stageId === dashboard.currentStage) return "current";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome, {dashboard.user.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Profile Strength</h3>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary">
                {dashboard.profileStrength}%
              </div>
              <div className="ml-4 flex-1">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary rounded-full h-4 transition-all"
                    style={{ width: `${dashboard.profileStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">University Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Dream Universities:</span>
                <span className="font-semibold">
                  {dashboard.profileCounts.dream}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Universities:</span>
                <span className="font-semibold">
                  {dashboard.profileCounts.target}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Safe Universities:</span>
                <span className="font-semibold">
                  {dashboard.profileCounts.safe}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Locked University:</span>
                <span className="text-primary font-semibold">
                  {dashboard.lockedUniversity || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-6">Your Journey</h3>
          <div className="flex justify-between items-center">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 mb-2 transition-all ${
                      getStageStatus(stage.id) === "completed"
                        ? "bg-success text-white border-success"
                        : getStageStatus(stage.id) === "current"
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-200 text-gray-400 border-gray-300"
                    }`}
                  >
                    {stage.icon}
                  </div>
                  <p className="text-sm font-semibold text-center">
                    {stage.name}
                  </p>
                </div>
                {idx < stages.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      getStageStatus(stage.id + 1) !== "locked"
                        ? "bg-success"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Task Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Completed</span>
                <span className="font-semibold text-success">
                  {dashboard.completedTasks}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Tasks</span>
                <span className="font-semibold">{dashboard.totalTasks}</span>
              </div>
              <button
                onClick={() => navigate("/applications")}
                className="btn-primary w-full mt-4"
              >
                View All Tasks
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/counsellor")}
                className="btn-primary w-full"
              >
                Get AI Counseling
              </button>
              <button
                onClick={() => navigate("/universities")}
                className="btn-secondary w-full"
              >
                Explore Universities
              </button>
            </div>
          </div>
        </div>

        {dashboard.upcomingTasks && dashboard.upcomingTasks.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {dashboard.upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="border-l-4 border-primary pl-4 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm text-gray-600">
                        {task.taskType} • Priority: {task.priority}
                      </p>
                    </div>
                    {task.dueDate && (
                      <span className="text-sm text-gray-600">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
