"use client";

import { useState } from 'react';
import Link from 'next/link';
import IngredientInput from '@/components/IngredientInput';
import RecipeList from '@/components/RecipeList';
import RecipeModal from '@/components/RecipeModal';
import { getRecipeById, smartSearchRecipes } from '@/services/recipeApi';
import styles from './page.module.css';

export default function FridgePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async (ingredient) => {
    setLoading(true);
    setSearched(true);
    // Use smart search here too for better experience
    const results = await smartSearchRecipes(ingredient);
    setRecipes(results);
    setLoading(false);
  };

  const handleRecipeClick = async (recipe) => {
    // Fetch full details if we only have the summary
    if (!recipe.strInstructions) {
      const fullRecipe = await getRecipeById(recipe.idMeal);
      setSelectedRecipe(fullRecipe);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          &larr; Back
        </Link>
        <h1 className={styles.title}>Empty Fridge</h1>
        <p className={styles.subtitle}>
          Enter an ingredient you have, and we'll find recipes for you.
        </p>
      </header>

      <main className={styles.main}>
        <IngredientInput onSearch={handleSearch} />
        
        {loading && <div className={styles.loading}>Finding recipes...</div>}
        
        {!loading && searched && recipes.length === 0 && (
          <div className={styles.noResults}>
            No recipes found. Try a different ingredient (e.g., "egg", "chicken").
          </div>
        )}

        <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
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
