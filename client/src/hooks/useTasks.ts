import { useState, useEffect } from "react";
import type { Task, UserScore } from "../types/task";

const API_URL = "http://localhost:3001";

export const useTasks = (sessionToken: string | null, walletAddress: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
    }
  };

  const fetchUserScore = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch(`${API_URL}/tasks/user/score`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch score");
      const data = await res.json();
      setUserScore(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch score");
    }
  };

  const verifyTask = async (taskId: string) => {
    if (!sessionToken || !walletAddress) {
      setError("Please connect wallet");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Verification failed");
      }

      await res.json();
      await fetchUserScore();
      await fetchTasks();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (sessionToken) {
      fetchUserScore();
    }
  }, [sessionToken]);

  return {
    tasks,
    userScore,
    loading,
    error,
    verifyTask,
    refetch: () => {
      fetchTasks();
      fetchUserScore();
    },
  };
};
