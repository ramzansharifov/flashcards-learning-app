import { useCallback, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./useUser";
import type { Topic } from "../types/models";

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
    setTopics([]); // reset on workspace change
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

  const updateTopicProgress = useCallback(
    async (topicId: string, percent: number) => {
      if (!user || !workspaceId) return;
      const topicRef = doc(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId
      );
      await updateDoc(topicRef, {
        progress: percent,
        lastTrained: serverTimestamp(),
      });
      // optimistic update
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, progress: percent } : t))
      );
    },
    [user, workspaceId]
  );

  return { topics, loading, error, addTopic, updateTopicProgress, refetch };
}
