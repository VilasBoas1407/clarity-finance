import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { User } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  const loadOrCreateUser = async (firebaseUser) => {
    try {
      const uid = firebaseUser.uid;
      const userRef = doc(db, "users", uid);

      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        const newUser = {
          uid,
          name: firebaseUser.displayName || "Usuário Sem Nome",
          email: firebaseUser.email || "",
          createdAt: new Date(),
          updatedAt: new Date(),
          picture: firebaseUser.photoURL || "",
        } as User;

        await setDoc(userRef, newUser);
        setUser(newUser);
        return;
      }

      parseUserData(snapshot);
    } catch (error) {
      console.error("Erro ao carregar/criar usuário:", error);
    }
  };

  const parseUserData = (snapshot) => {
    const rawUser = snapshot.data();

    let relationshipDate = null;

    if (rawUser.relationshipStartDate instanceof Timestamp) {
      relationshipDate = rawUser.relationshipStartDate.toDate();
    }

    const parsedUser = {
      ...rawUser,
      relationshipStartDate: relationshipDate,
    } as User;

    setUser(parsedUser);
  };

  return {
    user,
    loadOrCreateUser,
    setUser,
  };
}
