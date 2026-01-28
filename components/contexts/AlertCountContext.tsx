// components/contexts/AlertCountContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef, // Import useRef
} from 'react';

// Define the Alert data type (must be consistent throughout the project)
interface Alert {
  id: string;
  level: 'Low' | 'Medium' | 'High';
  location: string;
  timestamp: string;
  reason: string;
  details?: string;
  affectedAreas?: string[];
  estimatedPopulation?: number;
  severity?: number;
}

// Define the type for the context value
interface AlertCountContextType {
  alertCount: number; // Total alerts
  highAlertCount: number; // Alerts with level "High"
  loadingAlerts: boolean;
  errorAlerts: string | null;
}

// Create Context with a default value
const AlertCountContext = createContext<AlertCountContextType | undefined>(
  undefined,
);

// Custom hook to use the context
export function useAlertCount() {
  const context = useContext(AlertCountContext);
  if (context === undefined) {
    throw new Error('useAlertCount must be used within an AlertCountProvider');
  }
  return context;
}

// Provider for the Context
interface AlertCountProviderProps {
  children: ReactNode;
}

export function AlertCountProvider({ children }: AlertCountProviderProps) {
  const [alertCount, setAlertCount] = useState<number>(0);
  const [highAlertCount, setHighAlertCount] = useState<number>(0);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(true);
  const [errorAlerts, setErrorAlerts] = useState<string | null>(null);
  const isInitialFetch = useRef(true); // Track initial fetch

  const fetchAlertsData = async () => {
    // Only set loading true on the initial fetch
    if (isInitialFetch.current) {
      setLoadingAlerts(true);
    }
    setErrorAlerts(null);
    try {
      const response = await fetch('/api/alerts-data');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts data.');
      }
      const data: Alert[] = await response.json();
      setAlertCount(data.length); // Update total count
      setHighAlertCount(
        data.filter((alert) => alert.level === 'High').length,
      ); // Count high-level alerts
    } catch (err: any) {
      console.error('Error fetching alerts for header/sidebar:', err);
      setErrorAlerts(err.message || 'Failed to load alerts.');
      setAlertCount(0); // Reset count on error
      setHighAlertCount(0);
    } finally {
      // Ensure loading is set to false and mark initial fetch as complete
      if (isInitialFetch.current) {
        setLoadingAlerts(false);
        isInitialFetch.current = false;
      }
    }
  };

  useEffect(() => {
    fetchAlertsData(); // Fetch data the first time the component mounts

    const intervalId = setInterval(fetchAlertsData, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval when component unmounts
  }, []); // Empty dependency array so it only runs once on mount

  const value = { alertCount, highAlertCount, loadingAlerts, errorAlerts };

  return (
    <AlertCountContext.Provider value={value}>
      {children}
    </AlertCountContext.Provider>
  );
}