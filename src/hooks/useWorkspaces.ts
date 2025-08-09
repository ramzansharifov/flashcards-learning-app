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
import type { Workspace } from "../types/models";

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
      // optimistic update
      setWorkspaces((prev) => [...prev, { id: docRef.id, name: name.trim() }]);
    },
    [user]
  );

  return { workspaces, loading, error, addWorkspace, refetch };
}
