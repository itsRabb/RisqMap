'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader as LoaderIcon,
  Cloud,
  Zap,
  Droplets,
  Wifi,
  WifiOff,
} from 'lucide-react';

/* ----------------------------- TYPES & INTERFACES ----------------------------- */
interface LoadingProgress {
  progress: number;
  phase:
    | 'initializing'
    | 'loading-data'
    | 'connecting'
    | 'ready';
  message: string;
}

interface SplashScreenProps {
  isFadingOut: boolean;
  onComplete?: () => void;
}

/* ----------------------------- ENHANCED PROGRESS COMPONENT ----------------------------- */
function LoadingProgress({ progress }: { progress: LoadingProgress }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getPhaseIcon = () => {
    switch (progress.phase) {
      case 'initializing':
        return <LoaderIcon className="w-5 h-5 animate-spin" />;
      case 'loading-data':
        return <Cloud className="w-5 h-5 animate-bounce text-sky-400" />;
      case 'connecting':
        return isOnline ? (
          <Wifi className="w-5 h-5 text-emerald-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-orange-400" />
        );
      case 'ready':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      default:
        return <LoaderIcon className="w-5 h-5 animate-spin" />;
    }
  };

  const getPhaseColor = () => {
    switch (progress.phase) {
      case 'initializing':
      case 'loading-data':
        return 'from-blue-400 to-cyan-500';
      case 'connecting':
        return isOnline
          ? 'from-emerald-400 to-green-500'
          : 'from-yellow-400 to-orange-500';
      case 'ready':
        return 'from-emerald-400 to-green-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const displayMessage = useMemo(() => {
    switch (progress.phase) {
      case 'initializing':
        return 'Preparing application core...';
      case 'loading-data':
        return 'Fetching latest data...';
      case 'connecting':
        return isOnline
          ? 'Connecting to server...'
          : 'Reconnecting...';
      case 'ready':
        return 'Ready to use!';
      default:
        return 'Starting...';
    }
  }, [progress.phase, isOnline]);

  return (
    <motion.div
      className="flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="text-blue-400"
        key={progress.phase} // Key for re-render and icon animation
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {getPhaseIcon()}
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90 font-medium mb-1">
          {displayMessage}
        </div>
        <div className="w-40 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getPhaseColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>

      <motion.div
        className="text-xs text-slate-400 tabular-nums min-w-[3ch]"
        key={Math.round(progress.progress)} // Key for percentage animation
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Math.round(progress.progress)}%
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------- EXAMPLE REAL TASK FUNCTIONS ----------------------------- */
// Example function for initializing (e.g., load local storage or auth)
async function initApp(): Promise<void> {
  // Example: Simulate or real init
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Replace with real code
}

// Example function for fetching data (e.g., weather API)
async function fetchWeatherData(): Promise<void> {
  // Example real fetch
  try {
    const response = await fetch(
      'https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=United%20States',
    );
    if (!response.ok) throw new Error('Failed to fetch');
    await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Example function for checking connection
async function checkConnection(): Promise<void> {
  return new Promise((resolve) => {
    if (navigator.onLine) resolve();
    else setTimeout(() => checkConnection(), 1000); // Retry if offline
  });
}

/* ----------------------------- MAIN SPLASH SCREEN COMPONENT ----------------------------- */
export function SplashScreen({ isFadingOut, onComplete }: SplashScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    progress: 0,
    phase: 'initializing',
    message: 'Preparing application...',
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const minDuration = 5000; // Total duration 5 seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / minDuration) * 100, 100);

      // Update state progress and phase message dynamically
      setLoadingProgress({
        progress: progress,
        phase: progress < 40 ? 'initializing' : progress < 80 ? 'loading-data' : progress < 95 ? 'connecting' : 'ready',
        message: progress < 40 ? 'Preparing core application...' : progress < 80 ? 'Fetching latest data...' : progress < 95 ? 'Connecting...' : 'Ready to use!',
      });

      if (progress >= 100) {
        clearInterval(interval);
        // Short delay to ensure 100% render completes before onComplete is called
        setTimeout(() => {
          onComplete?.();
        }, 100);
      }
    }, 50); // Update every 50ms for smooth animation

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            transition: {
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
        >
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-transparent to-indigo-800/20"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(26, 46, 76, 0.2) 0%, transparent 50%, rgba(49, 46, 129, 0.2) 100%)',
                  'linear-gradient(225deg, rgba(49, 46, 129, 0.2) 0%, transparent 50%, rgba(26, 46, 76, 0.2) 100%)',
                  'linear-gradient(135deg, rgba(26, 46, 76, 0.2) 0%, transparent 50%, rgba(49, 46, 129, 0.2) 100%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(1400px_800px_at_50%_-10%,rgba(59,130,246,0.06),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_600px_at_50%_100%,rgba(37,99,235,0.04),transparent)] pointer-events-none" />
          </div>

          {/* Simple animated spinner replacing 3D canvas */}
          <motion.div
            className="absolute inset-0 z-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative w-40 h-40"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400"></div>
            </motion.div>
            <motion.div
              className="absolute w-32 h-32"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-sky-400 border-l-blue-300"></div>
            </motion.div>
            <Droplets className="absolute w-16 h-16 text-cyan-400 animate-pulse" />
          </motion.div>

          <motion.div
            className="relative z-10 flex w-full h-full flex-col items-center justify-between py-12 px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              className="space-y-2 mt-8"
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <motion.h1
                className="flex justify-center text-6xl sm-text-7xl lg:text-8xl font-bold tracking-tight"
                aria-label="RisqMap"
              >
                {'Risq'.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-white"
                    variants={{
                      hidden: { y: 50, opacity: 0, rotateX: -90 },
                      visible: { y: 0, opacity: 1, rotateX: 0 },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                      delay: index * 0.05,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="inline-block bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-400 bg-clip-text text-transparent"
                  variants={{
                    hidden: { y: 50, opacity: 0, rotateX: -90 },
                    visible: { y: 0, opacity: 1, rotateX: 0 },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  Map
                </motion.span>
              </motion.h1>

              <motion.div
                className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>

            <motion.div
              className="space-y-3 max-w-2xl flex-grow flex flex-col justify-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl sm-text-2xl text-white/90 font-medium">
                Flood Early Warning System
              </p>
              <p className="text-lg text-white/70">
                Community-Based for United States
              </p>

              <motion.div
                className="flex items-center justify-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400">Offline Mode</span>
                  </>
                )}
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <LoadingProgress progress={loadingProgress} />
              </motion.div>

              <motion.div
                className="flex justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.2 }}
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
