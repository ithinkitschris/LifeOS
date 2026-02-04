'use client';

interface EditableTextProps {
  field: string;
  value: string;
  multiline?: boolean;
  editing: string | null;
  editValue: string;
  setEditValue: (value: string) => void;
  handleSave: (field: string, value: string) => void;
  startEditing: (field: string, currentValue: string) => void;
  cancelEditing: () => void;
}

export default function EditableText({ 
  field, 
  value, 
  multiline = false, 
  editing, 
  editValue, 
  setEditValue, 
  handleSave, 
  startEditing, 
  cancelEditing 
}: EditableTextProps) {
  const isEditing = editing === field;

  if (isEditing) {
    return (
      <div className="mt-2">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008cff]/20 focus:border-[#008cff]/40 transition-all"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008cff]/20 focus:border-[#008cff]/40 transition-all"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleSave(field, editValue)}
            className="btn-primary px-4 py-2 text-sm"
          >
            Save
          </button>
          <button
            onClick={cancelEditing}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => startEditing(field, value)}
      className="cursor-pointer hover:bg-black/[0.02] p-3 -m-3 rounded-xl transition-all group"
    >
      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{value}</p>
      <span className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 ml-2 transition-opacity">Click to edit</span>
    </div>
  );
}
