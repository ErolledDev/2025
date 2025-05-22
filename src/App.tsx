import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/u" element={<RedirectPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;