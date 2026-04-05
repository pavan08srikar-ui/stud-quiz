import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { QuizCreator } from './pages/QuizCreator';
import { QuizTaker } from './pages/QuizTaker';
import { QuizResult } from './pages/QuizResult';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<QuizCreator />} />
            <Route path="/take/:quizId" element={<QuizTaker />} />
            <Route path="/result" element={<QuizResult />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
