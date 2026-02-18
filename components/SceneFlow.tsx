
import React, { useState } from 'react';
import { Scene, Character } from '../types';
import { generateCartoonScene } from '../geminiService';
import { Download, Loader2, Send, Film, AlertCircle, Play } from 'lucide-react';

interface SceneFlowProps {
  scenes: Scene[];
  characters: Character[];
  onAddScene: (scene: Scene) => void;
  onApiError: (error: any) => void;
  onChangeKey: () => void;
}

export const SceneFlow: React.FC<SceneFlowProps> = ({ scenes, characters, onAddScene, onApiError, onChangeKey }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt || characters.length === 0) return;
    setIsGenerating(true);
    setLocalError(null);
    
    const newSceneId = Math.random().toString(36).substr(2, 9);
    
    try {
      const videoUrl = await generateCartoonScene(prompt, characters);
      onAddScene({
        id: newSceneId,
        prompt,
        videoUrl,
        status: 'completed',
        timestamp: Date.now(),
      });
      setPrompt('');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.message || String(err);
      
      if (errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("403")) {
        setLocalError("Toegang geweigerd. Neem contact op met de systeembeheerder.");
        onApiError(err);
      } else if (errorMsg.includes("Requested entity was not found")) {
        setLocalError("Systeemfout: De AI service is tijdelijk niet beschikbaar.");
        onApiError(err);
      } else {
        setLocalError("Er is iets misgegaan bij het maken van de video. Probeer het opnieuw.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl cartoon-border cartoon-shadow flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={characters.length === 0 ? "Maak eerst 3D modellen..." : "Beschrijf de volgende filmscène..."}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-medium disabled:opacity-50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating || characters.length === 0}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Film className="w-5 h-5" />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt || characters.length === 0}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Rendering...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Regisseer Scène</span>
            </>
          )}
        </button>
      </div>

      {localError && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3 text-red-700 font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{localError}</p>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center animate-pulse">
          <div className="relative mb-6">
             <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
                <Film className="w-12 h-12 text-indigo-400" />
             </div>
             <Loader2 className="w-24 h-24 text-indigo-600 animate-spin absolute top-0 left-0" />
          </div>
          <h3 className="text-2xl font-black text-indigo-900 mb-2">3D Animatie wordt gerenderd</h3>
          <p className="text-gray-500 text-center max-w-sm font-medium">We bouwen je Pixar-wereld frame voor frame op. De belichting en effecten worden nu toegepast!</p>
        </div>
      )}

      <div className="space-y-16">
        {scenes.map((scene, index) => (
          <div key={scene.id} className="relative group">
            {index < scenes.length - 1 && (
              <div className="absolute left-1/2 bottom-[-4.5rem] h-20 w-1 bg-indigo-100 -translate-x-1/2"></div>
            )}
            
            <div className="bg-white rounded-[2.5rem] overflow-hidden cartoon-border cartoon-shadow transition-all duration-300 hover:scale-[1.01]">
              <div className="aspect-video relative bg-slate-900 group/video">
                <video 
                  src={scene.videoUrl} 
                  controls 
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-8 flex justify-between items-center bg-white border-t-2 border-gray-100">
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-tighter shadow-sm">
                      SCÈNE {scenes.length - index}
                    </span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      {new Date(scene.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-800 leading-tight">"{scene.prompt}"</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={scene.videoUrl}
                    download={`tooncraft-pixar-${scene.id}.mp4`}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    <span>OPSLAAN</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {scenes.length === 0 && !isGenerating && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-300">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Play className="w-16 h-16 opacity-10" />
            </div>
            <p className="text-2xl font-black text-gray-400 mb-2 uppercase tracking-tighter">De Pixar-studio is klaar</p>
            <p className="font-bold text-gray-400 opacity-60">Maak je 3D cast en begin met filmen!</p>
          </div>
        )}
      </div>
    </div>
  );
};
