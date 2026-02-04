'use client';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'danger';
}

export default function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  severity = 'warning' 
}: ConfirmDialogProps) {
  const isDanger = severity === 'danger';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-lg font-semibold mb-2 ${isDanger ? 'text-red-900' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#008cff] hover:bg-[#0073d9]'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
