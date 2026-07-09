import React, { useState, useEffect } from 'react';
import { FiPlus, FiFolder, FiMoreVertical, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { collectionService } from '../../services/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const [collections, setCollections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { collectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (error) {
      toast.error('Failed to load collections');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    try {
      const newCollection = await collectionService.create({ name: newCollectionName });
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setIsCreating(false);
      toast.success('Collection created');
    } catch (error) {
      toast.error('Failed to create collection');
    }
  };

  const startEdit = (collection) => {
    setEditingId(collection.id);
    setEditName(collection.name);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return setEditingId(null);
    try {
      const updated = await collectionService.update(id, { name: editName });
      setCollections(collections.map(c => c.id === id ? updated : c));
      setEditingId(null);
      toast.success('Collection renamed');
    } catch (error) {
      toast.error('Failed to rename collection');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete collection "${name}"?`)) {
      try {
        await collectionService.delete(id);
        setCollections(collections.filter(c => c.id !== id));
        if (parseInt(collectionId) === id) {
          navigate('/');
        }
        toast.success('Collection deleted');
      } catch (error) {
        toast.error('Failed to delete collection');
      }
    }
  };

  return (
    <div className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col h-full shrink-0">
      <div className="p-4 flex items-center justify-between border-b border-dark-800">
        <h2 className="font-semibold text-dark-200">Collections</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-dark-800 rounded text-dark-400 hover:text-white transition-colors"
          title="New Collection"
        >
          <FiPlus />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isCreating && (
          <form onSubmit={handleCreate} className="flex items-center gap-2 mb-2 p-2 bg-dark-800 rounded-lg">
            <FiFolder className="text-primary-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="bg-transparent border-none outline-none text-sm w-full text-white"
              onBlur={() => { if(!newCollectionName) setIsCreating(false); }}
            />
          </form>
        )}

        <div className="space-y-1">
          {collections.map(collection => (
            <div 
              key={collection.id}
              className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${parseInt(collectionId) === collection.id ? 'bg-dark-800 text-white' : 'text-dark-300 hover:bg-dark-800/50 hover:text-dark-100'}`}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1" onClick={() => navigate(`/collections/${collection.id}`)}>
                <FiFolder className={parseInt(collectionId) === collection.id ? 'text-primary-500' : 'text-dark-400'} />
                {editingId === collection.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleUpdate(collection.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(collection.id)}
                    className="bg-dark-950 border border-primary-500 rounded px-1 text-sm w-full outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate text-sm font-medium">{collection.name}</span>
                )}
              </div>

              {editingId !== collection.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEdit(collection); }}
                    className="p-1 hover:text-white rounded"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(collection.id, collection.name); }}
                    className="p-1 hover:text-red-400 rounded"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {collections.length === 0 && !isCreating && (
            <div className="text-center p-4 text-dark-500 text-sm">
              No collections found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
