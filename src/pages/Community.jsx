import React, { useState } from 'react';
import { User, MessageCircle, Heart, Share2, Send } from 'lucide-react';

const Community = () => {
  // State for the list of posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Sarah & Max',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      time: '2h ago',
      content: 'Found a great new park on 5th street! Highly recommend for big dogs. 🐶🌳',
      likes: 12,
      comments: 4
    },
    {
      id: 2,
      user: 'Dr. Emily Vet',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      time: '4h ago',
      content: 'Reminder: Tick season is starting early this year. Check your pets after walks! 🕷️🚫',
      likes: 45,
      comments: 10
    }
  ]);

  // State for the new post input
  const [newPostContent, setNewPostContent] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      user: 'You', // In a real app, this would come from the logged-in user profile
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0
    };

    // Add new post to the TOP of the list
    setPosts([newPost, ...posts]);
    setNewPostContent(''); // Clear input
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', height: '100%' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Community Feed</h2>
        <p style={{ opacity: 0.6, marginTop: '5px' }}>Connect with other pet owners.</p>
      </div>

      {/* New Post Input Box */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '20px', 
        borderRadius: '16px', 
        marginBottom: '30px',
        border: '1px solid rgba(255,255,255,0.1)' 
      }}>
        <form onSubmit={handlePostSubmit}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy" 
              alt="You" 
              style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} 
            />
            <div style={{ flex: 1 }}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's happening with your pet?"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.1rem',
                  resize: 'none',
                  outline: 'none',
                  minHeight: '60px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                padding: '10px 24px', 
                borderRadius: '24px', 
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: newPostContent.trim() ? 1 : 0.6,
                pointerEvents: newPostContent.trim() ? 'auto' : 'none'
              }}
            >
              Post <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '5px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '20px', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {/* Post Header */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <img 
                src={post.avatar} 
                alt={post.user} 
                style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.user}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{post.time}</div>
              </div>
            </div>

            {/* Post Content */}
            <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '15px', color: 'rgba(255,255,255,0.9)' }}>
              {post.content}
            </p>

            {/* Post Actions */}
            <div style={{ display: 'flex', gap: '25px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={18} /> {post.likes}
              </button>
              <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={18} /> {post.comments}
              </button>
              <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Community;