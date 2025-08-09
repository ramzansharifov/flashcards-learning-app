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
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./useUser";
import { notify } from "../lib/notify";
import { deleteCollectionInBatches, subcol } from "../lib/firestoreUtils";

export type Workspace = {
  id: string;
  name: string;
  createdAt?: any;
  topicsCount?: number;
  cardsCount?: number;
};

export function useWorkspaces() {
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWorkspaces([]);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "users", user.uid, "workspaces"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setWorkspaces(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              createdAt: data.createdAt,
              topicsCount: data.topicsCount ?? 0,
              cardsCount: data.cardsCount ?? 0,
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
  }, [user]);

  const addWorkspace = useCallback(
    async (name: string) => {
      try {
        if (!user || !name.trim()) return;
        await addDoc(collection(db, "users", user.uid, "workspaces"), {
          name: name.trim(),
          createdAt: serverTimestamp(),
          topicsCount: 0,
          cardsCount: 0,
        });
        notify.ok("Workspace created");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user]
  );

  const updateWorkspaceName = useCallback(
    async (workspaceId: string, name: string) => {
      try {
        if (!user || !workspaceId || !name.trim()) return;
        await updateDoc(doc(db, "users", user.uid, "workspaces", workspaceId), {
          name: name.trim(),
        });
        notify.ok("Workspace updated");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user]
  );

  // КАСКАДНОЕ УДАЛЕНИЕ WORKSPACE → все topics → их cards + sessions → затем сам workspace
  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      try {
        if (!user || !workspaceId) return;
        const wsRef = doc(db, "users", user.uid, "workspaces", workspaceId);
        const topicsCol = collection(wsRef, "topics");
        const topicsSnap = await getDocs(topicsCol);

        for (const t of topicsSnap.docs) {
          const topicRef = t.ref;
          // удаляем все карточки и сессии (если есть)
          await deleteCollectionInBatches(subcol(topicRef, "cards"));
          await deleteCollectionInBatches(subcol(topicRef, "sessions")); // если подколлекция не используется — просто ничего не найдёт
          // удаляем сам документ темы
          await deleteDoc(topicRef);
        }

        // удаляем сам workspace
        await deleteDoc(wsRef);
        notify.ok("Workspace and all nested data deleted");
      } catch (e: any) {
        notify.err(e.message);
      }
    },
    [user]
  );

  return {
    workspaces,
    loading,
    error,
    addWorkspace,
    updateWorkspaceName,
    deleteWorkspace,
  };
}
