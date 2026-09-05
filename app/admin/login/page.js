'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data?.session) {
        setError(authError?.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Store authenticated session cookie for Next.js SSR proxy/middleware
      document.cookie = 'vyntro_admin_session=true; path=/; max-age=86400; SameSite=Lax';
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    setResetMessage('');
    setError('');
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    try {
      const supabase = getSupabase();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${origin}/admin/reset-password`,
      });

      if (resetErr) {
        setError(resetErr.message || 'Failed to send password reset email.');
      } else {
        setResetMessage(`Password reset link sent to ${resetEmail.trim()}. Check your inbox.`);
      }
    } catch (err) {
      setError(err?.message || 'Error requesting password reset.');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <p className={styles.logo}>
            <span className={styles.logoV}>V</span>YNTRO
          </p>
          <p className={`label ${styles.adminLabel}`}>Admin Panel</p>
        </div>

        {!showForgot ? (
          <>
            <h1 className={styles.title}>Sign In</h1>
            <p className="body-sm muted" style={{ marginBottom: 24 }}>
              Enter your credentials to access the admin panel
            </p>

            <form onSubmit={handleLogin} className={styles.form} id="admin-login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  placeholder="admin@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="admin-password">
                    Password
                  </label>
                  <button
                    type="button"
                    className={styles.forgotBtn}
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgot(true);
                      setError('');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="admin-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                className={`btn btn-gold ${styles.submitBtn}`}
                disabled={loading}
                id="admin-login-submit"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16 }} /> Authenticating...
                  </>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Reset Password</h1>
            <p className="body-sm muted" style={{ marginBottom: 24 }}>
              Enter your registered admin email to receive a secure recovery link.
            </p>

            <form onSubmit={handlePasswordReset} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">
                  Admin Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  placeholder="admin@yourdomain.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {resetMessage && <div className={styles.successMessage}>{resetMessage}</div>}

              <button
                type="submit"
                className={`btn btn-gold ${styles.submitBtn}`}
                disabled={resetLoading}
              >
                {resetLoading ? 'Sending link...' : 'Send Recovery Link →'}
              </button>

              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => {
                  setShowForgot(false);
                  setError('');
                  setResetMessage('');
                }}
              >
                ← Back to Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
