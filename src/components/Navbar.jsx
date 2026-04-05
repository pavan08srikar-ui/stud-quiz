import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="glass-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
        <BrainCircuit size={28} color="var(--primary)" />
        <span>QuizAI Platform</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '500' }}>Dashboard</Link>
        <Link to="/create" style={{ textDecoration: 'none', color: location.pathname === '/create' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '500' }}>Create Quiz</Link>
      </div>
    </nav>
  );
};
