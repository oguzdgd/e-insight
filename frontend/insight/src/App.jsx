import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [productId, setProductId] = useState('');
  const [comments, setComments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: link gir, 2: yorumlar geldi, 3: analiz tamam

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5050/scrape', { url });
      const id = response.data.productId;
      setProductId(id);

      
      const commentsRes = await axios.get(`http://localhost:5050/comments/trendyol/${id}`);
      setComments(commentsRes.data.comments || []);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Yorumlar çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const reviewTexts = comments.map((c) => c.text);
      const response = await axios.post(`http://localhost:5050/analyzed/trendyol/${productId}`, {
        reviews: reviewTexts,
      });
      setAnalysis(response.data);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("Analiz yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 E-Insight: Ürün Yorum Analizi</h1>

      <div>
        <input
          type="text"
          value={url}
          placeholder="Ürün linkini girin (ör. Trendyol)"
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '70%', padding: 8 }}
        />
        <button onClick={handleScrape} disabled={loading} style={{ marginLeft: 10, padding: 8 }}>
          {loading ? 'Yükleniyor...' : 'Yorumları Çek'}
        </button>
      </div>

      {step >= 2 && (
        <div style={{ marginTop: 30 }}>
          <h2>📋 Yorumlar ({comments.length}):</h2>
          <ul>
            {comments.map((c, i) => (
              <li key={i}>{c.text}</li>
            ))}
          </ul>

          <button onClick={handleAnalyze} disabled={loading} style={{ marginTop: 20, padding: 10 }}>
            {loading ? 'Analiz Ediliyor...' : 'Yorumları Analiz Et'}
          </button>
        </div>
      )}

      {step === 3 && analysis && (
        <div style={{ marginTop: 30 }}>
          <h2>📊 Yapay Zeka Analizi:</h2>
          <p><strong>Özet:</strong> {analysis.summary}</p>
          <p><strong>Olumlu Yönler:</strong> {analysis.positives.join(", ")}</p>
          <p><strong>Olumsuz Yönler:</strong> {analysis.negatives.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
