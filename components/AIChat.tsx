
import React, { useState, useRef, useEffect } from 'react';
import { generateLessonResponse, solveProblemFromImage } from '../services/geminiService';
import { UserProfile, Subject, ChatMessage } from '../types';

interface AIChatProps {
  user: UserProfile;
  initialSubject: Subject;
}

const AIChat: React.FC<AIChatProps> = ({ user, initialSubject }) => {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input, imageBase64?: string) => {
    if (!text.trim() && !imageBase64) return;

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string | undefined;
      
      if (imageBase64) {
        response = await solveProblemFromImage(imageBase64, text || "What is in this image?", user.standard);
      } else {
        const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
        response = await generateLessonResponse(text, user.standard, user.board, subject, history);
      }

      const aiMsg: ChatMessage = { role: 'model', content: response || "I'm sorry, I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Could not access camera");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
        
        handleSend("Please explain this problem from the image:", base64);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg">🤖</div>
            <div>
              <h3 className="font-bold text-slate-800">GuruAI ({subject})</h3>
              <p className="text-xs text-indigo-600 font-medium">Online • Helping with {user.standard} syllabus</p>
            </div>
          </div>
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="text-sm border-none bg-transparent font-semibold text-slate-600 focus:ring-0"
          >
            <option>Mathematics</option>
            <option>Science</option>
            <option>Social Science</option>
            <option>English</option>
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">👋</div>
              <h4 className="text-xl font-bold text-slate-700">What would you like to learn?</h4>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">I can help with homework, explain concepts from your NCERT books, or even solve math problems from a photo!</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['Explain Pythagoras Theorem', 'Newton\'s Third Law', 'The French Revolution summary'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="text-sm px-4 py-2 rounded-full border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Camera Overlay */}
        {isCameraActive && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full rounded-xl" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-6 flex gap-4">
              <button onClick={() => setIsCameraActive(false)} className="bg-white/20 text-white px-6 py-2 rounded-full backdrop-blur-md">Cancel</button>
              <button onClick={captureImage} className="bg-white text-black px-8 py-2 rounded-full font-bold shadow-xl">Capture Problem</button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <button 
              onClick={startCamera}
              className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
              title="Snap a photo of your book"
            >
              📷
            </button>
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Type your question here (e.g., 'Solve x² + 5x + 6 = 0')"
              className="flex-1 bg-transparent border-none focus:ring-0 py-3 resize-none max-h-32"
            />
            <button
              disabled={isLoading || !input.trim()}
              onClick={() => handleSend()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🚀
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            Ask me anything about your chapters. I'm here to help you ace your exams!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
