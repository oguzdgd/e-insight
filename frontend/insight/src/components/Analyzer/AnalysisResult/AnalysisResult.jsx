import React from 'react'

const AnalysisResult = ({analysis}) => {
  return (
    <div style={{ marginTop: 30 }}>
            <h2>📊 Yapay Zeka Analizi:</h2>
            <p><strong>Özet:</strong> {analysis.summary}</p>
            <p><strong>Olumlu Yönler:</strong> {analysis.positives.join(" ")}</p>
            <p><strong>Olumsuz Yönler:</strong> {analysis.negatives.join(" ")}</p>
          </div>
  )
}

export default AnalysisResult