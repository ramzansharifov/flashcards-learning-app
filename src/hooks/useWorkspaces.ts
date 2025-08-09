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
import { db } from "../firebase";
import { useUser } from "./useUser";

export type Workspace = { id: string; name: string; createdAt?: any };

export function useWorkspaces() {
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "users", user.uid, "workspaces"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      setWorkspaces(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          createdAt: d.data().createdAt,
        }))
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const addWorkspace = useCallback(
    async (name: string) => {
      if (!user || !name.trim()) return;
      const col = collection(db, "users", user.uid, "workspaces");
      const docRef = await addDoc(col, {
        name: name.trim(),
        createdAt: serverTimestamp(),
      });
      setWorkspaces((prev) => [...prev, { id: docRef.id, name: name.trim() }]);
    },
    [user]
  );

  const updateWorkspaceName = useCallback(
    async (workspaceId: string, name: string) => {
      if (!user || !workspaceId || !name.trim()) return;
      const ref = doc(db, "users", user.uid, "workspaces", workspaceId);
      await updateDoc(ref, { name: name.trim() });
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === workspaceId ? { ...w, name: name.trim() } : w
        )
      );
    },
    [user]
  );

  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      if (!user || !workspaceId) return;
      // простой вариант без каскада (если нужен каскад — скажи, добавим)
      await deleteDoc(doc(db, "users", user.uid, "workspaces", workspaceId));
      setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
    },
    [user]
  );

  return {
    workspaces,
    loading,
    error,
    refetch,
    addWorkspace,
    updateWorkspaceName,
    deleteWorkspace,
  };
}
