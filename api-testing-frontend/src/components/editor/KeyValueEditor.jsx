import React from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const KeyValueEditor = ({ pairs, onChange }) => {
  const handleAdd = () => {
    onChange([...pairs, { key: '', value: '', isActive: true, id: Date.now() }]);
  };

  const handleUpdate = (id, field, value) => {
    onChange(pairs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemove = (id) => {
    onChange(pairs.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2 group">
          <input
            type="checkbox"
            checked={pair.isActive}
            onChange={(e) => handleUpdate(pair.id, 'isActive', e.target.checked)}
            className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900"
          />
          <input
            type="text"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => handleUpdate(pair.id, 'key', e.target.value)}
            className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-3 py-1.5 outline-none focus:border-primary-500 text-sm font-mono"
          />
          <input
            type="text"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => handleUpdate(pair.id, 'value', e.target.value)}
            className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-3 py-1.5 outline-none focus:border-primary-500 text-sm font-mono"
          />
          <button
            onClick={() => handleRemove(pair.id)}
            className="p-1.5 text-dark-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="self-start flex items-center gap-1 text-sm text-dark-400 hover:text-primary-500 mt-2 transition-colors"
      >
        <FiPlus size={16} />
        <span>Add Row</span>
      </button>
    </div>
  );
};

export default KeyValueEditor;
