"use client";

import { useState } from 'react';
import IngredientInput from '@/components/IngredientInput';
import RecipeList from '@/components/RecipeList';
import RecipeModal from '@/components/RecipeModal';
import { getRecipeById, smartSearchRecipes } from '@/services/recipeApi';
import styles from './FridgeView.module.css';

export default function FridgeView() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async (ingredient) => {
    setLoading(true);
    setSearched(true);
    const results = await smartSearchRecipes(ingredient);
    setRecipes(results);
    setLoading(false);
  };

  const handleRecipeClick = async (recipe) => {
    if (!recipe.strInstructions) {
      const fullRecipe = await getRecipeById(recipe.idMeal);
      setSelectedRecipe(fullRecipe);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Empty Fridge</h2>
        <p className={styles.subtitle}>Find recipes with what you have.</p>
      </div>

      <div className={styles.searchArea}>
        <IngredientInput onSearch={handleSearch} />
      </div>
      
      <div className={styles.resultsArea}>
        {loading && <div className={styles.loading}>Finding recipes...</div>}
        
        {!loading && searched && recipes.length === 0 && (
          <div className={styles.noResults}>
            No recipes found. Try a different ingredient.
          </div>
        )}

        <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
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
