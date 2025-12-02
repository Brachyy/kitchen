"use client";

import styles from './ShoppingList.module.css';
import { generateShoppingList } from '@/utils/shoppingListAlgo';

export default function ShoppingList({ plan }) {
  const list = generateShoppingList(plan);
  const categories = Object.keys(list).sort();

  if (categories.length === 0) {
    return (
      <div className={styles.container}>
        <h3>Shopping List</h3>
        <p className={styles.empty}>Add meals to your plan to see ingredients here.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>Shopping List</h3>
      <div className={styles.list}>
        {categories.map(category => (
          <div key={category} className={styles.categoryGroup}>
            <h4 className={styles.categoryTitle}>{category}</h4>
            <ul className={styles.items}>
              {list[category].map((item, idx) => (
                <li key={idx} className={styles.item}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.measure}>{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
