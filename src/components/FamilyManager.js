"use client";
import { useState } from 'react';
import { createFamily, joinFamily } from '@/services/db';
import styles from './FamilyManager.module.css';

export default function FamilyManager({ user, currentFamilyId, onFamilyUpdate }) {
  const [mode, setMode] = useState('view'); // 'view', 'create', 'join'
  const [familyName, setFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const familyId = await createFamily(user.uid, familyName);
      onFamilyUpdate(familyId);
      setMode('view');
    } catch (err) {
      setError('Failed to create family. Try again.');
    }
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await joinFamily(user.uid, joinCode);
      onFamilyUpdate(joinCode);
      setMode('view');
    } catch (err) {
      setError('Invalid family ID or network error.');
    }
    setLoading(false);
  };

  if (currentFamilyId && currentFamilyId !== user.uid) {
    return (
      <div className={styles.container}>
        <div className={styles.status}>
          <span className={styles.icon}>👨‍👩‍👧‍👦</span>
          <div>
            <p className={styles.label}>Family Group Active</p>
            <code className={styles.code}>{currentFamilyId}</code>
          </div>
        </div>
        <p className={styles.hint}>Share this code with others to let them join.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {mode === 'view' && (
        <div className={styles.actions}>
          <p className={styles.intro}>Plan together with your family.</p>
          <div className={styles.buttons}>
            <button onClick={() => setMode('create')} className={styles.btnPrimary}>Create Family</button>
            <button onClick={() => setMode('join')} className={styles.btnSecondary}>Join Family</button>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} className={styles.form}>
          <h3>Create a Family Group</h3>
          <input
            type="text"
            placeholder="Family Name (e.g. The Smiths)"
            value={familyName}
            onChange={e => setFamilyName(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.formActions}>
            <button type="button" onClick={() => setMode('view')} className={styles.btnText}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} className={styles.form}>
          <h3>Join a Family Group</h3>
          <input
            type="text"
            placeholder="Enter Family ID"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formActions}>
            <button type="button" onClick={() => setMode('view')} className={styles.btnText}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Joining...' : 'Join'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
