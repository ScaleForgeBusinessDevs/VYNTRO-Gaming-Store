'use client';
import { useRef, useState } from 'react';
import styles from './CyberpunkPageHeader.module.css';

export default function CyberpunkPageHeader({
  eyebrow,
  titlePrefix,
  titleAccent,
  description,
  code = 'EST. 2026',
}) {
  const headerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    headerRef.current.style.setProperty('--mouse-x', `${x}px`);
    headerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={headerRef}
      className={`${styles.headerContainer} ${isHovered ? styles.isHovered : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div className={styles.cursorSpotlight} aria-hidden="true" />

      {/* Interactive Cyber Grid Backdrop that illuminates near cursor */}
      <div className={styles.cyberGridBackdrop} aria-hidden="true" />
      <div className={styles.cyberGridCursorGlow} aria-hidden="true" />

      {/* Cyber Scanline Sweep */}
      <div className={styles.cyberScanline} aria-hidden="true" />

      {/* Ambient Top & Bottom Laser Lines */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />

      {/* HUD Corner Tech Brackets */}
      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerTR} aria-hidden="true" />
      <div className={styles.cornerBL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />

      {/* Left Flank Cyber Telemetry (Fills wide screen space) */}
      <div className={styles.flankLeft} aria-hidden="true">
        <div className={styles.flankLine} />
        <span className={styles.flankCode}>SYS.LOC // 0x4F</span>
        <div className={styles.flankMeter}>
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
        </div>
      </div>

      {/* Right Flank Cyber Telemetry (Fills wide screen space) */}
      <div className={styles.flankRight} aria-hidden="true">
        <div className={styles.flankMeter}>
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
          <span className={styles.meterBar} />
        </div>
        <span className={styles.flankCode}>CAL // ZERO-DRAG</span>
        <div className={styles.flankLine} />
      </div>

      {/* Central Content */}
      <div className={styles.contentWrapper}>
        {/* Eyebrow Pill with Live Beacon */}
        {eyebrow && (
          <div className={styles.eyebrowBadge}>
            <span className={styles.beaconDot} />
            <span className={styles.eyebrowText}>{eyebrow}</span>
          </div>
        )}

        {/* Main Cyber Heading with Interactive Hover Spectrum */}
        <h1 className={styles.title}>
          <span className={styles.titlePrefix}>{titlePrefix}</span>{' '}
          <span className={styles.titleAccent}>{titleAccent}</span>
        </h1>

        {/* Laser Rail Divider with Reticle */}
        <div className={styles.laserDivider} aria-hidden="true">
          <div className={styles.laserLineLeft} />
          <div className={styles.laserCenterReticle}>
            <span className={styles.diamond} />
            <span className={styles.crosshairText}>VYNTRO // {code}</span>
            <span className={styles.diamond} />
          </div>
          <div className={styles.laserLineRight} />
        </div>

        {/* Description */}
        {description && <p className={styles.subtitle}>{description}</p>}
      </div>
    </div>
  );
}
