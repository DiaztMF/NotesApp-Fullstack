import { X } from "lucide-react";

export function ExportModal ({ isOpen, onClose, note, onExport }) {
  if (!isOpen || !note) return null;

  const exportFormats = [
    { id: "txt", label: "TXT", description: "Plain Text File" },
    { id: "json", label: "JSON", description: "JSON Format" },
    { id: "doc", label: "DOC", description: "Microsoft Word" },
    { id: "pdf", label: "PDF", description: "PDF Document" },
  ];

  const handleExport = (format) => {
    onExport(note, format);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-[#2a2a2a] text-white rounded-lg shadow-xl max-w-md w-full" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Choose Export Format</h2>
          <button 
            onClick={onClose} 
            className="hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-400 mb-4 text-sm">
            Export "{note.title}" as:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleExport(format.id)}
                className="flex flex-col items-center justify-center p-4 bg-[#404040] hover:bg-[#505050] rounded-lg transition-colors group"
              >
                <span className="text-xl font-bold mb-1  transition-colors">
                  {format.label}
                </span>
                <span className="text-xs text-gray-400">
                  {format.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
