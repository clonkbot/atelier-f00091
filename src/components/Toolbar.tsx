import { useState } from 'react';

type Tool = 'brush' | 'splatter' | 'drip';

interface ColorOption {
  name: string;
  value: string;
}

interface ToolbarProps {
  colors: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onSave: () => void;
}

function Toolbar({
  colors,
  selectedColor,
  onColorChange,
  selectedTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  onClear,
  onSave,
}: ToolbarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const tools: { id: Tool; name: string; icon: React.ReactNode }[] = [
    {
      id: 'brush',
      name: 'Brush',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
    {
      id: 'splatter',
      name: 'Splatter',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
          <circle cx="6" cy="8" r="2" />
          <circle cx="18" cy="9" r="1.5" />
          <circle cx="8" cy="16" r="1.5" />
          <circle cx="16" cy="15" r="2" />
          <circle cx="4" cy="13" r="1" />
          <circle cx="19" cy="5" r="1" />
          <circle cx="14" cy="4" r="1.5" />
        </svg>
      ),
    },
    {
      id: 'drip',
      name: 'Drip',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-4 5-7 8-7 12a7 7 0 1 0 14 0c0-4-3-7-7-12z" />
        </svg>
      ),
    },
  ];

  const handleClear = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div className="lg:w-64 flex flex-col gap-4 md:gap-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/10">
      {/* Colors */}
      <div>
        <h3 className="font-display text-sm text-white/60 mb-3 tracking-wide">Palette</h3>
        <div className="grid grid-cols-6 lg:grid-cols-3 gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`aspect-square rounded-lg transition-all duration-200 hover:scale-110 ${
                selectedColor === c.value
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f0f0f] scale-110'
                  : ''
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h3 className="font-display text-sm text-white/60 mb-3 tracking-wide">Tools</h3>
        <div className="flex lg:flex-col gap-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => onToolChange(t.id)}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedTool === t.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {t.icon}
              <span className="font-body text-sm hidden lg:inline">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brush Size */}
      <div>
        <h3 className="font-display text-sm text-white/60 mb-3 tracking-wide">
          Size <span className="text-white/40">({brushSize}px)</span>
        </h3>
        <input
          type="range"
          min="4"
          max="48"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#e63946]"
          style={{
            background: `linear-gradient(to right, #e63946 0%, #e63946 ${((brushSize - 4) / 44) * 100}%, rgba(255,255,255,0.1) ${((brushSize - 4) / 44) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/10">
        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#457b9d] hover:bg-[#5a8faf] text-white rounded-lg transition-all duration-200 font-body text-sm shadow-lg shadow-[#457b9d]/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
          Save to Gallery
        </button>
        <button
          onClick={handleClear}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-body text-sm ${
            showClearConfirm
              ? 'bg-[#e63946] text-white'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          {showClearConfirm ? 'Confirm Clear?' : 'Clear Canvas'}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
