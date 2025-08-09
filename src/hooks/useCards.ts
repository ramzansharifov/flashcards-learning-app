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
  deleteDoc,
  increment,
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
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            front: data.front,
            back: data.back,
            createdAt: data.createdAt,
            lastResult: data.lastResult ?? undefined, // null -> undefined
            seenCount: data.seenCount ?? 0,
            knownCount: data.knownCount ?? 0,
            lastAnsweredAt: data.lastAnsweredAt ?? undefined,
          };
        })
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [user, workspaceId, topicId]);

  useEffect(() => {
    setCards([]);
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

      // Не пишем lastResult/lastAnsweredAt вообще
      const docRef = await addDoc(col, {
        front: front.trim(),
        back: back.trim(),
        createdAt: serverTimestamp(),
        seenCount: 0,
        knownCount: 0,
      });

      setCards((prev) => [
        ...prev,
        {
          id: docRef.id, // <-- важно: id, НЕ _id
          front: front.trim(),
          back: back.trim(),
          seenCount: 0,
          knownCount: 0,
        },
      ]);
    },
    [user, workspaceId, topicId]
  );

  const updateCard = useCallback(
    async (cardId: string, updates: Partial<Pick<Card, "front" | "back">>) => {
      if (!user || !workspaceId || !topicId || !cardId) return;
      const cRef = doc(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId,
        "cards",
        cardId
      );
      const payload: any = {};
      if (typeof updates.front === "string")
        payload.front = updates.front.trim();
      if (typeof updates.back === "string") payload.back = updates.back.trim();
      if (Object.keys(payload).length === 0) return;
      await updateDoc(cRef, payload);
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...payload } : c))
      );
    },
    [user, workspaceId, topicId]
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      if (!user || !workspaceId || !topicId || !cardId) return;
      await deleteDoc(
        doc(
          db,
          "users",
          user.uid,
          "workspaces",
          workspaceId,
          "topics",
          topicId,
          "cards",
          cardId
        )
      );
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    },
    [user, workspaceId, topicId]
  );

  const setCardResult = useCallback(
    async (cardId: string, result: "know" | "dontKnow") => {
      if (!user || !workspaceId || !topicId || !cardId) return;
      const cRef = doc(
        db,
        "users",
        user.uid,
        "workspaces",
        workspaceId,
        "topics",
        topicId,
        "cards",
        cardId
      );
      await updateDoc(cRef, {
        lastResult: result,
        lastAnsweredAt: serverTimestamp(),
        seenCount: increment(1),
        knownCount: result === "know" ? increment(1) : increment(0),
      });
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                lastResult: result,
                seenCount: (c.seenCount ?? 0) + 1,
                knownCount: (c.knownCount ?? 0) + (result === "know" ? 1 : 0),
              }
            : c
        )
      );
    },
    [user, workspaceId, topicId]
  );

  return {
    cards,
    loading,
    error,
    refetch,
    addCard,
    updateCard,
    deleteCard,
    setCardResult,
  };
}
