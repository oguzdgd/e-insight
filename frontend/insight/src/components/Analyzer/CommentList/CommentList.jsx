import { Button } from '../../atoms/Button'

const CommentList = ({ comments, onAnalyze, loading, customPrompt, setCustomPrompt }) => {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>📋 Yorumlar ({comments.length}):</h2>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="customPrompt">🧠 Özel Analiz İsteği (İsteğe bağlı):</label>
        <textarea
          id="customPrompt"
          rows={4}
          placeholder="(Örnek: 'Kargo hakkında yapılan yorumlara odaklan')"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            marginTop: 8,
            borderRadius: 4,
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
      </div>

      <Button onClick={onAnalyze} disabled={loading} style={{ marginTop: 20, padding: 10 }}>
        {loading ? 'Analiz Ediliyor...' : 'Yorumları Analiz Et'}
      </Button>
    </div>
  )
}

export default CommentList
