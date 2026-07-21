import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiEdit3, FiList } from 'react-icons/fi';

const KeyValueEditor = ({ pairs, onChange }) => {
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleAdd = () => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    onChange([...pairs, { key: '', value: '', isActive: true, id: newId }]);
  };

  const handleUpdate = (id, field, value) => {
    onChange(pairs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemove = (id) => {
    onChange(pairs.filter(p => p.id !== id));
  };

  const toggleBulkEdit = () => {
    if (!isBulkEdit) {
      // Convert Key-Value pairs to bulk text string "key: value"
      const text = pairs
        .filter(p => p.key.trim() !== '')
        .map(p => `${p.key}: ${p.value}`)
        .join('\n');
      setBulkText(text);
      setIsBulkEdit(true);
    } else {
      // Convert bulk text back to key-value objects
      const lines = bulkText.split('\n');
      const newPairs = lines.map(line => {
        const colonIdx = line.indexOf(':');
        let key = line;
        let value = '';
        if (colonIdx !== -1) {
          key = line.slice(0, colonIdx).trim();
          value = line.slice(colonIdx + 1).trim();
        } else {
          key = line.trim();
        }
        return {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()),
          key,
          value,
          isActive: true
        };
      }).filter(p => p.key.trim() !== '');

      onChange(newPairs.length ? newPairs : [{ id: '1', key: '', value: '', isActive: true }]);
      setIsBulkEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mode Toggle Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleBulkEdit}
          className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors bg-dark-850 hover:bg-dark-800 border border-dark-750 px-2.5 py-1 rounded"
        >
          {isBulkEdit ? <FiList size={13} /> : <FiEdit3 size={13} />}
          <span>{isBulkEdit ? 'Key-Value Edit' : 'Bulk Edit'}</span>
        </button>
      </div>

      {isBulkEdit ? (
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Key: Value (one per line)"
          rows={6}
          className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 font-mono text-xs text-dark-100 outline-none focus:border-primary-500 resize-y"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {pairs.map((pair) => (
            <div key={pair.id} className="flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={pair.isActive !== false}
                onChange={(e) => handleUpdate(pair.id, 'isActive', e.target.checked)}
                aria-label="Toggle active parameter"
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900 cursor-pointer"
              />
              <input
                type="text"
                placeholder="Key"
                aria-label="Parameter Key"
                value={pair.key}
                onChange={(e) => handleUpdate(pair.id, 'key', e.target.value)}
                className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-3 py-1.5 outline-none focus:border-primary-500 text-sm font-mono"
              />
              <input
                type="text"
                placeholder="Value"
                aria-label="Parameter Value"
                value={pair.value}
                onChange={(e) => handleUpdate(pair.id, 'value', e.target.value)}
                className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-3 py-1.5 outline-none focus:border-primary-500 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => handleRemove(pair.id)}
                aria-label="Delete parameter row"
                className="p-1.5 text-dark-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAdd}
            className="self-start flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 mt-1 transition-colors font-medium"
          >
            <FiPlus size={15} />
            <span>Add Row</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyValueEditor;
