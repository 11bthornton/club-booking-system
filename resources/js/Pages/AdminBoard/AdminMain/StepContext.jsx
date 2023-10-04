import React, { createContext, useContext, useState, ReactNode } from 'react';

const StepContext = createContext();

export const useStep = () => {
  return useContext(StepContext);
};

export const StepProvider = ({ children }) => {

  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const [formData, setFormData] = useState({
    start_time: null,
    start_date: null,
    end_time: null,
    end_date: null,
    year_groups: [],
    clubs: [],
    students: []
    // ... other form fields
  });

  const resetSettings = () => {

    
    setFormData({
      start_time: null,
      start_date: null,
      end_time: null,
      end_date: null,
      year_groups: [],
      clubs: []
      // ... other form fields
    });
  };

  const value = {
    activeStep,
    setActiveStep,
    isLastStep,
    setIsLastStep,
    isFirstStep,
    setIsFirstStep,
    formData,
    setFormData,
    resetSettings
  };

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
