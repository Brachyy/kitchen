"use client";

import { useState } from 'react';
import styles from './IngredientInput.module.css';

export default function IngredientInput({ onSearch }) {
  const [ingredient, setIngredient] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ingredient.trim()) {
      onSearch(ingredient.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="text"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        placeholder="Enter a main ingredient (e.g., chicken)"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Find Recipes
      </button>
    </form>
  );
}
