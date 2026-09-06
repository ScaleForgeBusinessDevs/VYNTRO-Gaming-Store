'use client';
import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email || whatsapp) setSubmitted(true);
  }

  return (
    <section className={styles.section} id="newsletter">
      {/* Background red glow */}
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.card}>
          {/* Corner accent lines */}
          <div className={styles.cornerTL} aria-hidden="true" />
          <div className={styles.cornerBR} aria-hidden="true" />

          <div className={styles.inner}>
            {!submitted ? (
              <>
                <div className={styles.text}>
                  <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine} />
                    <span className={styles.eyebrowText}>STAY IN THE LOOP</span>
                    <span className={styles.eyebrowLine} />
                  </div>
                  <h2 className={styles.headline}>
                    New drops &amp; exclusive deals,{' '}
                    <span className={styles.headlineAccent}>first access.</span>
                  </h2>
                  <p className={styles.subtext}>
                    Drop your email or WhatsApp — we&apos;ll hit you up when something new lands. No spam, ever.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} id="newsletter-form">
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="newsletter-email">Email address</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className={styles.orRow}>
                    <span className={styles.orLine} />
                    <span className={styles.orText}>or</span>
                    <span className={styles.orLine} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="newsletter-wa">WhatsApp number</label>
                    <input
                      id="newsletter-wa"
                      type="tel"
                      className={styles.input}
                      placeholder="+923363791538"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    id="newsletter-submit"
                  >
                    NOTIFY ME
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.thankYou}>
                <div className={styles.checkIcon}>✓</div>
                <h3 className={styles.thankTitle}>You&apos;re on the list!</h3>
                <p className={styles.thankText}>We&apos;ll reach out when something drops. No spam, ever.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
