/* Copyright (c) 2023, Jason Oltzen */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// ===== TRANSACTIONS =====

export const getTransactions = async (userId, month, year) => {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-31`;
  const q = query(
    collection(db, "users", userId, "transactions"),
    where("transaction_date", ">=", start),
    where("transaction_date", "<=", end)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ transaction_id: d.id, ...d.data() }));
};

export const getTransactionsAnnual = async (userId, year) => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const q = query(
    collection(db, "users", userId, "transactions"),
    where("transaction_date", ">=", start),
    where("transaction_date", "<=", end)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ transaction_id: d.id, ...d.data() }));
};

export const getAllTransactions = async (userId) => {
  const snap = await getDocs(collection(db, "users", userId, "transactions"));
  return snap.docs.map((d) => ({ transaction_id: d.id, ...d.data() }));
};

export const addTransaction = async (userId, data) => {
  const docRef = await addDoc(
    collection(db, "users", userId, "transactions"),
    data
  );
  return { transaction_id: docRef.id, ...data };
};

export const updateTransaction = async (userId, transactionId, data) => {
  await updateDoc(
    doc(db, "users", userId, "transactions", transactionId),
    data
  );
};

export const deleteTransaction = async (userId, transactionId) => {
  await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
};

export const setTransactionFavorite = async (
  userId,
  transactionId,
  isFavorite
) => {
  await updateDoc(doc(db, "users", userId, "transactions", transactionId), {
    favorites: isFavorite,
  });
};

// ===== CATEGORIES =====

export const getCategories = async (userId) => {
  const snap = await getDocs(collection(db, "users", userId, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addCategory = async (userId, data) => {
  const docRef = await addDoc(
    collection(db, "users", userId, "categories"),
    data
  );
  return { id: docRef.id, ...data };
};

export const updateCategory = async (userId, categoryId, data) => {
  await updateDoc(doc(db, "users", userId, "categories", categoryId), data);
};

export const deleteCategory = async (userId, categoryId) => {
  await deleteDoc(doc(db, "users", userId, "categories", categoryId));
};

// ===== SETTINGS =====

export const getSettings = async (userId, month, year) => {
  const q = query(
    collection(db, "users", userId, "settings"),
    where("month", "==", Number(month)),
    where("year", "==", Number(year))
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ settings_id: d.id, ...d.data() }));
};

export const getSettingsAnnual = async (userId, year) => {
  const q = query(
    collection(db, "users", userId, "settings"),
    where("year", "==", Number(year))
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ settings_id: d.id, ...d.data() }));
};

export const getAllSettings = async (userId) => {
  const snap = await getDocs(collection(db, "users", userId, "settings"));
  return snap.docs.map((d) => ({ settings_id: d.id, ...d.data() }));
};

export const addSettings = async (userId, data) => {
  const payload = { ...data, month: Number(data.month), year: Number(data.year) };
  const docRef = await addDoc(
    collection(db, "users", userId, "settings"),
    payload
  );
  return { settings_id: docRef.id, ...payload };
};

export const updateSettings = async (userId, settingsId, data) => {
  await updateDoc(doc(db, "users", userId, "settings", settingsId), data);
};

export const deleteSettings = async (userId, settingsId) => {
  await deleteDoc(doc(db, "users", userId, "settings", settingsId));
};

// ===== SAVING GOALS =====

export const getSavingGoals = async (userId) => {
  const snap = await getDocs(collection(db, "users", userId, "savingGoals"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addSavingGoal = async (userId, data) => {
  const docRef = await addDoc(
    collection(db, "users", userId, "savingGoals"),
    data
  );
  return { id: docRef.id, ...data };
};

export const updateSavingGoal = async (userId, goalId, data) => {
  await updateDoc(doc(db, "users", userId, "savingGoals", goalId), data);
};

export const deleteSavingGoal = async (userId, goalId) => {
  await deleteDoc(doc(db, "users", userId, "savingGoals", goalId));
};

// ===== FAVORITES =====

export const getFavorites = async (userId) => {
  const snap = await getDocs(collection(db, "users", userId, "favorites"));
  return snap.docs.map((d) => ({ favorites_id: d.id, ...d.data() }));
};

export const addFavorite = async (userId, data) => {
  const docRef = await addDoc(
    collection(db, "users", userId, "favorites"),
    data
  );
  return { favorites_id: docRef.id, ...data };
};

export const updateFavorite = async (userId, favoriteId, data) => {
  await updateDoc(doc(db, "users", userId, "favorites", favoriteId), data);
};

export const deleteFavorite = async (userId, favoriteId) => {
  await deleteDoc(doc(db, "users", userId, "favorites", favoriteId));
};

export const deleteFavoritesByTransaction = async (userId, transactionId) => {
  const q = query(
    collection(db, "users", userId, "favorites"),
    where("transaction_id", "==", transactionId)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
};

// ===== USERS =====

export const getUserProfile = async (userId) => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateUserProfile = async (userId, data) => {
  await updateDoc(doc(db, "users", userId), data);
};

export const deleteUserData = async (userId) => {
  const subcollections = [
    "transactions",
    "categories",
    "settings",
    "savingGoals",
    "favorites",
  ];
  for (const sub of subcollections) {
    const snap = await getDocs(collection(db, "users", userId, sub));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
  await deleteDoc(doc(db, "users", userId));
};
