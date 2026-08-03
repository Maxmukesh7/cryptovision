import React, { useState, Suspense } from 'react'
import styles from './SplineRobot.module.css'

// =========================================================================
// SPLINE SCENE URL PLACEHOLDER
// Replace the URL below with your own published Spline Scene URL (.splinecode)
// Example: https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode
// NOTE: Must be a published .splinecode URL, NOT a community page URL.
// =========================================================================
export const SPLINE_SCENE_URL =
  'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

function SplineRobot() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={styles.splineWrapper}>
      <div className={styles.glowBg} />

      {!isLoaded && !hasError && (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Loading 3D Assistant...</span>
        </div>
      )}

      {hasError ? (
        <div className={styles.fallbackContainer}>
          <div className={styles.robotAvatar}>🤖</div>
          <div className={styles.fallbackContent}>
            <span className={styles.fallbackTag}>3D Assistant</span>
            <p className={styles.fallbackText}>Spline Scene Placeholder</p>
          </div>
        </div>
      ) : (
        <Suspense fallback={null}>
          <div
            className={`${styles.canvasContainer} ${
              isLoaded ? styles.canvasLoaded : ''
            }`}
          >
            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />
          </div>
        </Suspense>
      )}
    </div>
  )
}

export default React.memo(SplineRobot)
