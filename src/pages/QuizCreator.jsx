import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';

export const QuizCreator = () => {
  const { addQuiz } = useQuiz();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    if (type === 'mcq') {
      setQuestions([...questions, { id: Date.now().toString(), type: 'mcq', question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    } else {
      setQuestions([...questions, { id: Date.now().toString(), type: 'short_answer', question: '' }]);
    }
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = () => {
    if (!title || questions.length === 0) return alert('Please add a title and at least one question.');
    addQuiz({ title, description, questions });
    navigate('/');
  };

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create New Quiz</h1>
      
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quiz Title</label>
          <input type="text" placeholder="e.g., Introduction to React" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
          <textarea rows="3" placeholder="Briefly describe what this quiz is about..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
      </Card>

      {questions.map((q, i) => (
        <Card key={q.id} style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Question {i + 1} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 'normal' }}>({q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'})</span></h3>
            <button onClick={() => removeQuestion(q.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
              <Trash2 size={20} />
            </button>
          </div>
          
          <input 
            type="text" 
            placeholder="Type your question here..." 
            value={q.question} 
            onChange={e => updateQuestion(q.id, 'question', e.target.value)} 
            style={{ marginBottom: '1rem' }}
          />

          {q.type === 'mcq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="radio" 
                    name={`correct-${q.id}`} 
                    checked={q.correctIndex === optIdx}
                    onChange={() => updateQuestion(q.id, 'correctIndex', optIdx)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <input 
                    type="text" 
                    placeholder={`Option ${optIdx + 1}`} 
                    value={opt} 
                    onChange={e => updateOption(q.id, optIdx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {q.type === 'short_answer' && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              An AI bot will evaluate the student's text response for semantic correctness.
            </p>
          )}
        </Card>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Button variant="outline" onClick={() => addQuestion('mcq')}>
          <Plus size={18} /> Add MCQ
        </Button>
        <Button variant="outline" onClick={() => addQuestion('short_answer')}>
          <Plus size={18} /> Add Short Answer
        </Button>
        <div style={{ flex: 1 }}></div>
        <Button variant="primary" onClick={handleSave}>
          <Save size={18} /> Save & Publish
        </Button>
      </div>
    </div>
  );
};
