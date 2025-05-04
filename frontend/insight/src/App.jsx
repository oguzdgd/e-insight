import { Routes, Route } from "react-router-dom"
import AnalyzerPage from './pages/AnalyzerPage';
import Layout from './Layout';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/analyzer' element={<AnalyzerPage />} />
      </Route>
    </Routes>

  );
}

export default App;
