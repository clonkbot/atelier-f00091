import { useState, useRef, useEffect, useCallback } from 'react';
import Canvas from './components/Canvas';
import Gallery from './components/Gallery';
import Toolbar from './components/Toolbar';

type Tool = 'brush' | 'splatter' | 'drip';
type ColorOption = { name: string; value: string };

const colors: ColorOption[] = [
  { name: 'Cadmium Red', value: '#e63946' },
  { name: 'Cobalt Blue', value: '#457b9d' },
  { name: 'Chrome Yellow', value: '#f4d35e' },
  { name: 'Raw Umber', value: '#8b4513' },
  { name: 'Titanium White', value: '#f8f8f8' },
  { name: 'Ivory Black', value: '#1a1a1a' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [selectedTool, setSelectedTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(12);
  const canvasRef = useRef<{ clear: () => void; save: () => string | null }>(null);
  const [savedArtworks, setSavedArtworks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const stored = localStorage.getItem('artworks');
    if (stored) {
      setSavedArtworks(JSON.parse(stored));
    }
  }, []);

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  const handleSave = useCallback(() => {
    const dataUrl = canvasRef.current?.save();
    if (dataUrl) {
      const newArtworks = [...savedArtworks, dataUrl];
      setSavedArtworks(newArtworks);
      localStorage.setItem('artworks', JSON.stringify(newArtworks));
    }
  }, [savedArtworks]);

  const handleDeleteArtwork = useCallback((index: number) => {
    const newArtworks = savedArtworks.filter((_, i) => i !== index);
    setSavedArtworks(newArtworks);
    localStorage.setItem('artworks', JSON.stringify(newArtworks));
  }, [savedArtworks]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden flex flex-col">
      {/* Animated paint drip background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-[10%] w-2 h-32 bg-gradient-to-b from-[#e63946] to-transparent opacity-30"
          style={{ animation: 'drip 8s ease-in-out infinite', animationDelay: '0s' }}
        />
        <div
          className="absolute top-0 left-[30%] w-3 h-48 bg-gradient-to-b from-[#457b9d] to-transparent opacity-25"
          style={{ animation: 'drip 12s ease-in-out infinite', animationDelay: '2s' }}
        />
        <div
          className="absolute top-0 right-[20%] w-2 h-40 bg-gradient-to-b from-[#f4d35e] to-transparent opacity-30"
          style={{ animation: 'drip 10s ease-in-out infinite', animationDelay: '4s' }}
        />
        <div
          className="absolute top-0 right-[40%] w-4 h-56 bg-gradient-to-b from-[#8b4513] to-transparent opacity-20"
          style={{ animation: 'drip 14s ease-in-out infinite', animationDelay: '1s' }}
        />
      </div>

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header
        className={`relative z-10 px-4 md:px-8 lg:px-12 py-6 md:py-8 border-b border-white/5 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white tracking-tight">
              <span className="text-[#e63946]">A</span>telier
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-1 italic">
              Express. Create. Liberate.
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-md font-body text-sm md:text-base transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-md font-body text-sm md:text-base transition-all duration-300 ${
                activeTab === 'gallery'
                  ? 'bg-[#457b9d] text-white shadow-lg shadow-[#457b9d]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Gallery
              {savedArtworks.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {savedArtworks.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'create' ? (
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-full">
              {/* Canvas Area */}
              <div className="flex-1 min-h-[50vh] lg:min-h-0">
                <Canvas
                  ref={canvasRef}
                  color={selectedColor}
                  tool={selectedTool}
                  brushSize={brushSize}
                />
              </div>

              {/* Toolbar */}
              <Toolbar
                colors={colors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                selectedTool={selectedTool}
                onToolChange={setSelectedTool}
                brushSize={brushSize}
                onBrushSizeChange={setBrushSize}
                onClear={handleClear}
                onSave={handleSave}
              />
            </div>
          ) : (
            <Gallery
              artworks={savedArtworks}
              onDelete={handleDeleteArtwork}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 px-4 md:px-8 lg:px-12 py-4 border-t border-white/5 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-center font-body text-xs text-white/30">
          Requested by @shadhedge · Built by @clonkbot
        </p>
      </footer>

      {/* Global styles for animations */}
      <style>{`
        @keyframes drip {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.3; }
          50% { transform: translateY(100vh); opacity: 0.1; }
          51% { transform: translateY(-100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default App;
