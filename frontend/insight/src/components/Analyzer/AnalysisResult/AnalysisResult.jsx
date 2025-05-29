import useModeStore from "../../../stores/modeStore"
import styles from './AnalysisResult.module.scss'

const AnalysisResult = ({ analysis }) => {
  const { mode } = useModeStore();

  return (
    <div className={styles.analysisContainer}>
      <h2 className={styles.title}>📊 Yapay Zeka Analizi</h2>
      
      <div className={styles.card}>
        <div className={styles.section}>
          <h3>Özet</h3>
          <p>{analysis.summary}</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <h3>✅ Olumlu Yönler</h3>
            <ul>
              {analysis.positives.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h3>❌ Olumsuz Yönler</h3>
            <ul>
              {analysis.negatives.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {mode === "user" ? (
          <div className={styles.score}>
            <h3>🎯 Ürün Puanı</h3>
            <div className={styles.scoreValue}>{analysis.point}/10</div>
          </div>
        ) : (
          <div className={styles.sellerInfo}>
            <div className={styles.section}>
              <h3>💡 Öneriler</h3>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className={styles.section}>
              <h3>📈 Rekabet Analizi</h3>
              <p>{analysis.competitiveAnalysis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisResult