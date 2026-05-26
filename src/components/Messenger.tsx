import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Video, Minus } from 'lucide-react';
import { useAuthStore } from '../store/useStore';

export const messengerContacts = [
  { id: 1, name: 'Alice Walker', photo: 'https://i.pravatar.cc/150?u=1', online: true },
  { id: 2, name: 'Bob Smith', photo: 'https://i.pravatar.cc/150?u=2', online: true },
];

export const Messenger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<typeof messengerContacts[0] | null>(null);
  const { user } = useAuthStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
      {activeChat && (
        <div className="w-80 h-96 bg-surface rounded-t-xl shadow-2xl flex flex-col border border-divider">
          {/* Chat Header */}
          <div className="p-2 border-b border-divider flex justify-between items-center bg-surface rounded-t-xl">
            <div className="flex items-center gap-2 hover:bg-hover p-1 rounded-lg cursor-pointer transition-colors">
              <img src={activeChat.photo} alt={activeChat.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-xs font-bold leading-tight text-text-primary">{activeChat.name}</p>
                <p className="text-[10px] text-text-secondary">Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ChatControl icon={<Phone />} />
              <ChatControl icon={<Video />} />
              <ChatControl icon={<Minus />} onClick={() => setActiveChat(null)} />
              <ChatControl icon={<X />} onClick={() => setActiveChat(null)} />
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-background custom-scrollbar">
            <div className="flex justify-center my-4">
              <div className="text-center">
                <img src={activeChat.photo} alt={activeChat.name} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-divider shadow-lg" />
                <p className="font-bold text-text-primary">{activeChat.name}</p>
                <p className="text-xs text-text-secondary">iTambayan Messenger</p>
                <p className="text-xs text-text-secondary">You're friends on iTambayan</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <img src={activeChat.photo} alt="Other" className="w-8 h-8 rounded-full self-end border border-divider" />
              <div className="bg-hover p-2 rounded-2xl rounded-bl-none text-sm max-w-[70%] text-text-primary">
                Hey! How's the new iTambayan build going?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-brand text-background p-2 rounded-2xl rounded-br-none text-sm max-w-[70%] font-medium">
                Going great! Just finished the core feed.
              </div>
            </div>
          </div>

          {/* Chat Footer */}
          <div className="p-2 border-t border-divider flex items-center gap-2 bg-surface">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Aa" 
                className="w-full bg-background rounded-full py-1 px-3 text-sm focus:outline-none text-text-primary placeholder:text-text-secondary"
              />
            </div>
            <Send className="w-5 h-5 text-brand cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>
      )}

      {!activeChat && isOpen && (
        <div className="w-72 bg-surface rounded-xl shadow-xl border border-divider overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-3 border-b border-divider flex justify-between items-center">
            <h3 className="font-bold px-2 text-text-primary">Chats</h3>
            <div className="flex gap-2">
               <CircleButton icon={<MessageCircle />} />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {messengerContacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setActiveChat(contact)}
                className="flex items-center gap-3 p-3 hover:bg-hover cursor-pointer transition-colors"
              >
                <div className="relative">
                  <img src={contact.photo} alt={contact.name} className="w-12 h-12 rounded-full border border-divider" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-text-primary">{contact.name}</p>
                  <p className="text-xs text-text-secondary truncate">Sent you a message</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-surface rounded-full shadow-lg flex items-center justify-center hover:bg-hover transition-all border border-divider group"
      >
        <MessageCircle className={`w-6 h-6 ${isOpen ? 'text-brand' : 'text-text-secondary'}`} />
      </button>
    </div>
  );
};

const ChatControl = ({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) => (
  <div onClick={onClick} className="w-6 h-6 rounded-full hover:bg-hover flex items-center justify-center cursor-pointer transition-colors">
    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 text-brand' })}
  </div>
);

const CircleButton = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-8 h-8 rounded-full bg-divider flex items-center justify-center cursor-pointer hover:bg-hover transition-colors group">
    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 text-text-primary transition-transform group-hover:scale-110' })}
  </div>
);
