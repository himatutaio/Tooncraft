
import React, { useState, useEffect, useCallback } from 'react';
import { Character, Scene } from './types';
import { CharacterList } from './components/CharacterList';
import { SceneFlow } from './components/SceneFlow';
import { Palette, Github, Key, Info, Wand2, AlertTriangle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isKeySelected, setIsKeySelected] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const checkKeyStatus = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    } else {
      setIsKeySelected(true); 
    }
  }, []);

  useEffect(() => {
    checkKeyStatus();
  }, [checkKeyStatus]);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsKeySelected(true);
      setGlobalError(null);
    }
  };

  const addCharacter = (char: Character) => setCharacters(prev => [...prev, char]);
  const removeCharacter = (id: string) => setCharacters(prev => prev.filter(c => c.id !== id));
  const addScene = (scene: Scene) => setScenes(prev => [scene, ...prev]);

  const handleApiError = (error: any) => {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("403") || errorMsg.includes("Requested entity was not found")) {
      setGlobalError("Je API sleutel heeft onvoldoende rechten voor Veo. Gebruik een sleutel uit een project met facturering.");
    } else {
      setGlobalError("Er is een fout opgetreden bij de verbinding met de AI studio.");
    }
  };

  if (!isKeySelected) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 cartoon-border cartoon-shadow text-center">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-6 shadow-xl">
            <Palette className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">TOONCRAFT</h1>
          <p className="text-gray-600 mb-10 font-bold leading-relaxed">
            Maak je eigen geanimeerde verhalen met de kracht van AI.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenKeySelector}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02]"
            >
              <Key className="w-6 h-6" />
              SELECTEER API SLEUTEL
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-black hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              <Info className="w-4 h-4" />
              Info over facturering
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#fafbff]">
      <header className="bg-white/70 backdrop-blur-md border-b-4 border-indigo-50 py-4 px-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tighter">TOONCRAFT <span className="text-indigo-500 italic">STUDIO</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleOpenKeySelector}
              className="flex items-center gap-2 px-4 py-2 text-indigo-900 font-black text-xs bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <Key className="w-4 h-4" />
              SLEUTEL
            </button>
            <a href="https://github.com" target="_blank" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {globalError && (
          <div className="mb-10 p-8 bg-red-50 border-4 border-red-100 rounded-[2.5rem] flex flex-col items-center gap-6 text-center animate-in zoom-in-95">
            <div className="flex items-center gap-4 text-red-600">
              <AlertTriangle className="w-10 h-10" />
              <p className="font-black text-xl tracking-tight leading-tight uppercase">{globalError}</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
            >
              HERSTEL API SLEUTEL
            </button>
          </div>
        )}

        {/* Characters Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-2 bg-yellow-400 text-black font-black text-sm rounded-xl transform -rotate-3 shadow-sm">1</div>
             <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">De Cast Samenstellen</h2>
          </div>
          <CharacterList 
            characters={characters} 
            onAddCharacter={addCharacter} 
            onRemoveCharacter={removeCharacter}
            onApiError={handleApiError}
          />
        </section>

        {/* Scenes Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-2 bg-indigo-500 text-white font-black text-sm rounded-xl transform rotate-3 shadow-sm">2</div>
             <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Verhaal Regisseren</h2>
          </div>
          <SceneFlow 
            scenes={scenes} 
            characters={characters} 
            onAddScene={addScene}
            onApiError={handleApiError}
            onChangeKey={handleOpenKeySelector}
          />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 mt-20 pb-10 border-t-4 border-indigo-50 pt-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-200">Powered by</p>
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-black text-sm text-indigo-900 tracking-tight">GEMINI 3.1 & VEO</span>
            </div>
          </div>
          <p className="text-xs font-bold text-indigo-200 uppercase">© 2024 ToonCraft Studio — Alleen voor Creatief Gebruik</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
