import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from "firebase/firestore";

// Create a new family
export const createFamily = async (userId, familyName) => {
  // Create family doc
  const familyRef = await addDoc(collection(db, "families"), {
    name: familyName,
    members: [userId],
    createdAt: new Date()
  });
  
  const familyId = familyRef.id;

  // Initialize plan for this family
  await createFamilyPlan(familyId);

  // Update user with familyId
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { familyId }, { merge: true });

  return familyId;
};

// Join an existing family
export const joinFamily = async (userId, familyId) => {
  const familyRef = doc(db, "families", familyId);
  const familySnap = await getDoc(familyRef);

  if (!familySnap.exists()) {
    throw new Error("Family not found");
  }

  // Add user to family members
  await updateDoc(familyRef, {
    members: arrayUnion(userId)
  });

  // Update user with familyId
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { familyId }, { merge: true });
};

// Get user's family ID
export const getUserFamily = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().familyId;
  }
  return null;
};

// Initialize a new family plan
export const createFamilyPlan = async (familyId) => {
  const planRef = doc(db, "plans", familyId);
  const initialPlan = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
    members: []
  };
  await setDoc(planRef, initialPlan, { merge: true });
};

// Get the weekly plan
export const getWeeklyPlan = async (familyId) => {
  const planRef = doc(db, "plans", familyId);
  const docSnap = await getDoc(planRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Create if doesn't exist
    await createFamilyPlan(familyId);
    return (await getDoc(planRef)).data();
  }
};

// Add meal to a specific day
export const addMealToPlan = async (familyId, day, meal) => {
  const planRef = doc(db, "plans", familyId);
  await updateDoc(planRef, {
    [day]: arrayUnion(meal)
  });
};

// Remove meal from a specific day
export const removeMealFromPlan = async (familyId, day, meal) => {
  const planRef = doc(db, "plans", familyId);
  await updateDoc(planRef, {
    [day]: arrayRemove(meal)
  });
};
