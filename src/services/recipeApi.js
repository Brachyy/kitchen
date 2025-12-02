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
 * Search recipes by name.
 * @param {string} name - The meal name to search for.
 * @returns {Promise<Array>} - List of recipes.
 */
export async function searchRecipesByName(name) {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

/**
 * Search recipes by category.
 * @param {string} category - The category to search for.
 * @returns {Promise<Array>} - List of recipes.
 */
export async function getRecipesByCategory(category) {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
}

/**
 * Smart search that tries multiple endpoints.
 * 1. Search by Name
 * 2. Search by Category (exact match)
 * 3. Filter by Ingredient
 */
export async function smartSearchRecipes(query) {
  const [byName, byIngredient, byCategory] = await Promise.all([
    searchRecipesByName(query),
    getRecipesByIngredient(query),
    getRecipesByCategory(query)
  ]);

  // Combine results and remove duplicates
  const allMeals = [...byName, ...byCategory, ...byIngredient];
  const uniqueMeals = Array.from(new Map(allMeals.map(item => [item.idMeal, item])).values());
  
  return uniqueMeals;
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
