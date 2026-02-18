
import React, { useState } from 'react';
import { Character } from '../types';
import { generateCharacterImage } from '../geminiService';
import { Plus, User, Loader2, Sparkles, X, ChevronRight } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  onAddCharacter: (character: Character) => void;
  onRemoveCharacter: (id: string) => void;
  onApiError: (error: any) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ characters, onAddCharacter, onRemoveCharacter, onApiError }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!name || !description) return;
    setIsGenerating(true);
    try {
      const { base64, url } = await generateCharacterImage(`${name}: ${description}`);
      onAddCharacter({
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        imageUrl: url,
        base64
      });
      setName('');
      setDescription('');
      setIsAdding(false);
    } catch (error: any) {
      console.error(error);
      onApiError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 mb-8 cartoon-border cartoon-shadow">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg rotate-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">PIXAR CAST</h2>
            <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-1">3D Personages voor je film</p>
          </div>
        </div>
        
        {!isAdding && characters.length > 0 && (
           <button 
             onClick={() => setIsAdding(true)}
             className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md"
           >
             <Plus className="w-5 h-5" />
             EXTRA 3D MODEL
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Existing Characters */}
        {characters.map((char) => (
          <div key={char.id} className="relative group animate-float">
            <div className="aspect-square bg-slate-50 rounded-[2rem] overflow-hidden cartoon-border group-hover:rotate-2 transition-transform duration-300">
              <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => onRemoveCharacter(char.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cartoon-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="font-black text-gray-900 text-lg uppercase tracking-tighter">{char.name}</p>
            </div>
          </div>
        ))}

        {/* Add Character UI */}
        {isAdding ? (
          <div className="col-span-1 sm:col-span-2 bg-indigo-50 rounded-[2.5rem] p-6 cartoon-border relative animate-in fade-in slide-in-from-bottom-4">
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute -top-3 -right-3 p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 cartoon-border shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-indigo-900 mb-4 uppercase text-sm">3D Personage Ontwerpen</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hoe heet je held?"
                className="w-full px-5 py-3 bg-white border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Beschrijf uiterlijk (bijv. 'een schattige robot met grote ogen')"
                className="w-full px-5 py-3 bg-white border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors h-24 resize-none font-medium"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                onClick={handleCreate}
                disabled={isGenerating || !name || !description}
                className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>RENDERING 3D...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>MODEL GENEREREN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          characters.length < 10 && (
            <button
              onClick={() => setIsAdding(true)}
              className="group flex flex-col items-center justify-center aspect-square bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center cartoon-border shadow-sm group-hover:scale-110 transition-transform mb-4">
                <Plus className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-tighter">Voeg Model Toe</p>
            </button>
          )
        )}

        {characters.length === 0 && !isAdding && (
          <div className="md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-12 text-gray-400 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <User className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-xl font-black uppercase tracking-tighter">De cast is nog leeg</p>
            <p className="font-bold opacity-60">Ontwerp je eerste Pixar-model!</p>
          </div>
        )}
      </div>
    </div>
  );
};
