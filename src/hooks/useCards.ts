import { useCallback, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./useUser";
import type { Card } from "../types/models";

export function useCards(workspaceId: string | null, topicId: string | null) {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user || !workspaceId || !topicId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(
          db,
          "users",
          user.uid,
          "workspaces",
          workspaceId,
          "topics",
          topicId,
          "cards"
        ),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      setCards(
        snap.docs.map((d) => ({
          id: d.id,
          front: d.data().front,
          back: d.data().back,
          createdAt: d.data().createdAt,
        }))
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [user, workspaceId, topicId]);

  useEffect(() => {
    setCards([]); // reset on selection change
    void refetch();
  }, [refetch]);

  const addCard = useCallback(
    async (front: string, back: string) => {
      if (!user || !workspaceId || !topicId || !front.trim() || !back.trim())
        return;
      const col = collection(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId,
        "cards"
      );
      const docRef = await addDoc(col, {
        front: front.trim(),
        back: back.trim(),
        createdAt: serverTimestamp(),
      });
      setCards((prev) => [
        ...prev,
        { id: docRef.id, front: front.trim(), back: back.trim() },
      ]);
    },
    [user, workspaceId, topicId]
  );

  return { cards, loading, error, addCard, refetch };
}
