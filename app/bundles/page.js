'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { BUNDLES } from '@/lib/bundles';
import styles from './bundles.module.css';

export default function BundlesPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Page Header */}
          <div className={styles.header}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrowText}>VYNTRO CURATED</span>
              <span className={styles.eyebrowLine} />
            </div>
            <h1 className={styles.title}>
              BUNDLE <span className={styles.titleAccent}>DEALS</span>
            </h1>
            <p className={styles.subtitle}>
              Hand-picked combinations of our best gear — priced to save you more.
            </p>
          </div>

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
