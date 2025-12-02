"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getWeeklyPlan, addMealToPlan, removeMealFromPlan } from '@/services/db';
import Planner from '@/components/Planner';
import ShoppingList from '@/components/ShoppingList';
import RecipeModal from '@/components/RecipeModal';
import MealSearch from '@/components/MealSearch';
import styles from './page.module.css';

export default function PlannerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'search'
  const [plan, setPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [familyId, setFamilyId] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // For now, use user's UID as family ID. 
      // In future, we can look up the user's family ID from Firestore.
      setFamilyId(user.uid);
    }
  }, [user, loading, router]);

  // Load plan from Firestore
  useEffect(() => {
    if (familyId) {
      const loadPlan = async () => {
        const data = await getWeeklyPlan(familyId);
        if (data) setPlan(prev => ({ ...prev, ...data }));
      };
      loadPlan();
    }
  }, [familyId]);

  const handleAddMeal = async (day, meal) => {
    if (!familyId) return;
    
    // Optimistic update
    setPlan(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), meal]
    }));

    await addMealToPlan(familyId, day, meal);
    setActiveTab('plan'); // Switch back to plan after adding
  };

  const handleRemoveMeal = async (day, index) => {
    if (!familyId) return;
    
    const mealToRemove = plan[day][index];
    
    // Optimistic update
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));

    await removeMealFromPlan(familyId, day, mealToRemove);
  };

  if (loading || !user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>&larr; Home</Link>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'plan' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            Weekly Plan
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'search' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Add Meal
          </button>
        </div>
        <div className={styles.userControls}>
          <span>{user.email}</span>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === 'search' ? (
          <MealSearch onAddMeal={handleAddMeal} />
        ) : (
          <>
            <div className={styles.plannerSection}>
              <Planner 
                plan={plan} 
                onRemove={handleRemoveMeal}
                onRecipeClick={setSelectedRecipe}
                // Hide local search in Planner component since we have a dedicated tab now
                hideSearch={true} 
              />
            </div>
            <div className={styles.listSection}>
              <ShoppingList plan={plan} />
            </div>
          </>
        )}
      </main>

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}
