import React from 'react';
import { Users, History, Bookmark, MonitorPlay, ShoppingBag, Flag, Calendar, Heart, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[280px] overflow-y-auto p-2 hidden xl:block custom-scrollbar">
      <SidebarItem 
        icon={<img src={user?.photoURL} className="w-9 h-9 rounded-full object-cover" alt="Profile" />} 
        label={user?.displayName || "Profile"} 
        isAvatar
      />
      <SidebarItem icon={<Users className="text-brand" />} label="Friends" />
      <SidebarItem icon={<History className="text-brand" />} label="Memories" />
      <SidebarItem icon={<Bookmark className="text-[#A855F7]" />} label="Saved" />
      <SidebarItem icon={<Users className="text-brand" />} label="Groups" />
      <SidebarItem icon={<MonitorPlay className="text-brand" />} label="Video" />
      <SidebarItem icon={<ShoppingBag className="text-[#F97316]" />} label="Marketplace" />
      <SidebarItem icon={<Flag className="text-[#FBBF24]" />} label="Pages" />
      <SidebarItem icon={<Calendar className="text-[#EF4444]" />} label="Events" />
      <SidebarItem icon={<Heart className="text-[#EC4899]" />} label="Fundraisers" />
      <SidebarItem icon={<ShieldCheck className="text-brand" />} label="Security" />
      <SidebarItem icon={<div className="bg-divider rounded-full w-9 h-9 flex items-center justify-center"><ChevronDown className="w-5 h-5 text-text-primary" /></div>} label="See more" />
      
      <div className="my-[10px] border-b border-divider mx-2" />
      <h3 className="px-2 py-2 font-semibold text-text-secondary text-[17px]">Your shortcuts</h3>
      <SidebarItem icon={<div className="w-9 h-9 bg-divider rounded-lg" />} label="Developer Community" />
      <SidebarItem icon={<div className="w-9 h-9 bg-divider rounded-lg" />} label="AI Innovations" />
    </aside>
  );
};

const SidebarItem = ({ icon, label, isAvatar = false }: { icon: React.ReactNode, label: string, isAvatar?: boolean }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg cursor-pointer transition-colors group">
    <div className={`flex items-center justify-center ${isAvatar ? '' : 'w-9 h-9'}`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: (icon as any).props.className || 'w-7 h-7' }) : icon}
    </div>
    <span className="font-medium text-[15px] text-text-primary">{label}</span>
  </div>
);
