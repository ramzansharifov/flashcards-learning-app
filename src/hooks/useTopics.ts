import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // проверь путь
import { useUser } from "./useUser";

export type Topic = {
  id: string;
  name: string;
  createdAt?: any;
  progress?: number;
  lastTrained?: any;
};

export function useTopics(workspaceId: string | null) {
  const { user } = useUser();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user || !workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "users", user.uid, "workspaces", workspaceId, "topics"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      setTopics(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          createdAt: d.data().createdAt,
          progress: d.data().progress ?? 0,
          lastTrained: d.data().lastTrained,
        }))
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load topics");
    } finally {
      setLoading(false);
    }
  }, [user, workspaceId]);

  useEffect(() => {
    setTopics([]);
    void refetch();
  }, [refetch]);

  const addTopic = useCallback(
    async (name: string) => {
      if (!user || !workspaceId || !name.trim()) return;
      const col = collection(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics"
      );
      const docRef = await addDoc(col, {
        name: name.trim(),
        createdAt: serverTimestamp(),
      });
      setTopics((prev) => [...prev, { id: docRef.id, name: name.trim() }]);
    },
    [user, workspaceId]
  );

  const updateTopicName = useCallback(
    async (topicId: string, name: string) => {
      if (!user || !workspaceId || !topicId || !name.trim()) return;
      const ref = doc(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId
      );
      await updateDoc(ref, { name: name.trim() });
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, name: name.trim() } : t))
      );
    },
    [user, workspaceId]
  );

  const deleteTopic = useCallback(
    async (topicId: string) => {
      if (!user || !workspaceId || !topicId) return;
      await deleteDoc(
        doc(db, "users", user.uid, "workspaces", workspaceId, "topics", topicId)
      );
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
    },
    [user, workspaceId]
  );

  const updateTopicProgress = useCallback(
    async (topicId: string, percent: number) => {
      if (!user || !workspaceId || !topicId) return;
      const ref = doc(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId
      );
      await updateDoc(ref, {
        progress: percent,
        lastTrained: serverTimestamp(),
      });
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, progress: percent } : t))
      );
    },
    [user, workspaceId]
  );

  return {
    topics,
    loading,
    error,
    refetch,
    addTopic,
    updateTopicName,
    deleteTopic,
    updateTopicProgress,
  };
}
