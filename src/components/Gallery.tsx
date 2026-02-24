import { useState } from 'react';

interface GalleryProps {
  artworks: string[];
  onDelete: (index: number) => void;
}

function Gallery({ artworks, onDelete }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDelete = (index: number) => {
    if (deleteConfirm === index) {
      onDelete(index);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(index);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `atelier-artwork-${index + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center px-4">
        <div className="w-24 h-24 md:w-32 md:h-32 mb-6 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-white">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h2 className="font-display text-xl md:text-2xl text-white/60 mb-2">Your gallery is empty</h2>
        <p className="font-body text-sm md:text-base text-white/30 max-w-md">
          Create your first masterpiece in the Create tab and save it to see it here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {artworks.map((artwork, index) => (
          <div
            key={index}
            className="group relative aspect-[4/3] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeSlideIn 0.5s ease-out forwards',
            }}
          >
            {/* Frame effect */}
            <div className="absolute inset-0 border-4 border-[#2a2520] rounded-xl z-10 pointer-events-none" />

            <img
              src={artwork}
              alt={`Artwork ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(artwork)}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setSelectedImage(artwork)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="hidden sm:inline">View</span>
                </button>
                <button
                  onClick={() => handleDownload(artwork, index)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#457b9d]/80 hover:bg-[#457b9d] backdrop-blur-sm rounded-lg text-white text-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className={`px-3 py-2.5 backdrop-blur-sm rounded-lg text-white text-sm transition-all ${
                    deleteConfirm === index
                      ? 'bg-[#e63946] hover:bg-[#d62839]'
                      : 'bg-white/10 hover:bg-[#e63946]/80'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Artwork number */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs font-body text-white/60 z-20">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Artwork"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default Gallery;
