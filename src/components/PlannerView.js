"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWeeklyPlan, addMealToPlan, removeMealFromPlan, getUserFamily } from '@/services/db';
import Planner from '@/components/Planner';
import ShoppingList from '@/components/ShoppingList';
import RecipeModal from '@/components/RecipeModal';
import MealSearch from '@/components/MealSearch';
import FamilyManager from '@/components/FamilyManager';
import styles from './PlannerView.module.css';

export default function PlannerView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'search'
  const [plan, setPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [familyId, setFamilyId] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchFamily = async () => {
        const id = await getUserFamily(user.uid);
        setFamilyId(id || user.uid); // Fallback to user ID if no family
      };
      fetchFamily();
    }
  }, [user]);

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
    
    setPlan(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), meal]
    }));

    await addMealToPlan(familyId, day, meal);
    setActiveTab('plan');
  };

  const handleRemoveMeal = async (day, index) => {
    if (!familyId) return;
    
    const mealToRemove = plan[day][index];
    
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));

    await removeMealFromPlan(familyId, day, mealToRemove);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Weekly Plan</h2>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'plan' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            Schedule
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'search' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Add Meal
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <FamilyManager 
          user={user} 
          currentFamilyId={familyId} 
          onFamilyUpdate={setFamilyId} 
        />

        {activeTab === 'search' ? (
          <MealSearch onAddMeal={handleAddMeal} />
        ) : (
          <div className={styles.grid}>
            <div className={styles.plannerSection}>
              <Planner 
                plan={plan} 
                onRemove={handleRemoveMeal}
                onRecipeClick={setSelectedRecipe}
                hideSearch={true} 
              />
            </div>
            <div className={styles.listSection}>
              <ShoppingList plan={plan} />
            </div>
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}
