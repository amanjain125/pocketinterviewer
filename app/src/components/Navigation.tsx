import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Crown, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { user, isAuthenticated, navigateTo, logout, currentPage } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  // Navigation items based on authentication and plan
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { label: 'How it works', page: 'landing' as const, icon: null },
        { label: 'Pricing', page: 'pro' as const, icon: null },
        { label: 'FAQ', page: 'landing' as const, icon: null },
      ];
    }

    const baseItems: { label: string; page: 'dashboard' | 'progress' | 'pro' | 'profile' | 'modes' | 'panel' | 'full-interview'; icon: React.ElementType | null }[] = [
      { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
      { label: 'Progress', page: 'progress', icon: TrendingUp },
      { label: 'Pro', page: 'pro', icon: Crown },
      { label: 'Profile', page: 'profile', icon: User },
    ];

    // Add plan-specific items
    if (user?.plan === 'advanced' || user?.plan === 'full') {
      baseItems.splice(3, 0, { label: 'Modes', page: 'modes', icon: Settings });
    }

    if (user?.plan === 'full') {
      baseItems.splice(4, 0, { label: 'Panel', page: 'panel', icon: User });
      baseItems.splice(5, 0, { label: 'Full Interview', page: 'full-interview', icon: Crown });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-[#4B2086] rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
              💼
            </div>
            <span className="font-display font-bold text-lg text-white hidden sm:block">
              Pocket Interviewer
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo(item.page)}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigateTo('login')}
              className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
            >
              Login
            </Button>
            <Button
              onClick={() => navigateTo('signup')}
              className="btn-primary text-sm"
            >
              Start practicing
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-[#4B2086] rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
              💼
            </div>
            <span className="font-display font-bold text-white hidden lg:block">
              Pocket Interviewer
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-[#FF4EC2] text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full">
              <span className="streak-fire text-lg">🔥</span>
              <span className="text-orange-400 font-bold text-sm">{user?.streak || 0}</span>
            </div>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigateTo(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-[#FF4EC2] text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
