"use server";

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Fetch recipes by a main ingredient.
 * @param {string} ingredient - The main ingredient to search for.
 * @returns {Promise<Array>} - List of recipes.
 */
export async function getRecipesByIngredient(ingredient) {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch full recipe details by ID.
 * @param {string} id - The meal ID.
 * @returns {Promise<Object|null>} - Full recipe details.
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}
