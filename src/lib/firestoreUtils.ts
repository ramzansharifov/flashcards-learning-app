import {
  collection,
  getDocs,
  writeBatch,
  type CollectionReference,
} from "firebase/firestore";
import { db } from "../firebase";

// Удаляет ВСЕ документы в коллекции пачками (по умолчанию ~450 операций за батч)
export async function deleteCollectionInBatches(
  colRef: CollectionReference,
  batchSize = 450
) {
  const snap = await getDocs(colRef);
  if (snap.empty) return 0;

  let batch = writeBatch(db);
  let ops = 0;
  let deleted = 0;

  for (const d of snap.docs) {
    batch.delete(d.ref);
    ops++;
    deleted++;
    if (ops >= batchSize) {
      await batch.commit();
      batch = writeBatch(db);
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();
  return deleted;
}

// Хелпер, если нужен ref подколлекции от docRef и имени
export const subcol = (docRef: any, name: string) => collection(docRef, name);
