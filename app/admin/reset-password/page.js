'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from '../login/login.module.css';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) {
        setError(updateErr.message || 'Failed to update password.');
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    } catch (err) {
      setError(err?.message || 'Error updating password.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <p className={styles.logo}>
            <span className={styles.logoV}>V</span>YNTRO
          </p>
          <p className={`label ${styles.adminLabel}`}>Admin Panel</p>
        </div>

        <h1 className={styles.title}>New Password</h1>
        <p className="body-sm muted" style={{ marginBottom: 24 }}>
          Enter a new secure password for your admin account.
        </p>

        {success ? (
          <div className={styles.successMessage}>
            ✅ Password updated successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={`btn btn-gold ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Save New Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
