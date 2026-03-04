/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Monitor, Shield, Zap, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your RoutineAI assistant. Ask me about routines, schedules, or productivity tips. (Try: \"optimize my morning\" or \"study plan\")",
      sender: 'assistant',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scheduleTasks, setScheduleTasks] = useState<string[]>([]);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Use the provided API key directly to ensure connection
      const apiKey = process.env.AIML_API_KEY && process.env.AIML_API_KEY !== "undefined" 
        ? process.env.AIML_API_KEY 
        : 'd54fc32990774773bcad3838382074b8';

      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it",
          messages: [
            {
              role: "user",
              content: `System: You are RoutineAI Assistant, a specialized AI coach for productivity, daily routines, health, and time management. Your goal is to help users build better habits and schedules. Keep your responses concise, encouraging, and practical. Use emojis where appropriate to maintain a friendly tech-forward persona.\n\nUser: ${currentInput}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (error: any) {
      console.error("AIML API Error:", error);
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        text: `🤖 Connection to RoutineAI core lost: ${error.message || 'Please check your network'}.`,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const generateSchedule = (type: 'default' | 'work' | 'fitness' | 'creative' = 'default') => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      
      setIsGeneratingSchedule(true);
      setScheduleTasks(["[INFO] Analyzing user habits...", "[INFO] Accessing RoutineAI core..."]);
      
      // Scroll to the schedule box
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
      
      const scheduleSets = {
      default: [
        "🤖{start6:00 AM🕕 & over7:00AM🕖} - weakup:lunch for health life eat (apple🍎 ,🍌banan,watermelon🍉,pomegranates🔴,soaked nut💧:-(like almonds🫘)describe 🎭with ai assistant=🎭on an empty stomach in the morning.these fruits are easily digestible,detoxify the body,and provide energy.guava is also a good choise as it is rich in fiber🎭)",
        "🤖{start8:00 AM🕗 & over9:00AM🕘} - yoga🧘 & meditmeditation 🧘Y:(1.Hatha Yoga,2.Vinyasa Yoga,3.Iyengar Yoga,4.Ashtanga Yoga,5.Yin Yoga)& M:(1.Mindfulness Meditation,2.Transcendental Meditation,3.Transcendental Meditation,4.Body Scan Meditation,5.Guided Meditation,) describe🎭 with ai assistance=🧘♀️ Benefits of Yoga Yoga combines physical postures, breathing techniques, and relaxation. Its benefits include: a.Improves flexibility – Stretches muscles and increases joint mobility. b.Builds strength– Supports muscle tone and core stability. c.Better posture – Helps align the spine and reduce back pain. d.Reduces stress – Calms the nervous system through controlled breathing. 🧠 Benefits of Meditation Meditation focuses on mental clarity and emotional balance. Its benefits include: a.Reduces anxiety and stress – Helps calm racing thoughts. b.Improves focus and concentration – Trains the mind to stay present. c.Enhances emotional control– Helps manage anger and mood swings. d.Increases self-awareness – Encourages understanding of thoughts and feelings.",
        "🤖{10:00 AM 🕙& over11:00🕚} - Gym🏋️♂️:common gym exercise (💪 Chest) =1. Bench Press|🔁 20–30 reps| 2. Push-ups|🔁 10–20 reps| 3. Chest Fly|🔁 20–30 reps| 4. Incline Dumbbell Press|🔁 10–15 reps| (💪 Back)= 1. Pull-ups|🔁 20–40 reps| 2. Lat Pulldown|🔁 20–30 reps| 3. Seated Row|🔁 10–15 reps| 4. Deadlift|🔁 20–30 reps| (💪)= Legs 1. Squats|🔁 20–25 reps| 2. Lunges|🔁 10–15 reps| 3. Leg Press|🔁 20–30 reps| 4. Leg Curl|🔁 20–30 reps| ( 💪 Shoulder)= 1. Shoulder Press|🔁 10–15 reps| 2. Lateral Raises|🔁 20–25 reps| 3. Front Raises|🔁 10–15 reps| 4. Shrugs|🔁 20–25 reps| (💪 Armsें) 1. Biceps Curl|🔁 10–15 reps| 2. Triceps Dips |🔁 20–25 reps|3. Triceps Pushdowns|🔁 10–15 reps| 4. Hammer Curl|🔁 20–25 reps| ",
        "🤖{11:30🕙 AM & over2:00pm🕙} - collge time🏢:describe with ai assistant🤖=🎒 College Bag Checklist Essentials to carry daily:notebooks & textbooks– only for the day’s classes to keep your bag light.Stationery– pens, pencils, eraser, highlighters in a small pencil case. College ID & wallet– including some cash and cards. Water bottle– stay hydrated throughout the day. Phone & charger – keep on silent during class. optional– mask, sanitizer, small snack. > Tip:Place heavier books at the bottom and lighter items on top for better organization. --- ⏰ Time Management for Arriving on Time 1. **t an alarm** – enough time to get ready without rushing. 2. **Wake up early** – gives you buffer time and avoids traffic. 3. **Check your commute route** – know your estimated travel time. 4. **Leave early** – 10–15 minutes buffer to avoid being late. ## 📝 Morning Routine 1. Wake up → wash up → have a healthy breakfast. 2. Check your bag → ensure you have all essentials (books, notebooks, ID, wallet). 3. Wear comfortable, appropriate clothing and shoes",
        "🤖{2:30 pm🕙 & over3:30pm🕙} -power nap break💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤💤don't any thin...s💤💤💤💤",
        "🤖 {start:4:00 PM🕙 & 6:30🕙}-deep study:Deep Study Routine (4 PM – 6 PM) Start at 4:00 PM – Concept Study Pick one subject or topic. Read carefully, take notes, and write in your own words what you understand. Use diagrams, examples, or explain the topic aloud to yourself. Take a Short Break at 4:50 PM Stand up, stretch, drink water, or relax your eyes for 5–10 minutes. 5:00 PM – Practice / Application Solve problems, answer questions, or do exercises related to what you just studied. This reinforces understanding and trains your memory. 5:50 PM – Quick Revision Summarize the key points of both concept and practice in a few sentences. Ask yourself: “Do I really understand this?” If not, review the unclear parts quickly before finishing. 💡 Extra Tips for Deep Study: Focus on one or two subjects only during this 2-hour session. Keep all distractions away – phone, social media, TV. Use active learning – reading alone is not enough; always write, speak, or solve. Track what you completed so you feel progress",
        "🤖{start7:00 pm🕙 & 8:30🕙}-👻break time  don't do anything🤩",
        "🤖{start09:00 PM🕙 & 10:00🕙}- diner🍜🍛🍝🤖=eating food slowly don't demand anything foods  🤕",
        "🤖{start11:00 pm🕙 & 5:00🕙}-sleeping 😴 time ⌚ "
      ],
      work: [
        "🤖{7:00 AM} - Early Bird Focus: Reviewing top 3 goals for the day. ☕",
        "🤖{8:30 AM} - Commute/Prep: Listening to industry podcasts or audiobooks.",
        "🤖{9:00 AM - 12:00 PM} - Deep Work Block: No meetings, no distractions. Core project development.",
        "🤖{12:00 PM - 1:00 PM} - Networking Lunch: Connecting with peers or reading industry news.",
        "🤖{1:00 PM - 3:00 PM} - Collaborative Session: Team meetings, syncs, and feedback loops.",
        "🤖{3:30 PM} - Admin/Emails: Clearing the inbox and planning for tomorrow.",
        "🤖{5:00 PM} - Shutdown Ritual: Reviewing accomplishments and closing all tabs.",
        "🤖{7:00 PM} - Personal Growth: Learning a new skill or hobby.",
        "🤖{10:30 PM} - Rest: Preparing for tomorrow's success."
      ],
      fitness: [
        "🤖{6:30 AM} - Hydration & Mobility: 500ml water + 10 min dynamic stretching.",
        "🤖{7:00 AM} - Cardio Blast: 30 min HIIT or steady-state run. 🏃‍♂️",
        "🤖{8:30 AM} - Protein-Rich Breakfast: Eggs, avocado, and whole grains.",
        "🤖{12:30 PM} - Active Recovery: 15 min walk after lunch.",
        "🤖{5:30 PM} - Strength Training: Focus on compound movements. 🏋️‍♀️",
        "🤖{7:00 PM} - Post-Workout Nutrition: Lean protein + complex carbs.",
        "🤖{9:00 PM} - Foam Rolling & Recovery: Improving circulation and reducing soreness.",
        "🤖{10:00 PM} - Deep Sleep: Crucial for muscle repair."
      ],
      creative: [
        "🤖{8:00 AM} - Morning Pages: 3 pages of stream-of-consciousness writing. ✍️",
        "🤖{9:30 AM} - Creative Input: Visiting a gallery, reading poetry, or listening to new music.",
        "🤖{11:00 AM - 2:00 PM} - The Flow State: Uninterrupted creation time. 🎨",
        "🤖{2:30 PM} - Nature Walk: Seeking inspiration in the environment.",
        "🤖{4:00 PM} - Technical Practice: Refining craft and technique.",
        "🤖{6:00 PM} - Community: Engaging with other artists or sharing work.",
        "🤖{8:00 PM} - Reflection: Journaling about the creative process.",
        "🤖{11:00 PM} - Dream State: Resting for tomorrow's vision."
      ]
    };

    const tasks = scheduleSets[type];

    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < tasks.length) {
        setScheduleTasks((prev) => [...prev, tasks[i]]);
        i++;
      } else {
        setScheduleTasks((prev) => [...prev, "[SUCCESS] Schedule Optimized for Today daily RoutineAI."]);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 600);

    // Notify chat
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: Message = {
        id: Date.now().toString(),
        text: "✨ I've generated a complete daily schedule for you. You can see it in the terminal below. Ask me about any part of it!",
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
    } catch (err) {
      console.error("Schedule generation error:", err);
      setIsGeneratingSchedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-700"></div>
          RoutineAI
        </div>
        <div className="hidden md:flex gap-8 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <button className="hover:text-white transition-colors">leader_Pranav_Thakre</button>
          <button className="hover:text-white transition-colors">developer_amaankhan</button>
        </div>
        <button 
          onClick={() => setShowTeamPopup(true)}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          NextGen Coders
        </button>
      </nav>

      {/* Team Popup Modal */}
      <AnimatePresence>
        {showTeamPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTeamPopup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 border border-purple-500/30 glow-purple"
            >
              <button 
                onClick={() => setShowTeamPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 flex items-center justify-center">
                  <Users className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold gradient-text">NextGen Coders</h2>
                  <p className="text-gray-400 text-sm">The team behind RoutineAI</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">Team Leader</p>
                  <p className="text-xl font-semibold">Pranav Thakre</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">Member 1</p>
                    <p className="font-medium">Aditya Baisware</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">Member 2</p>
                    <p className="font-medium">Amaan Khan</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">Member 3</p>
                    <p className="font-medium">Pavan Bathinwar</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">Member 4</p>
                    <p className="font-medium">Tanmay Burghate</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
                  <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Mentor</p>
                  <p className="text-lg font-semibold">Geeta Bhandarkar</p>
                </div>
              </div>

              <button 
                onClick={() => setShowTeamPopup(false)}
                className="w-full mt-8 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
        {/* Hero Section */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
        >
          Building the <br /> <span className="gradient-text">Future of Routine</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg mb-10 max-w-xl"
        >
          The first decentralized platform for creating, managing, and automating your daily life with AI agents.
        </motion.p>
          
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-16"
        >
          <button 
            onClick={() => generateSchedule('default')}
            className="bg-pink-600 px-8 py-4 rounded-xl font-bold glow-purple hover:scale-105 transition-transform active:scale-95"
          >
            Generate The Schedule
          </button>
          <button 
            onClick={() => {
              const types: ('work' | 'fitness' | 'creative')[] = ['work', 'fitness', 'creative'];
              const randomType = types[Math.floor(Math.random() * types.length)];
              generateSchedule(randomType);
            }}
            className="glass px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors"
          >
            RoutineAI
          </button>
        </motion.div>

        {/* AI Assistant Chat */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          id="assistant-chat" 
          className="w-full max-w-2xl glass p-5 mb-12 text-left border border-purple-500/30 glow-purple transition-all duration-300 hover:border-purple-400/50"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                RoutineAI Assistant
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">online</span>
              </h3>
              <p className="text-xs text-gray-400">Your personal AI coach · fully interactive</p>
            </div>
          </div>

          <div className="chat-messages-scroll space-y-3 max-h-64 overflow-y-auto pr-2 text-sm">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-purple-700/40 flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      <Bot size={12} />
                    </div>
                  )}
                  <div className={`${msg.sender === 'assistant' ? 'chat-bubble-assistant text-purple-200' : 'chat-bubble-user text-gray-200'} p-3 max-w-[85%]`}>
                    <span>{msg.text}</span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-600/40 flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      <User size={12} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <div className="flex items-center gap-2 mt-3 text-sm text-purple-300/70">
                <div className="w-5 h-5 rounded-full bg-purple-800/50 flex items-center justify-center">
                  <Bot size={12} />
                </div>
                <div className="assistant-typing">RoutineAI is thinking</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-4 flex items-center gap-2 bg-black/40 rounded-full border border-white/10 p-1 pl-4">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask RoutineAI..." 
              className="bg-transparent text-sm w-full outline-none text-gray-300 py-2" 
            />
            <button 
              onClick={handleSendMessage}
              className="bg-purple-600 p-2 rounded-full px-4 text-xs font-medium hover:bg-purple-700 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 text-left">* Now fully interactive — powered by AIML API (Gemma 3B)</p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20">
          <div className="glass p-8 text-left hover:border-pink-500/50 transition-colors group">
            <Shield className="mb-4 text-pink-500 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">100% AI Ownership</h3>
            <p className="text-gray-500">Your data, your schedule, fully encrypted and decentralized.</p>
          </div>
          <div className="glass p-8 text-left border-pink-500 glow-purple group">
            <Monitor className="mb-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Enterprise-Grade Performance</h3>
            <p className="text-gray-500">Scalable AI infrastructure for high-demand task management.</p>
          </div>
          <div className="glass p-8 text-left hover:border-pink-500/50 transition-colors group">
            <Zap className="mb-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Hybrid Compute</h3>
            <p className="text-gray-500">Combining cloud power with local privacy for seamless routines.</p>
          </div>
        </div>

        {/* Schedule Demo Box */}
        <AnimatePresence>
          {isGeneratingSchedule && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl glass p-6 mb-20 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 ml-2">RoutineAI Agent v1.0</span>
                </div>
                <button 
                  onClick={() => {
                    setIsGeneratingSchedule(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                  }}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Zap size={14} className="inline mr-1" /> Close
                </button>
              </div>
              <div className="font-mono text-sm text-green-400 space-y-1">
                <div className="animate-pulse">{">"} Initializing AI Scheduler...</div>
                {scheduleTasks.map((task, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {">"} <span className="text-white">{task}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} RoutineAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
