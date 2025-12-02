/**
 * Extracts ingredients from a meal object.
 * TheMealDB returns ingredients as strIngredient1, strIngredient2, etc.
 */
export function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : '',
        category: getCategory(ingredient.trim())
      });
    }
  }
  return ingredients;
}

/**
 * Simple mock category mapper.
 * In a real app, this would use a database or API.
 */
function getCategory(ingredient) {
  const lower = ingredient.toLowerCase();
  if (['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon'].some(k => lower.includes(k))) return 'Meat & Fish';
  if (['milk', 'cheese', 'cream', 'yogurt', 'butter'].some(k => lower.includes(k))) return 'Dairy';
  if (['onion', 'garlic', 'carrot', 'potato', 'tomato', 'vegetable', 'lettuce', 'spinach'].some(k => lower.includes(k))) return 'Produce';
  if (['rice', 'pasta', 'noodle', 'bread', 'flour'].some(k => lower.includes(k))) return 'Grains & Bread';
  if (['sugar', 'salt', 'pepper', 'spice', 'oil', 'sauce'].some(k => lower.includes(k))) return 'Pantry';
  return 'Other';
}

/**
 * Groups ingredients by category from a weekly plan.
 * Aggregates quantities where possible.
 */
export function generateShoppingList(plan) {
  const allIngredients = [];
  
  Object.values(plan).flat().forEach(meal => {
    if (meal.ingredients) {
      allIngredients.push(...meal.ingredients);
    }
  });

  // Group by category and name
  const grouped = allIngredients.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    
    // Normalize name for comparison (e.g., "Onions" -> "onion")
    const normName = normalizeName(item.name);
    
    const existing = acc[item.category].find(i => normalizeName(i.name) === normName);
    
    if (existing) {
      // Try to sum quantities
      const existingQty = parseQuantity(existing.measure);
      const newQty = parseQuantity(item.measure);
      
      if (existingQty && newQty && existingQty.unit === newQty.unit) {
        existing.measure = `${existingQty.value + newQty.value} ${existingQty.unit}`;
      } else {
        // Fallback: concatenate if units differ or can't be parsed
        existing.measure += ` + ${item.measure}`;
      }
    } else {
      acc[item.category].push({ ...item });
    }
    return acc;
  }, {});

  return grouped;
}

function normalizeName(name) {
  return name.toLowerCase().replace(/s$/, ''); // Simple plural removal
}

function parseQuantity(measure) {
  if (!measure) return null;
  
  // Regex to match "1.5 kg", "2 cups", "1/2 tsp"
  // This is a basic parser and won't handle complex fractions or mixed numbers perfectly
  const match = measure.trim().match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*([a-zA-Z]+)?/);
  
  if (match) {
    let value = match[1];
    const unit = match[2] ? match[2].toLowerCase() : '';
    
    // Handle simple fractions
    if (value.includes('/')) {
      const [num, den] = value.split('/');
      value = parseInt(num) / parseInt(den);
    } else {
      value = parseFloat(value);
    }
    
    return { value, unit };
  }
  return null;
}
