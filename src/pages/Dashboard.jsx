import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Plus, Award, Activity } from 'lucide-react';

export const Dashboard = () => {
  const { quizzes, results } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back to your QuizAI hub</p>
        </div>
        <Button onClick={() => navigate('/create')} variant="primary">
          <Plus size={20} /> Create New Quiz
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
            <Activity color="var(--primary)" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{quizzes.length}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Available Quizzes</p>
          </div>
        </Card>
        
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
            <Award color="var(--secondary)" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{results.length}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Completed Attempts</p>
          </div>
        </Card>
      </div>

      <h2>Available Quizzes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {quizzes.map((quiz) => (
          <Card key={quiz.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{quiz.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', flex: 1, lineHeight: '1.5' }}>
              {quiz.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{quiz.questions.length} questions</span>
              <Button variant="secondary" onClick={() => navigate(`/take/${quiz.id}`)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <PlayCircle size={18} /> Take Quiz
              </Button>
            </div>
          </Card>
        ))}
        {quizzes.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No quizzes available. Create one!</p>
        )}
      </div>
    </div>
  );
};
