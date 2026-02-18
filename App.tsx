
import React, { useState } from 'react';
import { Character, Scene } from './types';
import { CharacterList } from './components/CharacterList';
import { SceneFlow } from './components/SceneFlow';
import { generateTextContent } from './geminiService';
import { 
  Github, Info, AlertTriangle, Sparkles, 
  GraduationCap, Heart, LifeBuoy, BookOpen, X, 
  CheckCircle2, Send, Copy, Loader2, ClipboardList, Layers
} from 'lucide-react';

const EducationModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  type: 'lesbrief' | 'emotie' | 'voorbeeld' | 'situatie' | 'hulp'
}> = ({ isOpen, onClose, title, type }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setInput('');
      setResult('');
      setIsCopied(false);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!input && type !== 'hulp') return;
    setIsLoading(true);
    try {
      let systemInstruction = "";
      let prompt = "";

      switch(type) {
        case 'lesbrief':
          systemInstruction = "Je bent een onderwijs-expert. Schrijf een gestructureerde lesbrief voor een basisschool docent gebaseerd op een thema. Gebruik koppen zoals: Doel, Benodigdheden, Kernactiviteit (met ToonCraft) en Reflectie.";
          prompt = `Genereer een lesbrief over het thema: ${input}`;
          break;
        case 'emotie':
          systemInstruction = "Je bent een pedagoog. Genereer een lijst met 5 'Emotie Kaarten'. Elke kaart heeft een Naam en een korte Omschrijving hoe je deze emotie kunt verwoorden in een AI-prompt (bijv: 'Blijheid: Gebruik woorden als gouden licht, glimlach, felle kleuren').";
          prompt = `Maak emotie kaarten voor de doelgroep basisschool over: ${input}`;
          break;
        case 'situatie':
          systemInstruction = "Je bent een coach voor het basisonderwijs. Genereer 3 scenario's/situaties die leerlingen kunnen naspelen in ToonCraft om sociaal-emotionele vaardigheden te oefenen.";
          prompt = `Maak situatiekaarten over: ${input}`;
          break;
      }

      const text = await generateTextContent(systemInstruction, prompt);
      setResult(text);
    } catch (err) {
      setResult("Oeps, er ging iets mis bij het genereren. Neem contact op met de systeembeheerder.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (type === 'hulp') {
      return (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
            <h4 className="font-black text-indigo-900 mb-2 uppercase text-sm">Stap 1: De Cast</h4>
            <p className="text-gray-600 font-medium">Bedenk personages (bijv. 'Pietje de Robot' of 'Juf Kim'). Geef ze een uiterlijk. De AI maakt hier 3D modellen van in Pixar-stijl.</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
            <h4 className="font-black text-indigo-900 mb-2 uppercase text-sm">Stap 2: De Regie</h4>
            <p className="text-gray-600 font-medium">Typ onderaan wat er gebeurt. Bijvoorbeeld: 'Pietje is verdrietig omdat hij geen olie meer heeft'. De AI genereert een filmpje met jouw personages.</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
            <h4 className="font-black text-indigo-900 mb-2 uppercase text-sm">Stap 3: Bespreken</h4>
            <p className="text-gray-600 font-medium">Download het filmpje en laat het op het digibord zien. Bespreek met de klas: Wat gebeurt hier? Hoe kunnen we dit oplossen?</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              type === 'lesbrief' ? "Bijv: Pesten op het plein..." :
              type === 'emotie' ? "Bijv: Omgaan met boosheid..." :
              "Beschrijf het thema voor de kaarten..."
            }
            className="w-full p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-medium h-32 resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !input}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {result && (
          <div className="relative bg-white border-2 border-indigo-100 rounded-2xl p-6 max-h-64 overflow-y-auto shadow-inner">
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              title="Kopieer tekst"
            >
              {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="prose prose-sm prose-indigo whitespace-pre-wrap font-medium text-gray-700">
              {result}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getIcon = () => {
    switch(type) {
      case 'lesbrief': return <BookOpen className="w-10 h-10 text-indigo-600" />;
      case 'emotie': return <Heart className="w-10 h-10 text-pink-500" />;
      case 'situatie': return <ClipboardList className="w-10 h-10 text-yellow-500" />;
      case 'hulp': return <Info className="w-10 h-10 text-cyan-500" />;
      default: return <Sparkles className="w-10 h-10 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] cartoon-border cartoon-shadow overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-50 p-8 border-b-2 border-indigo-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-indigo-100">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter leading-none">{title}</h3>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Creator Tool</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-indigo-400 hover:text-indigo-950">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          {renderContent()}
          {type !== 'hulp' && !result && !isLoading && (
            <p className="mt-4 text-xs text-center text-gray-400 font-bold uppercase tracking-widest">Voer een thema in om de AI te starten</p>
          )}
          <button 
            onClick={onClose}
            className="w-full py-4 mt-8 bg-indigo-950 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            SLUITEN
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: 'lesbrief' | 'emotie' | 'voorbeeld' | 'situatie' | 'hulp';
  }>({
    isOpen: false,
    title: '',
    type: 'hulp'
  });

  const openEducationModal = (type: 'lesbrief' | 'emotie' | 'voorbeeld' | 'situatie' | 'hulp', title: string) => {
    setModalState({ isOpen: true, type, title });
  };

  const addCharacter = (char: Character) => setCharacters(prev => [...prev, char]);
  const removeCharacter = (id: string) => setCharacters(prev => prev.filter(c => c.id !== id));
  const addScene = (scene: Scene) => setScenes(prev => [scene, ...prev]);

  const handleApiError = (error: any) => {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("403") || errorMsg.includes("Requested entity was not found")) {
      setGlobalError("Toegang geweigerd. Neem contact op met de beheerder van de website.");
    } else {
      setGlobalError("Er is een fout opgetreden bij het verbinden met de studio.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbff]">
      <EducationModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        type={modalState.type}
      />

      <header className="bg-white/80 backdrop-blur-md border-b-4 border-indigo-50 py-4 px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-indigo-900 tracking-tighter leading-none">TOONCRAFT</h1>
              <span className="text-[10px] font-black text-white bg-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Basisschool Editie</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => openEducationModal('situatie', 'Maak Situatie Kaarten')}
              className="text-sm font-black text-indigo-900/60 hover:text-indigo-600 transition-colors uppercase tracking-tighter"
            >
              Situatie Kaarten
            </button>
            <button 
              onClick={() => openEducationModal('hulp', 'Hoe werkt ToonCraft?')}
              className="text-sm font-black text-indigo-900/60 hover:text-indigo-600 transition-colors uppercase tracking-tighter"
            >
              Hulp voor Docenten
            </button>
          </nav>

          <div className="w-12 h-12 md:hidden" /> {/* Spacer for mobile layout symmetry */}
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-indigo-950 mb-4 tracking-tight">Breng situaties tot leven</h2>
          <p className="text-gray-500 font-bold leading-relaxed">De Pixar-studio speciaal voor de klas. Bespreek emoties en situaties door ze samen met je leerlingen te verfilmen.</p>
        </div>

        {globalError && (
          <div className="mb-10 p-8 bg-red-50 border-4 border-red-100 rounded-[2.5rem] flex flex-col items-center gap-6 text-center animate-in zoom-in-95">
            <div className="flex items-center gap-4 text-red-600">
              <AlertTriangle className="w-10 h-10" />
              <p className="font-black text-xl tracking-tight leading-tight uppercase">{globalError}</p>
            </div>
          </div>
        )}

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-2 bg-yellow-400 text-black font-black text-sm rounded-xl transform -rotate-3 shadow-sm border-2 border-black">STAP 1</div>
             <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter leading-none">De Cast Ontwerpen</h2>
          </div>
          <CharacterList 
            characters={characters} 
            onAddCharacter={addCharacter} 
            onRemoveCharacter={removeCharacter}
            onApiError={handleApiError}
          />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-2 bg-indigo-500 text-white font-black text-sm rounded-xl transform rotate-3 shadow-sm border-2 border-black">STAP 2</div>
             <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter leading-none">De Situatie Verfilmen</h2>
          </div>
          <SceneFlow 
            scenes={scenes} 
            characters={characters} 
            onAddScene={addScene}
            onApiError={handleApiError}
            onChangeKey={() => {}} // No longer used but kept for component prop interface
          />
        </section>
      </main>

      <footer className="bg-indigo-950 text-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">TOONCRAFT STUDIO</h3>
              </div>
              <p className="text-indigo-200 font-medium leading-relaxed max-w-md">
                De digitale studio waar basisscholen emoties, conflicten en complexe sociale situaties kunnen verfilmen in een veilige, geanimeerde wereld.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-indigo-400 mb-6">Tools voor Docenten</h4>
              <ul className="space-y-4 text-indigo-200 font-bold text-sm">
                <li>
                  <button onClick={() => openEducationModal('lesbrief', 'Genereer een Lesbrief')} className="hover:text-white transition-colors flex items-center gap-2 text-left">
                    <BookOpen className="w-4 h-4" /> Lesbrief Generator
                  </button>
                </li>
                <li>
                  <button onClick={() => openEducationModal('emotie', 'Genereer Emotie Kaarten')} className="hover:text-white transition-colors flex items-center gap-2 text-left">
                    <Heart className="w-4 h-4" /> Emotie Kaart Generator
                  </button>
                </li>
                <li>
                  <button onClick={() => openEducationModal('situatie', 'Genereer Situatie Kaarten')} className="hover:text-white transition-colors flex items-center gap-2 text-left">
                    <Layers className="w-4 h-4" /> Situatie Kaart Generator
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-indigo-400 mb-6">Hulp & Info</h4>
              <ul className="space-y-4 text-indigo-200 font-bold text-sm">
                <li><button onClick={() => openEducationModal('hulp', 'Zo werkt het')} className="hover:text-white transition-colors flex items-center gap-2"><LifeBuoy className="w-4 h-4" /> Gebruiksaanwijzing</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><Info className="w-4 h-4" /> Privacy in de Klas</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-indigo-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-indigo-500 uppercase">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Aangedreven door AI Technologie</span>
             </div>
             <p>© 2024 ToonCraft Studio — Voor een veilige sfeer op elke school</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
