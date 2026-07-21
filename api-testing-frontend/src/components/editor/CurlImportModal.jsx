import React, { useState } from 'react';
import { parseCurl } from '../../utils/curlParser';
import toast from 'react-hot-toast';
import { FiX, FiTerminal } from 'react-icons/fi';

const CurlImportModal = ({ isOpen, onClose, onImport }) => {
  const [curlText, setCurlText] = useState('');

  if (!isOpen) return null;

  const handleImport = (e) => {
    e.preventDefault();
    if (!curlText.trim()) {
      toast.error('Please paste a cURL command');
      return;
    }

    try {
      const parsed = parseCurl(curlText);
      onImport(parsed);
      toast.success('cURL command imported successfully');
      setCurlText('');
      onClose();
    } catch (err) {
      toast.error('Failed to parse cURL command: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-900 border border-dark-750 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between bg-dark-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
              <FiTerminal size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Import cURL Command</h3>
              <p className="text-xs text-dark-400">Paste any cURL request to auto-fill your parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-dark-400 hover:text-white p-1 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleImport} className="p-5 flex flex-col gap-4">
          <textarea
            autoFocus
            value={curlText}
            onChange={(e) => setCurlText(e.target.value)}
            placeholder="curl -X POST https://api.example.com/v1/users -H 'Content-Type: application/json' -d '{&quot;name&quot;: &quot;John&quot;}'"
            rows={7}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg p-3 text-xs font-mono text-white outline-none focus:border-primary-500 transition-colors resize-none"
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-glow"
            >
              Import Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurlImportModal;
