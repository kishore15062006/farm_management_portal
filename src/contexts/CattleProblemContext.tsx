import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

export interface CattleProblem {
  id: string;
  cattleId: string;
  cattleTag: string;
  problem: string;
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  status: 'pending' | 'under_review' | 'prescribed' | 'resolved';
  farmerId: string;
  farmerName: string;
  farmName: string;
  veterinarianId?: string;
  prescription?: {
    id: string;
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
    withdrawalPeriod: number;
    prescribedDate: string;
  };
}

interface CattleProblemContextType {
  problems: CattleProblem[];
  addProblem: (problem: CattleProblem) => void;
  updateProblem: (problemId: string, updates: Partial<CattleProblem>) => void;
  getProblemsByFarmer: (farmerId: string) => CattleProblem[];
  getProblemsForVeterinarian: () => CattleProblem[];
}

const CattleProblemContext = createContext<CattleProblemContextType | undefined>(undefined);

export const useCattleProblems = () => {
  const context = useContext(CattleProblemContext);
  if (!context) {
    throw new Error('useCattleProblems must be used within a CattleProblemProvider');
  }
  return context;
};

export const CattleProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [problems, setProblems] = useState<CattleProblem[]>([]);
  const { addNotification } = useNotifications();

  // Load problems from localStorage on mount
  useEffect(() => {
    const storedProblems = localStorage.getItem('cattleProblems');
    if (storedProblems) {
      try {
        setProblems(JSON.parse(storedProblems));
      } catch (error) {
        console.error('Failed to load cattle problems from localStorage:', error);
      }
    }
  }, []);

  // Save problems to localStorage whenever problems change
  useEffect(() => {
    localStorage.setItem('cattleProblems', JSON.stringify(problems));
  }, [problems]);

  const addProblem = (problem: CattleProblem) => {
    setProblems(prev => [problem, ...prev]);
    // Notify veterinarians about new problem reported (broadcast)
    try {
      addNotification({
        type: 'problem_reported',
        title: 'New Problem Reported',
        message: `${problem.farmerName} reported an issue for ${problem.cattleTag}: ${problem.problem}`,
        priority: problem.severity === 'critical' || problem.severity === 'high' ? 'high' : 'medium',
        farmerId: problem.farmerId,
        problemId: problem.id,
        relatedData: {
          cattleTag: problem.cattleTag,
          farmName: problem.farmName,
          severity: problem.severity,
          reportedDate: problem.reportedDate,
        }
      });
    } catch (e) {
      // no-op
    }
  };

  const updateProblem = (problemId: string, updates: Partial<CattleProblem>) => {
    setProblems(prev => 
      prev.map(problem => 
        problem.id === problemId 
          ? { ...problem, ...updates }
          : problem
      )
    );
  };

  const getProblemsByFarmer = (farmerId: string) => {
    return problems.filter(problem => problem.farmerId === farmerId);
  };

  const getProblemsForVeterinarian = () => {
    return problems.filter(problem => 
      problem.status === 'pending' || problem.status === 'under_review' || problem.status === 'prescribed'
    );
  };

  return (
    <CattleProblemContext.Provider value={{
      problems,
      addProblem,
      updateProblem,
      getProblemsByFarmer,
      getProblemsForVeterinarian
    }}>
      {children}
    </CattleProblemContext.Provider>
  );
};
