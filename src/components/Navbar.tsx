import React from 'react';
import { Search, Home, MonitorPlay, ShoppingBag, Users, LayoutGrid, Bell, MessageCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { auth } from '../lib/firebase';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[56px] bg-surface border-b border-divider shadow-md z-50 flex items-center justify-between px-4">
      {/* Left */}
      <div className="flex items-center gap-2 w-[280px]">
        <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/20">
          <span className="text-background font-bold text-2xl tracking-tighter">i</span>
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search iTambayan"
            className="bg-background rounded-full py-[7px] pl-10 pr-4 w-60 text-sm focus:outline-none text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>
      </div>

      {/* Center - Icons */}
      <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl gap-2 h-full">
        <NavIcon icon={<Home />} active />
        <NavIcon icon={<MonitorPlay />} />
        <NavIcon icon={<ShoppingBag />} />
        <NavIcon icon={<Users />} />
        <NavIcon icon={<LayoutGrid />} />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 w-[280px] justify-end">
        <div className="flex items-center gap-1 hover:bg-hover px-2 py-1 rounded-full cursor-pointer group transition-colors">
          <img 
            src={user?.photoURL} 
            alt="Profile" 
            className="w-7 h-7 rounded-full object-cover border border-divider shadow-sm"
          />
          <span className="text-sm font-semibold pr-1 hidden lg:block text-text-primary">{user?.displayName?.split(' ')[0]}</span>
        </div>
        <CircleButton icon={<MessageCircle />} />
        <CircleButton icon={<Bell />} />
        <CircleButton icon={<LogOut />} onClick={handleLogout} />
      </div>
    </nav>
  );
};

const NavIcon = ({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) => (
  <div className={`flex items-center justify-center px-8 h-full cursor-pointer transition-all relative group ${active ? 'text-brand' : 'text-text-secondary hover:bg-hover hover:rounded-lg h-[80%] my-[5%]'}`}>
    {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
    {active && <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-brand rounded-t-full shadow-[0_-4px_10px_rgba(0,210,255,0.4)]" />}
  </div>
);

const CircleButton = ({ icon, isMore, onClick }: { icon: React.ReactNode, isMore?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="w-10 h-10 rounded-full bg-divider flex items-center justify-center cursor-pointer hover:bg-hover transition-colors group"
  >
    {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 text-text-primary transition-transform group-hover:scale-110 ${isMore ? 'rotate-90' : ''}` })}
  </div>
);
