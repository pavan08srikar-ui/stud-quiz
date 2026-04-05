import React, { createContext, useState, useContext } from 'react';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

// Pre-loaded quizzes covering AI/ML, Python/DS, and Java
const defaultQuizzes = [
  {
    id: '1',
    title: 'AI & Machine Learning Fundamentals',
    description: 'Test your understanding of core AI/ML concepts including supervised learning, neural networks, and model evaluation.',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: 'Which of the following is an example of supervised learning?',
        options: ['K-Means Clustering', 'PCA (Dimensionality Reduction)', 'Linear Regression', 'Autoencoders'],
        correctIndex: 2
      },
      {
        id: 'q2', type: 'mcq',
        question: 'What does the "activation function" do in a neural network?',
        options: [
          'It initializes weights randomly',
          'It introduces non-linearity to the model',
          'It calculates the loss of the model',
          'It normalizes the input data'
        ],
        correctIndex: 1
      },
      {
        id: 'q3', type: 'mcq',
        question: 'Which metric is most appropriate for evaluating a model on an imbalanced dataset?',
        options: ['Accuracy', 'Mean Squared Error', 'F1 Score', 'R² Score'],
        correctIndex: 2
      },
      {
        id: 'q4', type: 'short_answer',
        question: 'Explain the difference between overfitting and underfitting in machine learning models.'
      }
    ],
    attempts: 87
  },
  {
    id: '2',
    title: 'Python & Data Science',
    description: 'Challenge yourself on Python programming, NumPy, Pandas, and core data science workflows.',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: 'What does the Pandas function `df.groupby("col").agg("mean")` do?',
        options: [
          'Filters rows where col equals "mean"',
          'Groups the DataFrame by col and computes the mean of each group',
          'Sorts the DataFrame by col and returns average',
          'Joins two DataFrames on col'
        ],
        correctIndex: 1
      },
      {
        id: 'q2', type: 'mcq',
        question: 'In Python, which data structure uses key-value pairs?',
        options: ['List', 'Tuple', 'Set', 'Dictionary'],
        correctIndex: 3
      },
      {
        id: 'q3', type: 'mcq',
        question: 'Which NumPy function creates an array of zeros with a given shape?',
        options: ['np.empty()', 'np.zeros()', 'np.full()', 'np.ones()'],
        correctIndex: 1
      },
      {
        id: 'q4', type: 'short_answer',
        question: 'What is the purpose of train-test splitting in a machine learning pipeline? Explain briefly.'
      }
    ],
    attempts: 64
  },
  {
    id: '3',
    title: 'Java & Software Engineering',
    description: 'Covers Java OOP principles, design patterns, data structures, and core software engineering concepts.',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: 'Which OOP principle is represented by a subclass being usable wherever a parent class is expected?',
        options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Liskov Substitution Principle'],
        correctIndex: 3
      },
      {
        id: 'q2', type: 'mcq',
        question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1
      },
      {
        id: 'q3', type: 'short_answer',
        question: 'Explain the difference between an interface and an abstract class in Java.'
      }
    ],
    attempts: 51
  }
];

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState(defaultQuizzes);
  const [results, setResults] = useState([]); // Stores completed attempts

  const addQuiz = (quiz) => {
    setQuizzes([{ id: Date.now().toString(), attempts: 0, ...quiz }, ...quizzes]);
  };

  const addResult = (result) => {
    setResults([result, ...results]);
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz, results, addResult }}>
      {children}
    </QuizContext.Provider>
  );
};
