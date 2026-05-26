import React from 'react';
import { Video, Search, MoreHorizontal, User } from 'lucide-react';

const CONTACTS = [
  { id: 1, name: 'Alice Walker', photo: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Bob Smith', photo: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Charlie Davis', photo: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Diana Ross', photo: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Edward Norton', photo: 'https://i.pravatar.cc/150?u=5' },
];

export const RightSidebar: React.FC = () => {
  return (
    <aside className="fixed right-0 top-14 bottom-0 w-[280px] overflow-y-auto p-4 hidden xl:block custom-scrollbar">
      <div className="mb-6">
        <h3 className="font-semibold text-text-secondary text-[17px] mb-4">Sponsored</h3>
        <div className="flex gap-3 hover:bg-hover p-2 rounded-lg cursor-pointer mb-2">
          <div className="w-[100px] h-[60px] bg-divider rounded-lg overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" alt="Ad" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold leading-tight text-text-primary">Build at Scale</p>
            <p className="text-[13px] text-text-secondary">ai.studio</p>
          </div>
        </div>
      </div>

      <div className="border-t border-divider my-4" />

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-text-secondary text-[17px]">Contacts</h3>
        <div className="flex gap-2">
          <CircleButton icon={<Video />} />
          <CircleButton icon={<Search />} />
          <CircleButton icon={<MoreHorizontal />} />
        </div>
      </div>

      <div className="space-y-1">
        {CONTACTS.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg cursor-pointer relative group">
            <div className="relative">
              <img src={contact.photo} alt={contact.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="absolute bottom-0 right-[2px] w-3 h-3 bg-[#31A24C] border-[2px] border-background rounded-full" />
            </div>
            <span className="text-[15px] font-medium text-text-primary">{contact.name}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-divider my-4" />
      
      <div className="mb-4">
        <h3 className="font-semibold text-text-secondary text-[17px] mb-2">Group conversations</h3>
        <div className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg cursor-pointer">
          <div className="w-9 h-9 bg-divider rounded-full flex items-center justify-center leading-none text-xl font-bold">+</div>
          <span className="text-[15px] font-medium text-text-primary">Create New Group</span>
        </div>
      </div>
    </aside>
  );
};

const CircleButton = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-8 h-8 rounded-full hover:bg-hover flex items-center justify-center cursor-pointer transition-colors group">
    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 text-text-secondary group-hover:text-text-primary' })}
  </div>
);
