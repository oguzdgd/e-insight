import { Routes, Route } from "react-router-dom"
import AnalyzerPage from './pages/AnalyzerPage/AnalyzerPage.jsx';
import Layout from './Layout';
import HomePage from "./pages/HomePage/HomePage.jsx";
import useModeStore from './stores/modeStore';
import { useEffect } from "react";

function App() {
    const { mode } = useModeStore();
    
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/analyzer' element={<AnalyzerPage />} />
      </Route>
    </Routes>

  );
}

export default App;
