import { Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useAIStore } from '../store';
import Button from '../components/Button';
import Input from '../components/Input';

export default function AIAssistant() {
  const { messages, isLoading, addMessage, clearMessages } = useAIStore();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    addMessage({
      role: 'user',
      content: input,
      timestamp: new Date(),
    });

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `I'm analyzing your request: "${input}". This is a demo response. In production, this would connect to an AI service.`,
        timestamp: new Date(),
      });
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-subtle rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-brand p-4 flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">AI Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-indigo-300 mb-3" />
            <p className="text-sm text-gray-500">Start a conversation to get AI-powered suggestions</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`
                  max-w-xs px-4 py-2 rounded-lg
                  ${msg.role === 'user'
                    ? 'bg-gradient-brand text-white rounded-br-none'
                    : 'bg-white border border-indigo-200 text-slate-900 rounded-bl-none'
                  }
                `}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-indigo-200 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse-soft"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse-soft animation-delay-200"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse-soft animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-indigo-200 p-3 bg-white space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ask AI for suggestions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="!m-0"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="!m-0 flex-shrink-0"
            size="md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs text-gray-500 hover:text-gray-700 w-full text-left"
          >
            Clear history
          </button>
        )}
      </div>
    </div>
  );
}
