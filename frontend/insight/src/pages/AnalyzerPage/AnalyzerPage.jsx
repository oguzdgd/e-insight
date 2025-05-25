import axios from 'axios';
import { useState } from 'react';
import CommentList from '../../components/Analyzer/CommentList/CommentList';
import AnalysisResult from '../../components/Analyzer/AnalysisResult/AnalysisResult';
import InputForm from '../../components/Analyzer/InputForm/InputForm';
import styles from '../AnalyzerPage/AnalyzerPage.module.scss'


const AnalyzerPage = () => {
  const [url, setUrl] = useState('');
  const [productId, setProductId] = useState('');
  const [comments, setComments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: link gir, 2: yorumlar geldi, 3: analiz tamam
  const [customPrompt, setCustomPrompt] = useState('');

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
        customPrompt: customPrompt,
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
    <div className={styles.analyzerContainer}>
      <h1 className={styles.pageTitle}>Ürün Yorum Analizi</h1>

      <InputForm onSubmit={handleScrape} url={url} onChange={setUrl} loading={loading} />

      {step >= 2 && (
        <CommentList comments={comments} onAnalyze={handleAnalyze} loading={loading} customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
        />
      )}

      {step === 3 && analysis && (
        <AnalysisResult analysis={analysis} />
      )}
    </div>
  );
}

export default AnalyzerPage