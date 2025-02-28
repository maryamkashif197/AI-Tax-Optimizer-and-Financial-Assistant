import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ChatInterface({ chatId: initialChatId }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(initialChatId || null);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();
  
  // Load chat history when component mounts or chatId changes
  useEffect(() => {
    if (chatId) {
      fetchChatHistory(chatId);
    }
  }, [chatId]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchChatHistory = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      
      // Transform Firebase history format to our UI format
      const formattedMessages = data.history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0]
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get chat history in the format expected by the API
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [msg.content]
      }));
      
      // Get userId from session
      const userId = session?.user?.id || 'anonymous-user';
      
      // Call your NestJS API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history,
          chatId,
          userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Update chatId if a new chat was created
      if (data.chatId && !chatId) {
        setChatId(data.chatId);
        // Update URL without refreshing the page
        window.history.pushState({}, '', `/chat/${data.chatId}`);
      }
      
      // Add bot response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">NeuralPiggyBank.AI</h1>
        <p className="text-sm">Your Finance & Tax Recommendation Assistant</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Ask me anything about finance, taxes, or budgeting!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-12' 
                    : 'bg-white mr-12 border border-gray-200'
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'Mr. Neural'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-white p-3 rounded-lg mr-12 border border-gray-200">
                <div className="font-medium mb-1">Mr. Neural</div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about finance, taxes, budgeting..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}