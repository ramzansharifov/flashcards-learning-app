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
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./useUser";
import { notify } from "../lib/notify";

export type Topic = {
  id: string;
  name: string;
  createdAt?: any;
  progress?: number;
  lastTrained?: any;
  cardsCount?: number;
  knownCount?: number;
};

export function useTopics(workspaceId: string | null) {
  const { user } = useUser();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !workspaceId) {
      setTopics([]);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "users", user.uid, "workspaces", workspaceId, "topics"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTopics(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              createdAt: data.createdAt,
              progress: data.progress ?? 0,
              lastTrained: data.lastTrained,
              cardsCount: data.cardsCount ?? 0,
              knownCount: data.knownCount ?? 0,
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
  }, [user, workspaceId]);

  const addTopic = useCallback(
    async (name: string) => {
      try {
        if (!user || !workspaceId || !name.trim()) return;
        const tRef = await addDoc(
          collection(
            db,
            "users",
            user.uid,
            "workspaces",
            workspaceId,
            "topics"
          ),
          {
            name: name.trim(),
            createdAt: serverTimestamp(),
            progress: 0,
            cardsCount: 0,
            knownCount: 0,
          }
        );
        await updateDoc(doc(db, "users", user.uid, "workspaces", workspaceId), {
          topicsCount: increment(1),
        });
        notify.ok("Topic created");
        return tRef.id;
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId]
  );

  const updateTopicName = useCallback(
    async (topicId: string, name: string) => {
      try {
        if (!user || !workspaceId || !topicId || !name.trim()) return;
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
          { name: name.trim() }
        );
        notify.ok("Topic updated");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId]
  );

  const deleteTopic = useCallback(
    async (topicId: string) => {
      try {
        if (!user || !workspaceId || !topicId) return;
        const wRef = doc(db, "users", user.uid, "workspaces", workspaceId);
        const tRef = doc(
          db,
          "users",
          user.uid,
          "workspaces",
          workspaceId,
          "topics",
          topicId
        );
        const tSnap = await getDoc(tRef);
        const cardsCount = (
          tSnap.exists() ? tSnap.data().cardsCount ?? 0 : 0
        ) as number;

        // удалить все cards под темой
        const cardsCol = collection(
          db,
          "users",
          user.uid,
          "workspaces",
          workspaceId,
          "topics",
          topicId,
          "cards"
        );
        const cardsSnap = await getDocs(cardsCol);
        // батчами по 450
        let batch = writeBatch(db);
        let nInBatch = 0;
        for (const c of cardsSnap.docs) {
          batch.delete(c.ref);
          nInBatch++;
          if (nInBatch >= 450) {
            await batch.commit();
            batch = writeBatch(db);
            nInBatch = 0;
          }
        }
        if (nInBatch > 0) await batch.commit();

        // обновить счётчики воркспейса и удалить тему
        await updateDoc(wRef, {
          topicsCount: increment(-1),
          cardsCount: increment(-cardsCount),
        });
        await deleteDoc(tRef);
        notify.ok("Topic deleted");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId]
  );

  const updateTopicProgress = useCallback(
    async (topicId: string, percent: number) => {
      try {
        if (!user || !workspaceId || !topicId) return;
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
            progress: percent,
            lastTrained: serverTimestamp(),
          }
        );
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user, workspaceId]
  );

  return {
    topics,
    loading,
    error,
    addTopic,
    updateTopicName,
    deleteTopic,
    updateTopicProgress,
  };
}
