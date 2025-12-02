"use client";

import { useState } from 'react';
import Link from 'next/link';
import Planner from '@/components/Planner';
import ShoppingList from '@/components/ShoppingList';
import RecipeModal from '@/components/RecipeModal';
import styles from './page.module.css';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function PlannerPage() {
  const [plan, setPlan] = useLocalStorage('weeklyPlan', {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleAddToPlan = (day, recipe) => {
    setPlan(prev => ({
      ...prev,
      [day]: [...prev[day], recipe]
    }));
  };

  const handleRemoveFromPlan = (day, index) => {
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          &larr; Back
        </Link>
        <h1 className={styles.title}>Weekly Planner</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.plannerSection}>
          <Planner 
            plan={plan} 
            onAdd={handleAddToPlan} 
            onRemove={handleRemoveFromPlan}
            onRecipeClick={setSelectedRecipe}
          />
        </div>
        
        <div className={styles.listSection}>
          <ShoppingList plan={plan} />
        </div>
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
