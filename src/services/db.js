import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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
