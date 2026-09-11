'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CyberpunkPageHeader from '@/components/storefront/CyberpunkPageHeader';
import { BUNDLES } from '@/lib/bundles';
import styles from './bundles.module.css';

export default function BundlesPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Cyberpunk Modern Header */}
          <CyberpunkPageHeader
            // eyebrow="VYNTRO CURATED // VALUE ARSENAL"
            titlePrefix="BUNDLE"
            titleAccent="DEALS"
            description="Hand-picked combinations of our best gear — precision matched and priced to maximize your setup savings."
            code="COMBO SAVINGS"
          />

          {/* Bundle Cards Grid */}
          <div className={styles.grid}>
            {BUNDLES.map((bundle) => (
              <Link
                key={bundle.id}
                href={`/bundles/${bundle.slug}`}
                className={styles.card}
                id={`bundle-card-${bundle.id}`}
              >
                {/* Background Image */}
                <div className={styles.imgWrapper}>
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.bgImg}
                  />
                  <div className={styles.overlay} />
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <span className={styles.bundleBadge}>BUNDLE</span>
                  <h2 className={styles.bundleName}>{bundle.name}</h2>
                  <p className={styles.bundleTagline}>{bundle.tagline}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.bundlePrice}>
                      PKR {bundle.bundlePrice.toLocaleString()}
                    </span>
                    <span className={styles.viewDeal}>VIEW DEAL →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
