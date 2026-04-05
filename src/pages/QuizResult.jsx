import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle2, XCircle, BrainCircuit, Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

// Simulated AI feedback responses
const AI_FEEDBACKS = [
  "Good attempt! Your answer captures the core concept. You mentioned key terms but could add more depth about practical implications.",
  "Excellent response! You've clearly understood the topic. Your explanation covers the main points concisely and accurately.",
  "Partial credit. You touched on the right idea, but the elaboration could be stronger. Consider connecting it to real-world examples.",
  "Nice work! Your answer aligns well with the expected response. A bit more technical precision would make it perfect.",
  "Your answer shows understanding of the fundamentals. Try to expand on the 'why' behind the concept for a more complete answer.",
];

const getAiFeedback = () => AI_FEEDBACKS[Math.floor(Math.random() * AI_FEEDBACKS.length)];

const getGrade = (percentage) => {
  if (percentage >= 90) return { label: 'S', caption: 'Outstanding!', color: '#22c55e' };
  if (percentage >= 75) return { label: 'A', caption: 'Excellent!', color: '#3b82f6' };
  if (percentage >= 60) return { label: 'B', caption: 'Good Job!', color: '#8b5cf6' };
  if (percentage >= 45) return { label: 'C', caption: 'Keep Practicing', color: '#f59e0b' };
  return { label: 'F', caption: 'Needs Improvement', color: '#ef4444' };
};

export const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const [aiStates, setAiStates] = useState({});
  const [scoreVisible, setScoreVisible] = useState(false);

  useEffect(() => {
    if (!result) return;
    // Evaluate short answers with simulated AI delay
    const shortAnswerQs = result.questions.filter((q) => q.type === 'short_answer');
    shortAnswerQs.forEach((q) => {
      setAiStates((prev) => ({ ...prev, [q.id]: { loading: true, score: null, feedback: null } }));
      const delay = 2000 + Math.random() * 2000; // 2–4 seconds
      setTimeout(() => {
        const score = Math.floor(Math.random() * 4) + 7; // 7–10 out of 10
        setAiStates((prev) => ({
          ...prev,
          [q.id]: { loading: false, score, feedback: getAiFeedback() },
        }));
      }, delay);
    });
    // Show score summary after a brief animation delay
    setTimeout(() => setScoreVisible(true), 300);
  }, []);

  if (!result) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No result data found.</p>
        <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Back to Dashboard</Button>
      </div>
    );
  }

  // Calculate MCQ score
  const mcqQuestions = result.questions.filter((q) => q.type === 'mcq');
  const mcqCorrect = mcqQuestions.filter((q) => result.answers[q.id] === q.correctIndex).length;
  const mcqTotal = mcqQuestions.length;

  // Wait for all AI scores to compute overall %
  const aiScores = Object.values(aiStates).filter((s) => !s.loading && s.score !== null);
  const allAiDone = aiScores.length === result.questions.filter((q) => q.type === 'short_answer').length;
  const totalShortPoints = aiScores.reduce((sum, s) => sum + s.score, 0);
  const maxShortPoints = result.questions.filter((q) => q.type === 'short_answer').length * 10;
  const totalScore = (mcqCorrect * 10) + totalShortPoints;
  const maxScore = (mcqTotal * 10) + maxShortPoints;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const grade = getGrade(percentage);

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Score Hero Card */}
      <Card style={{
        textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
        border: '1px solid rgba(139,92,246,0.3)',
        opacity: scoreVisible ? 1 : 0,
        transform: scoreVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <Trophy size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '0.5rem' }}>{result.quizTitle}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Quiz Completed!</p>

        {/* Grade Circle */}
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem',
          border: `4px solid ${grade.color}`,
          background: `radial-gradient(circle, ${grade.color}22, transparent)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 30px ${grade.color}44`,
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '800', color: grade.color }}>{grade.label}</span>
        </div>
        <p style={{ fontSize: '1.3rem', fontWeight: '600', color: grade.color, marginBottom: '0.5rem' }}>{grade.caption}</p>

        {allAiDone ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Your Score: <strong style={{ color: 'var(--text-light)' }}>{totalScore} / {maxScore}</strong>&nbsp;&nbsp;|&nbsp;&nbsp;
            <strong style={{ color: grade.color }}>{percentage}%</strong>
          </p>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>
            MCQ Score: <strong style={{ color: 'var(--primary)' }}>{mcqCorrect}/{mcqTotal}</strong>
            &nbsp;&nbsp;|&nbsp;&nbsp;AI evaluation in progress...
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="outline" id="go-home-btn" onClick={() => navigate('/')}>
            <Home size={18} /> Dashboard
          </Button>
          <Button variant="primary" id="retake-btn" onClick={() => navigate(`/take/${result.quizId}`)}>
            <RotateCcw size={18} /> Retake Quiz
          </Button>
        </div>
      </Card>

      {/* Per-Question Review */}
      <h2 style={{ marginBottom: '1.5rem' }}>📋 Question Review</h2>
      {result.questions.map((q, idx) => {
        const userAnswer = result.answers[q.id];
        const aiState = aiStates[q.id];

        return (
          <Card key={q.id} style={{ marginBottom: '1.5rem', padding: '1.5rem', borderLeft: q.type === 'mcq' ? '4px solid var(--primary)' : '4px solid var(--secondary)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: q.type === 'mcq' ? 'var(--primary)' : 'var(--secondary)', marginBottom: '0.5rem', display: 'block'
              }}>
                {q.type === 'mcq' ? '🔘 MCQ' : '✍️ Short Answer'} — Q{idx + 1}
              </span>
              <p style={{ fontWeight: '600', fontSize: '1.05rem', lineHeight: '1.5', color: 'var(--text-light)' }}>
                {q.question}
              </p>
            </div>

            {q.type === 'mcq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correctIndex;
                  const isUserChoice = optIdx === userAnswer;
                  let bg = 'rgba(255,255,255,0.04)';
                  let border = 'rgba(255,255,255,0.1)';
                  if (isCorrect) { bg = 'rgba(34,197,94,0.15)'; border = 'var(--success)'; }
                  if (isUserChoice && !isCorrect) { bg = 'rgba(239,68,68,0.15)'; border = 'var(--danger)'; }

                  return (
                    <div key={optIdx} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.7rem 1rem', borderRadius: '8px',
                      background: bg, border: `1.5px solid ${border}`,
                    }}>
                      {isCorrect ? <CheckCircle2 size={18} color="var(--success)" /> :
                        isUserChoice ? <XCircle size={18} color="var(--danger)" /> :
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }} />}
                      <span style={{ color: isCorrect ? 'var(--success)' : isUserChoice ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {opt}
                        {isCorrect && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', opacity: 0.7 }}>(Correct Answer)</span>}
                        {isUserChoice && !isCorrect && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', opacity: 0.7 }}>(Your Answer)</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === 'short_answer' && (
              <div>
                {/* Student Answer */}
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Your Answer:</p>
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                    {userAnswer || <em style={{ opacity: 0.5 }}>No answer provided</em>}
                  </p>
                </div>

                {/* AI Evaluation */}
                <div style={{
                  background: 'rgba(139,92,246,0.08)', padding: '1rem', borderRadius: '8px',
                  border: '1px solid rgba(139,92,246,0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <BrainCircuit size={18} color="var(--secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--secondary)' }}>AI Evaluation</span>
                  </div>

                  {!aiState || aiState.loading ? (
                    <div className="ai-loader">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Analyzing your response...</span>
                    </div>
                  ) : (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Sparkles size={16} color="#f59e0b" />
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-light)' }}>
                          Score: {aiState.score} / 10
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {aiState.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
