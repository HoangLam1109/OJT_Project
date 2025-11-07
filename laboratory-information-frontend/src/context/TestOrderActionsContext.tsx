import React, { createContext, useContext, useState, useCallback } from 'react';

interface TestOrderActionsContextType {
  onCreateTestOrder: () => void;
  setOnCreateTestOrder: (callback: () => void) => void;
}

const TestOrderActionsContext = createContext<TestOrderActionsContextType | undefined>(undefined);

export function TestOrderActionsProvider({ children }: { children: React.ReactNode }) {
  const [onCreateTestOrder, setOnCreateTestOrderState] = useState<() => void>(() => () => {});

  const setOnCreateTestOrder = useCallback((callback: () => void) => {
    setOnCreateTestOrderState(() => callback);
  }, []);

  return (
    <TestOrderActionsContext.Provider value={{ onCreateTestOrder, setOnCreateTestOrder }}>
      {children}
    </TestOrderActionsContext.Provider>
  );
}

export function useTestOrderActions() {
  const context = useContext(TestOrderActionsContext);
  if (context === undefined) {
    throw new Error('useTestOrderActions must be used within a TestOrderActionsProvider');
  }
  return context;
}

