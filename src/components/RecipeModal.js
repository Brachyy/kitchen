"use client";

import { useEffect, useState } from 'react';
import styles from './RecipeModal.module.css';
import { extractIngredients } from '@/utils/shoppingListAlgo';

export default function RecipeModal({ recipe, onClose }) {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (recipe) {
      setIngredients(extractIngredients(recipe));
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [recipe]);

  if (!recipe) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className={styles.image} />
          <div className={styles.titleSection}>
            <h2>{recipe.strMeal}</h2>
            <span className={styles.category}>{recipe.strCategory} • {recipe.strArea}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Ingredients</h3>
            <ul className={styles.ingredientList}>
              {ingredients.map((ing, i) => (
                <li key={i}>
                  <span className={styles.measure}>{ing.measure}</span> {ing.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Instructions</h3>
            <p className={styles.instructions}>
              {recipe.strInstructions}
            </p>
            {recipe.strYoutube && (
              <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                Watch Video Tutorial &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
