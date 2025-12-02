"use client";

import { useState } from 'react';
import styles from './Planner.module.css';
import { getRecipesByIngredient, getRecipeById } from '@/services/recipeApi';
import { extractIngredients } from '@/utils/shoppingListAlgo';

export default function Planner({ plan, onAdd, onRemove, onRecipeClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Search by main ingredient for now as it's the same API
    const results = await getRecipesByIngredient(searchTerm);
    setSearchResults(results || []);
    setIsSearching(false);
  };

  const handleAddMeal = async (meal) => {
    // Fetch full details to get ingredients
    const fullMeal = await getRecipeById(meal.idMeal);
    if (fullMeal) {
      // Extract ingredients and add to meal object
      const ingredients = extractIngredients(fullMeal);
      onAdd(selectedDay, { ...fullMeal, ingredients });
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <h3>Add Meal</h3>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a meal (e.g. Pasta)"
            className={styles.input}
          />
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value)}
            className={styles.select}
          >
            {Object.keys(plan).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <button type="submit" className={styles.button}>Search</button>
        </form>

        {searchResults.length > 0 && (
          <div className={styles.results}>
            {searchResults.slice(0, 5).map(meal => (
              <div key={meal.idMeal} className={styles.resultItem} onClick={() => handleAddMeal(meal)}>
                <img src={meal.strMealThumb} alt="" className={styles.thumb} />
                <span>{meal.strMeal}</span>
                <span className={styles.addIcon}>+</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.weekGrid}>
        {Object.entries(plan).map(([day, meals]) => (
          <div key={day} className={styles.dayCard}>
            <h4 className={styles.dayTitle}>{day}</h4>
            <div className={styles.mealList}>
              {meals.length === 0 && <span className={styles.emptyText}>No meals</span>}
              {meals.map((meal, idx) => (
                <div key={`${day}-${idx}`} className={styles.mealItem}>
                  <span 
                    onClick={() => onRecipeClick && onRecipeClick(meal)}
                    style={{ cursor: 'pointer', flex: 1 }}
                  >
                    {meal.strMeal}
                  </span>
                  <button 
                    onClick={() => onRemove(day, idx)}
                    className={styles.removeBtn}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
