/* Copyright (c) 2023, Jason Oltzen */

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { getUserProfile, updateUserProfile } from "../../services/db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser({ id: firebaseUser.uid, email: firebaseUser.email, ...profile });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(cred.user.uid);
    const userData = { id: cred.user.uid, email: cred.user.email, ...profile };
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const signup = async (email, password, profileData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const { setDoc, doc } = await import("firebase/firestore");
    const { db } = await import("../../firebase");
    await setDoc(doc(db, "users", cred.user.uid), {
      ...profileData,
      thememode: "dark",
      admin: false,
    });
    return cred.user.uid;
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const profile = await getUserProfile(auth.currentUser.uid);
    if (profile) {
      setUser({ id: auth.currentUser.uid, email: auth.currentUser.email, ...profile });
    }
  };

  const updateUser = async (data) => {
    if (!user) return;
    const { email, ...profileData } = data;
    if (email && email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, email);
    }
    await updateUserProfile(user.id, { ...profileData, ...(email ? { email } : {}) });
    await refreshUser();
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
