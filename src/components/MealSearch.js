"use client";
import { useState } from 'react';
import styles from './MealSearch.module.css';
import { smartSearchRecipes, getRecipeById } from '@/services/recipeApi';
import { extractIngredients } from '@/utils/shoppingListAlgo';

export default function MealSearch({ onAddMeal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    const results = await smartSearchRecipes(searchTerm);
    setSearchResults(results || []);
    setIsSearching(false);
    setSelectedMeal(null); // Reset selection
  };

  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
  };

  const handleConfirmAdd = async () => {
    if (!selectedMeal) return;

    let fullMeal = selectedMeal;
    if (!selectedMeal.strInstructions) {
      fullMeal = await getRecipeById(selectedMeal.idMeal);
    }

    const ingredients = extractIngredients(fullMeal);
    onAddMeal(selectedDay, { ...fullMeal, ingredients });
    
    // Reset
    setSearchTerm('');
    setSearchResults([]);
    setSelectedMeal(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a meal..."
            className={styles.input}
          />
          <button type="submit" className={styles.searchBtn} disabled={isSearching}>
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className={styles.resultsGrid}>
          {searchResults.map(meal => (
            <div 
              key={meal.idMeal} 
              className={`${styles.card} ${selectedMeal?.idMeal === meal.idMeal ? styles.selected : ''}`}
              onClick={() => handleSelectMeal(meal)}
            >
              <img src={meal.strMealThumb} alt="" className={styles.thumb} />
              <div className={styles.cardInfo}>
                <h4>{meal.strMeal}</h4>
                <span className={styles.category}>{meal.strCategory}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMeal && (
        <div className={styles.actionBar}>
          <div className={styles.actionContent}>
            <span>Add <strong>{selectedMeal.strMeal}</strong> to:</span>
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className={styles.daySelect}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <button onClick={handleConfirmAdd} className={styles.addBtn}>
              Add to Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
