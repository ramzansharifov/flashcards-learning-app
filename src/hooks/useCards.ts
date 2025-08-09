import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./useUser";
import { notify } from "../lib/notify";

export type Card = {
  id: string;
  front: string;
  back: string;
  createdAt?: any;
  lastResult?: "know" | "dontKnow";
  seenCount?: number;
  knownCount?: number;
  lastAnsweredAt?: any;
};

export function useCards(workspaceId: string | null, topicId: string | null) {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !workspaceId || !topicId) {
      setCards([]);
      return;
    }
    setLoading(true);
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
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCards(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              front: data.front,
              back: data.back,
              createdAt: data.createdAt,
              lastResult: data.lastResult ?? undefined,
              seenCount: data.seenCount ?? 0,
              knownCount: data.knownCount ?? 0,
              lastAnsweredAt: data.lastAnsweredAt ?? undefined,
            };
          })
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        notify.err(err.message);
      }
    );
    return () => unsub();
  }, [user, workspaceId, topicId]);

  const addCard = useCallback(
    async (front: string, back: string) => {
      try {
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
        await addDoc(col, {
          front: front.trim(),
          back: back.trim(),
          createdAt: serverTimestamp(),
          seenCount: 0,
          knownCount: 0,
        });
        // counters
        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "workspaces",
            workspaceId,
            "topics",
            topicId
          ),
          { cardsCount: increment(1) }
        );
        await updateDoc(doc(db, "users", user.uid, "workspaces", workspaceId), {
          cardsCount: increment(1),
        });
        notify.ok("Card created");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId, topicId]
  );

  const addCardsBulk = useCallback(
    async (items: { front: string; back: string }[]) => {
      try {
        if (!user || !workspaceId || !topicId) return;
        const filtered = items
          .map((i) => ({
            front: i.front?.trim() ?? "",
            back: i.back?.trim() ?? "",
          }))
          .filter((i) => i.front && i.back);
        if (!filtered.length) return;

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
        let batch = writeBatch(db);
        let n = 0;
        for (const it of filtered) {
          const ref = doc(col);
          batch.set(ref, {
            front: it.front,
            back: it.back,
            createdAt: serverTimestamp(),
            seenCount: 0,
            knownCount: 0,
          });
          n++;
          if (n % 450 === 0) {
            await batch.commit();
            batch = writeBatch(db);
          }
        }
        await batch.commit();
        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "workspaces",
            workspaceId,
            "topics",
            topicId
          ),
          { cardsCount: increment(filtered.length) }
        );
        await updateDoc(doc(db, "users", user.uid, "workspaces", workspaceId), {
          cardsCount: increment(filtered.length),
        });
        notify.ok(`Imported ${filtered.length} cards`);
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId, topicId]
  );

  const updateCard = useCallback(
    async (cardId: string, updates: { front?: string; back?: string }) => {
      try {
        if (!user || !workspaceId || !topicId || !cardId) return;
        const payload: any = {};
        if (typeof updates.front === "string")
          payload.front = updates.front.trim();
        if (typeof updates.back === "string")
          payload.back = updates.back.trim();
        if (!Object.keys(payload).length) return;
        await updateDoc(
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
          ),
          payload
        );
        notify.ok("Card updated");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId, topicId]
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      try {
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
        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "workspaces",
            workspaceId,
            "topics",
            topicId
          ),
          { cardsCount: increment(-1) }
        );
        await updateDoc(doc(db, "users", user.uid, "workspaces", workspaceId), {
          cardsCount: increment(-1),
        });
        notify.ok("Card deleted");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId, topicId]
  );

  const setCardResult = useCallback(
    async (cardId: string, result: "know" | "dontKnow") => {
      try {
        if (!user || !workspaceId || !topicId || !cardId) return;
        const prev = cards.find((c) => c.id === cardId)?.lastResult;
        const deltaKnown =
          (prev === "know" ? -1 : 0) + (result === "know" ? 1 : 0); // -1/0/+1

        await updateDoc(
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
          ),
          {
            lastResult: result,
            lastAnsweredAt: serverTimestamp(),
            seenCount: increment(1),
            knownCount: result === "know" ? increment(1) : increment(0),
          }
        );

        if (deltaKnown !== 0) {
          await updateDoc(
            doc(
              db,
              "users",
              user.uid,
              "workspaces",
              workspaceId,
              "topics",
              topicId
            ),
            {
              knownCount: increment(deltaKnown),
            }
          );
        }
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId, topicId, cards]
  );

  return {
    cards,
    loading,
    error,
    addCard,
    addCardsBulk,
    updateCard,
    deleteCard,
    setCardResult,
  };
}
