'use client';

import { useState } from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea';
  required?: boolean;
  defaultValue?: string;
}

interface CreateFormInlineProps {
  fields: Field[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function CreateFormInline({ 
  fields, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Create' 
}: CreateFormInlineProps) {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, string>)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={values[field.name] || ''}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                rows={3}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008cff]/20 focus:border-[#008cff]/40"
              />
            ) : (
              <input
                type="text"
                value={values[field.name] || ''}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008cff]/20 focus:border-[#008cff]/40"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[#008cff] text-white rounded-lg hover:bg-[#0073d9] transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
