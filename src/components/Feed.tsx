import React, { useState, useEffect } from 'react';
import { Video, Image, Smile, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Loader2 } from 'lucide-react';
import { useAuthStore, useFeedStore } from '../store/useStore';
import { Post } from '../types';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';

export const Feed: React.FC = () => {
  const { posts, setPosts, isLoading, setLoading } = useFeedStore();

  useEffect(() => {
    if (!db) return;

    setLoading(true);
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Post[];
      
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Feed error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setPosts, setLoading]);

  return (
    <div className="max-w-[560px] w-full mx-auto px-4 py-4 space-y-4">
      <Stories />
      <CreatePost />
      
      {isLoading && (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      )}

      {posts.length === 0 && !isLoading && (
        <div className="bg-surface rounded-lg shadow-sleek p-8 text-center text-text-secondary border border-divider/50">
          No posts yet. Be the first to share something!
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

const Stories = () => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
    {/* Creator Story */}
    <div className="min-w-[112px] h-[200px] bg-surface rounded-[10px] relative overflow-hidden group cursor-pointer flex-shrink-0 shadow-sleek border border-divider/50">
      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" alt="Me" className="w-full h-3/4 object-cover group-hover:scale-105 transition-transform" />
      <div className="absolute top-[70%] left-1/2 -translate-x-1/2 bg-brand rounded-full w-8 h-8 border-[3px] border-surface shadow-lg shadow-brand/20 flex items-center justify-center transition-transform group-hover:scale-110">
        <span className="text-background text-xl font-bold">+</span>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center font-semibold text-xs text-text-primary pt-2">Create story</div>
    </div>
    
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="min-w-[112px] h-[200px] bg-hover rounded-[10px] relative overflow-hidden group cursor-pointer flex-shrink-0 shadow-sleek border border-divider/50">
        <img src={`https://picsum.photos/seed/${i+15}/200/300`} alt="Story" className="w-full h-full object-cover group-hover:scale-105 transition-transform brightness-75" />
        <div className="absolute top-3 left-3 ring-[4px] ring-brand rounded-full overflow-hidden w-9 h-9 shadow-lg">
          <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-2 left-3 text-white font-semibold text-xs drop-shadow-md">Friend {i}</div>
      </div>
    ))}
  </div>
);

const CreatePost = () => {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || !db || !user || posting) return;
    
    setPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        author: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        content,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0
      });
      setContent('');
    } catch (error) {
      console.error("Posting error:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-sleek p-4 border border-divider/50">
      <div className="flex gap-2">
        <img src={user?.photoURL} alt="Me" className="w-10 h-10 rounded-full border border-divider" />
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePost()}
          disabled={posting}
          placeholder={`What's on your mind, ${user?.displayName?.split(' ')[0]}?`}
          className="bg-background h-10 px-4 rounded-full flex-1 hover:bg-hover focus:outline-none transition-colors text-[15px] disabled:opacity-50 text-text-primary placeholder:text-text-secondary"
        />
      </div>
      <div className="mt-3 pt-3 border-t border-divider flex items-center justify-around">
        <PostTool icon={<Video className="text-[#F3425F]" />} label="Live video" />
        <PostTool icon={<Image className="text-[#45BD62]" />} label="Photo/video" />
        <PostTool icon={<Smile className="text-[#F7B928]" />} label="Feeling/activity" />
      </div>
    </div>
  );
};

const PostTool = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2 hover:bg-hover flex-1 justify-center py-2 rounded-lg cursor-pointer transition-colors">
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
    <span className="text-text-secondary font-semibold text-sm">{label}</span>
  </div>
);

const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!db || !user) return;
    
    setIsLiked(!isLiked);
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likesCount: increment(isLiked ? -1 : 1)
      });
    } catch (error) {
      console.error("Like error:", error);
      setIsLiked(isLiked); // Rollback
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg shadow-sleek mb-4 border border-divider/50 overflow-hidden"
    >
      <div className="p-3 px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <img src={post.author.photoURL} alt="Author" className="w-10 h-10 rounded-full border border-divider" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] hover:underline cursor-pointer leading-tight text-text-primary">{post.author.displayName}</span>
              </div>
              <p className="text-[13px] text-text-secondary">{formatDate(post.createdAt)} • 🌍</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full hover:bg-hover flex items-center justify-center cursor-pointer transition-colors">
             <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
        </div>

        {/* Content */}
        <div className="text-[15px] leading-snug mb-3 text-text-primary">
          {post.content}
        </div>
      </div>

      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="border-y border-divider">
          <img src={post.mediaUrls[0]} alt="Post media" className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center gap-1">
           <div className="bg-brand rounded-full p-1 shadow-md shadow-brand/30"><ThumbsUp className="w-2.5 h-2.5 text-background fill-current" /></div>
           <span className="hover:underline cursor-pointer">{post.likesCount}</span>
        </div>
        <div className="flex gap-3">
          <span className="hover:underline cursor-pointer">{post.commentsCount} comments</span>
          <span className="hover:underline cursor-pointer">{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 border-t border-divider py-1 flex items-center justify-around text-text-secondary">
        <ActionButton 
          icon={<ThumbsUp className={isLiked ? "text-brand fill-current" : "text-text-secondary"} />} 
          label="Like" 
          active={isLiked}
          onClick={handleLike} 
        />
        <ActionButton icon={<MessageCircle className="text-text-secondary" />} label="Comment" />
        <ActionButton icon={<Share2 className="text-text-secondary" />} label="Share" />
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-2 hover:bg-hover flex-1 justify-center py-1.5 rounded-lg cursor-pointer transition-colors"
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    <span className={`font-semibold text-sm ${active ? 'text-brand' : 'text-text-secondary'}`}>{label}</span>
  </div>
);
