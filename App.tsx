import React, { useState, useEffect } from 'react';
import WeighingCalculator from './components/WeighingCalculator.tsx';
import SimpleCalculator from './components/SimpleCalculator.tsx';
import FallingStars from './components/FallingStars.tsx';

// The BeforeInstallPromptEvent is not in the default TS DOM library.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser's default install prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listener for when the app is successfully installed
    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }

    // Show the install prompt to the user
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // The prompt can only be used once, hide the button.
      setInstallPrompt(null);
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-purple-900 to-slate-900 min-h-screen flex flex-col items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      <FallingStars />
      <main className="w-full max-w-3xl mx-auto z-10">
        <h1 className={`text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600 ${installPrompt ? 'mb-4' : 'mb-8'}`}>
          Weighing Calculation Tool
        </h1>
        
        {installPrompt && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-lime-500 to-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:from-lime-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 flex items-center gap-2"
              aria-label="Install app on your device"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Install App</span>
            </button>
          </div>
        )}
        
        <div className="space-y-10">
          <WeighingCalculator />
          <SimpleCalculator />
        </div>
      </main>
    </div>
  );
};

export default App;