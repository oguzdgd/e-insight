import React from 'react'
import { Button } from '../../atoms/Button'

const CommentList = ({comments, onAnalyze, loading}) => {
  return (
    <div style={{ marginTop: 30 }}>
            <h2>📋 Yorumlar ({comments.length}):</h2>
            <ul>
              {comments.map((c, i) => (
                <li key={i}>{c.text}</li>
              ))}
            </ul>
  
            <Button onClick={onAnalyze} disabled={loading} style={{ marginTop: 20, padding: 10 }}>
              {loading ? 'Analiz Ediliyor...' : 'Yorumları Analiz Et'}
            </Button>
          </div>
  )
}

export default CommentList