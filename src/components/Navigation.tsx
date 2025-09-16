import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Users, UserSquare2, Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      to: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      description: 'Overview & analytics'
    },
    { 
      to: '/jobs', 
      icon: Briefcase, 
      label: 'Jobs',
      description: 'Manage job postings'
    },
    { 
      to: '/candidates', 
      icon: Users, 
      label: 'Candidates',
      description: 'View all candidates'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 transition-all duration-200"
            >
              <div className="relative">
                <UserSquare2 className="h-8 w-8 text-primary group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="text-xl font-bold  bg-clip-text  select-none">
                HR Manager
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      'hover:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary',
                      isActive
                        ? 'text-primary bg-primary/10 shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn(
                        'h-4 w-4 mr-2 transition-all duration-200',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      )} />
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden relative p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-6 h-6">
                <Menu className={cn(
                  'absolute inset-0 w-6 h-6 transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                )} />
                <X className={cn(
                  'absolute inset-0 w-6 h-6 transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                )} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={cn(
        'md:hidden transition-all duration-300 ease-out',
        isMobileMenuOpen 
          ? 'max-h-screen opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-2 overflow-hidden'
      )}>
        <div className="bg-card/98 backdrop-blur-md border-t border-border/50 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                    'hover:scale-[0.98] active:scale-95',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-md border-l-4 border-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )
                }
                style={{ 
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  animation: isMobileMenuOpen ? 'slideInLeft 300ms ease-out forwards' : 'none'
                }}
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <item.icon className={cn(
                        'h-5 w-5 transition-all duration-200',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      )} />
                      {isActive && (
                        <div className="absolute -inset-1 bg-primary/20 rounded blur-sm" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 opacity-80">
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
