import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Gamepad2, 
  Users, 
  Clock, 
  Globe, 
  ArrowRight, 
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Info,
  Library
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getGameRecommendation } from './services/gemini';
import { Game, RecommendationResponse } from './types';
import { GAMES_DATABASE } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [request, setRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'picker' | 'catalog'>('picker');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    setIsLoading(true);
    try {
      const result = await getGameRecommendation(request);
      setRecommendation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D2A26] font-sans selection:bg-[#E6D5B8] selection:text-[#2D2A26]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FDFCF9]/80 backdrop-blur-md border-b border-[#E6D5B8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#8B7E66] rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <span className="text-xl font-serif italic font-bold tracking-tight">GameAI</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setActiveTab('picker')}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#8B7E66]",
                  activeTab === 'picker' ? "text-[#8B7E66]" : "text-[#8B7E66]/60"
                )}
              >
                Подбор игры
              </button>
              <button 
                onClick={() => setActiveTab('catalog')}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#8B7E66]",
                  activeTab === 'catalog' ? "text-[#8B7E66]" : "text-[#8B7E66]/60"
                )}
              >
                Каталог
              </button>
              <button className="px-4 py-2 bg-[#8B7E66] text-white rounded-full text-sm font-medium hover:bg-[#766B56] transition-all shadow-sm">
                Войти
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#8B7E66]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full bg-[#FDFCF9] border-b border-[#E6D5B8] z-40 p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setActiveTab('picker'); setIsMenuOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F1E9] text-left"
              >
                <Sparkles size={18} className="text-[#8B7E66]" />
                <span className="font-medium">Подбор игры</span>
              </button>
              <button 
                onClick={() => { setActiveTab('catalog'); setIsMenuOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F1E9] text-left"
              >
                <Library size={18} className="text-[#8B7E66]" />
                <span className="font-medium">Каталог</span>
              </button>
              <div className="h-px bg-[#E6D5B8]/50 my-2" />
              <button className="w-full py-3 bg-[#8B7E66] text-white rounded-xl font-medium">
                Войти в личный кабинет
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'picker' ? (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-[#F5F1E9] text-[#8B7E66] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  AI-Powered Selection
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                  Найдите свою игру для <span className="italic text-[#8B7E66]">трансформации</span>
                </h1>
                <p className="text-lg text-[#8B7E66]/80 max-w-2xl mx-auto mt-6">
                  Опишите ваш запрос, текущее состояние или формат встречи, и наш ИИ подберет идеальную игру для глубоких изменений.
                </p>
              </motion.div>

              {/* Input Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-12 bg-white p-2 rounded-3xl shadow-2xl shadow-[#8B7E66]/10 border border-[#E6D5B8]/20"
              >
                <form onSubmit={handleSearch} className="relative">
                  <textarea
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="Например: Хочу игру про деньги и внутренние установки для группы из 4 человек, офлайн..."
                    className="w-full min-h-[160px] p-6 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder:text-[#8B7E66]/30"
                  />
                  <div className="flex items-center justify-between p-4 bg-[#FDFCF9] rounded-2xl">
                    <div className="flex gap-4 text-[#8B7E66]/60">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Users size={14} />
                        <span>Любое кол-во</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Globe size={14} />
                        <span>Онлайн/Офлайн</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !request.trim()}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 bg-[#8B7E66] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B7E66]/20",
                        (isLoading || !request.trim()) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#766B56] hover:scale-105 active:scale-95"
                      )}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Подобрать</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </section>

            {/* Results Section */}
            <AnimatePresence mode="wait">
              {recommendation && (
                <motion.section 
                  key="results"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#E6D5B8]/50" />
                    <h2 className="text-2xl font-serif font-bold italic">Ваши рекомендации</h2>
                    <div className="h-px flex-1 bg-[#E6D5B8]/50" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendation.recommendedGames.map((rec, idx) => {
                      const gameData = GAMES_DATABASE.find(g => g.id === rec.gameId);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group bg-white rounded-3xl p-8 border border-[#E6D5B8]/30 hover:border-[#8B7E66]/50 transition-all hover:shadow-2xl hover:shadow-[#8B7E66]/10 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-4">
                            <div className="bg-[#F5F1E9] text-[#8B7E66] text-[10px] font-bold px-2 py-1 rounded-full">
                              {rec.matchScore}% Match
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-[#F5F1E9] rounded-2xl flex items-center justify-center text-[#8B7E66] group-hover:bg-[#8B7E66] group-hover:text-white transition-colors">
                              <Gamepad2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold font-serif">{rec.title}</h3>
                            <p className="text-sm text-[#8B7E66]/80 leading-relaxed italic">
                              "{rec.reasoning}"
                            </p>
                            
                            {gameData && (
                              <div className="pt-4 space-y-3 border-t border-[#E6D5B8]/20">
                                <div className="flex items-center gap-2 text-xs text-[#8B7E66]/60">
                                  <Clock size={14} />
                                  <span>{gameData.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[#8B7E66]/60">
                                  <Users size={14} />
                                  <span>{gameData.players} игроков</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {gameData.themes.map(theme => (
                                    <span key={theme} className="px-2 py-1 bg-[#F5F1E9] text-[#8B7E66] text-[10px] uppercase font-bold rounded-md">
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <button className="w-full mt-6 py-3 border border-[#8B7E66]/20 rounded-xl text-sm font-bold hover:bg-[#8B7E66] hover:text-white transition-all flex items-center justify-center gap-2">
                              <span>Подробнее</span>
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* AI Advice Card */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#8B7E66] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Info size={32} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-2xl font-serif font-bold italic">Совет от ИИ-консультанта</h4>
                        <p className="text-lg text-white/80 leading-relaxed font-light">
                          {recommendation.advice}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif font-bold">Библиотека игр</h2>
              <p className="text-[#8B7E66]/60">Полный список доступных трансформационных игр</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {GAMES_DATABASE.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-8 border border-[#E6D5B8]/30 hover:shadow-xl transition-all"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-serif">{game.title}</h3>
                    <p className="text-sm text-[#8B7E66]/80 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#8B7E66]/60">
                        <Clock size={14} />
                        <span>{game.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8B7E66]/60">
                        <Users size={14} />
                        <span>{game.players} игроков</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {game.themes.map(theme => (
                          <span key={theme} className="px-2 py-1 bg-[#F5F1E9] text-[#8B7E66] text-[10px] uppercase font-bold rounded-md">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#E6D5B8]/30 py-12 bg-[#F5F1E9]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Sparkles size={16} />
            <span className="text-sm font-serif italic font-bold">GameAI</span>
          </div>
          <p className="text-xs text-[#8B7E66]/40 uppercase tracking-widest font-bold">
            © 2024 ИИ Подбор Трансформационной Игры. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
