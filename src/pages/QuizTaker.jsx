import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle, ChevronRight, Clock, AlertCircle } from 'lucide-react';

export const QuizTaker = () => {
  const { quizId } = useParams();
  const { quizzes, addResult } = useQuiz();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setTimeLeft(60);
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft === 0) handleNext();
    const timer = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!quiz) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <AlertCircle size={64} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Quiz Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>This quiz doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Go Back to Dashboard</Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.questions.length) * 100;
  const isLast = currentIndex === quiz.questions.length - 1;
  const timerColor = timeLeft <= 15 ? 'var(--danger)' : timeLeft <= 30 ? '#f59e0b' : 'var(--success)';

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      if (isLast) {
        const result = { quizId, quizTitle: quiz.title, answers, questions: quiz.questions, timestamp: Date.now() };
        addResult(result);
        navigate('/result', { state: result });
      } else {
        setCurrentIndex((i) => i + 1);
        setAnimating(false);
      }
    }, 300);
  };

  return (
    <div className="main-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{quiz.title}</h2>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1.2rem',
          borderRadius: '50px', border: `2px solid ${timerColor}`,
          transition: 'border-color 0.4s'
        }}>
          <Clock size={18} color={timerColor} />
          <span style={{ fontWeight: '700', fontSize: '1.1rem', color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
            {String(timeLeft).padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '100px', height: '6px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          borderRadius: '100px',
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* Question Card */}
      <Card style={{
        marginBottom: '2rem',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(12px)' : 'translateY(0)',
        transition: 'opacity 0.3s, transform 0.3s',
        padding: '2rem'
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '600', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {currentQuestion.type === 'mcq' ? '🔘 Multiple Choice' : '✍️ Short Answer'}
        </p>
        <h3 style={{ fontSize: '1.4rem', lineHeight: '1.5', marginBottom: '1.5rem', fontWeight: '600' }}>
          {currentQuestion.question}
        </h3>

        {currentQuestion.type === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  id={`option-${currentQuestion.id}-${idx}`}
                  onClick={() => setAnswer(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.9rem 1.2rem',
                    background: isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '10px',
                    color: isSelected ? 'var(--text-light)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.3)'}`,
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 'bold', color: 'white'
                  }}>
                    {isSelected ? <CheckCircle size={16} /> : String.fromCharCode(65 + idx)}
                  </div>
                  {opt || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Option {idx + 1}</span>}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'short_answer' && (
          <div>
            <textarea
              rows={5}
              id={`answer-${currentQuestion.id}`}
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ resize: 'vertical', lineHeight: '1.6', fontSize: '1rem' }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              🤖 This will be evaluated by our AI grading system
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          id="next-question-btn"
          variant="primary"
          onClick={handleNext}
          style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
        >
          {isLast ? '🏁 Submit Quiz' : 'Next'} <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
