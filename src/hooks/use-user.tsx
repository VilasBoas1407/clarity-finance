import { useCallback, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  const loadOrCreateUser = useCallback(async (firebaseUser) => {
    try {
      const uid = firebaseUser.uid;
      const userRef = doc(db, "users", uid);

      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        const newUser = {
          uid,
          name: firebaseUser.displayName || "Usuario Sem Nome",
          email: firebaseUser.email || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          picture: firebaseUser.photoURL || "",
        };

        await setDoc(userRef, newUser);
        const createdSnapshot = await getDoc(userRef);
        setUser(createdSnapshot.data() as User);
        return;
      }

      const rawUser = snapshot.data() as User;
      setUser(rawUser);
    } catch (error) {
      console.error("Erro ao carregar/criar usuario:", error);
      throw error;
    }
  }, []);

  return {
    user,
    loadOrCreateUser,
    setUser,
  };
}
