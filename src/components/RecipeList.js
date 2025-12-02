"use client";

import styles from './RecipeList.module.css';

export default function RecipeList({ recipes, onRecipeClick }) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <div 
          key={recipe.idMeal} 
          className={styles.card}
          onClick={() => onRecipeClick && onRecipeClick(recipe)}
          style={{ cursor: onRecipeClick ? 'pointer' : 'default' }}
        >
          <div className={styles.imageWrapper}>
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal} 
              className={styles.image}
              loading="lazy"
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{recipe.strMeal}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
