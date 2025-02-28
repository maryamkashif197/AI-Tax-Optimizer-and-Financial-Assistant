import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ChatInterface from '../../app/components/ChatInterface';
import Link from 'next/link';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Fetch user's chat history
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserChats();
    }
  }, [session]);
  
  const fetchUserChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/user/${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user chats');
      }
      
      const data = await response.json();
      setChats(data.chats);
    } catch (error) {
      console.error('Error fetching user chats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const startNewChat = () => {
    router.push('/chat/new');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Conversations</h1>
        <button 
          onClick={startNewChat}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Chat
        </button>
      </div>
      
      {status === 'loading' ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !session ? (
        <div className="text-center py-8">
          <p className="mb-4">Please sign in to view your chat history</p>
          <Link href="/api/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8">
          <p>You don't have any conversations yet</p>
          <button 
            onClick={startNewChat}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start a new conversation
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chats.map((chat) => {
            // Get first exchange for preview
            const firstUserMessage = chat.messages.find(msg => msg.role === 'user')?.parts[0] || 'New conversation';
            const preview = firstUserMessage.length > 50 ? firstUserMessage.substring(0, 50) + '...' : firstUserMessage;
            
            return (
              <Link 
                key={chat.id} 
                href={`/chat/${chat.id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="text-gray-500 text-sm mb-1">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </div>
                <div className="font-medium">{preview}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}