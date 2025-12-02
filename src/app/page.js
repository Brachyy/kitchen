import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Smart <span className={styles.gradientText}>Kitchen</span>
        </h1>
        <p className={styles.subtitle}>
          Your intelligent assistant for recipes and shopping.
        </p>

        <div className={styles.grid}>
          <Link href="/fridge" className={styles.card}>
            <h2>Empty Fridge &rarr;</h2>
            <p>Find recipes with what you have.</p>
          </Link>

          <Link href="/planner" className={styles.card}>
            <h2>Weekly Plan &rarr;</h2>
            <p>Organize your meals and shopping list.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
