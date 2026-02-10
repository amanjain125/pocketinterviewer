import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppProvider, useAppState } from '@/hooks/useAppState';
import { NoiseOverlay } from '@/components/NoiseOverlay';
import { Navigation } from '@/components/Navigation';
import { EntryAnimation } from '@/sections/EntryAnimation';
import { LandingPage } from '@/sections/LandingPage';
import { AuthPage } from '@/sections/AuthPage';
import { DomainSelect } from '@/sections/DomainSelect';
import { Dashboard } from '@/sections/Dashboard';
import { InterviewSetup } from '@/sections/InterviewSetup';
import { InterviewPage } from '@/sections/InterviewPage';
import { ProgressPage } from '@/sections/ProgressPage';
import { ProPage } from '@/sections/ProPage';
import { ModesPage } from '@/sections/ModesPage';
import { PanelPage } from '@/sections/PanelPage';
import { FullInterviewPage } from '@/sections/FullInterviewPage';
import { ProfilePage } from '@/sections/ProfilePage';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { currentPage, isAuthenticated, showDomainSelect, showInterviewSetup } = useAppState();
  const [showEntry, setShowEntry] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide entry animation after it completes
    const timer = setTimeout(() => {
      setShowEntry(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Render the appropriate page based on current state
  const renderPage = () => {
    if (showDomainSelect && isAuthenticated) {
      return <DomainSelect />;
    }

    if (showInterviewSetup && isAuthenticated) {
      return <InterviewSetup />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
      case 'signup':
        return <AuthPage mode={currentPage} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard /> : <LandingPage />;
      case 'interview':
        return isAuthenticated ? <InterviewPage /> : <LandingPage />;
      case 'progress':
        return isAuthenticated ? <ProgressPage /> : <LandingPage />;
      case 'pro':
        return isAuthenticated ? <ProPage /> : <LandingPage />;
      case 'modes':
        return isAuthenticated ? <ModesPage /> : <LandingPage />;
      case 'panel':
        return isAuthenticated ? <PanelPage /> : <LandingPage />;
      case 'full-interview':
        return isAuthenticated ? <FullInterviewPage /> : <LandingPage />;
      case 'profile':
        return isAuthenticated ? <ProfilePage /> : <LandingPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#2B0B57]">
      <NoiseOverlay />
      
      {/* Entry Animation */}
      {showEntry && currentPage === 'landing' && !isAuthenticated && (
        <EntryAnimation onComplete={() => setShowEntry(false)} />
      )}

      {/* Navigation */}
      {!showEntry && <Navigation />}

      {/* Main Content */}
      <main className={`transition-opacity duration-500 ${showEntry && !isAuthenticated ? 'opacity-0' : 'opacity-100'}`}>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
