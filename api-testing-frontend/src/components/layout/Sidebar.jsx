import React, { useState, useEffect } from 'react';
import { FiPlus, FiFolder, FiEdit2, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { collectionService, requestService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { collectionId, requestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, [requestId]);

  const fetchCollections = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (error) {
      setIsError(true);
      toast.error('Failed to load collections. Check server connection or VITE_API_BASE_URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    try {
      const newCollection = await collectionService.create({ name: newCollectionName });
      setCollections([...collections, { ...newCollection, requests: [] }]);
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
      setCollections(collections.map(c => c.id === id ? { ...updated, requests: c.requests } : c));
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
          navigate('/dashboard');
        }
        toast.success('Collection deleted');
      } catch (error) {
        toast.error('Failed to delete collection');
      }
    }
  };

  const handleNewRequest = async (colId) => {
    try {
      const newReq = await requestService.create({
        name: 'New Request',
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        collectionId: colId,
        headers: '[]',
        queryParams: '[]',
        body: ''
      });
      fetchCollections();
      navigate(`/requests/${newReq.id}`);
      toast.success('Request created');
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  const handleDeleteRequest = async (e, reqId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestService.delete(reqId);
        fetchCollections();
        if (parseInt(requestId) === reqId) {
          navigate('/dashboard');
        }
        toast.success('Request deleted');
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-amber-400';
      case 'PUT': return 'text-blue-400';
      case 'DELETE': return 'text-rose-400';
      case 'PATCH': return 'text-purple-400';
      default: return 'text-primary-400';
    }
  };

  const filteredCollections = collections.map(col => {
    const matchesCollectionName = col.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchingRequests = (col.requests || []).filter(req => 
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (req.url && req.url.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (matchesCollectionName || matchingRequests.length > 0) {
      return {
        ...col,
        requests: searchTerm ? matchingRequests : col.requests
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-dark-800 bg-dark-950 shrink-0">
        <h2 className="font-semibold text-dark-200 text-sm">Collections</h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={fetchCollections}
            className="p-1 hover:bg-dark-800 rounded text-dark-400 hover:text-white transition-colors"
            title="Refresh Collections"
          >
            <FiRefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-dark-800 rounded text-dark-400 hover:text-white transition-colors"
            title="New Collection"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-2 border-b border-dark-800 bg-dark-950/50 shrink-0 flex items-center gap-2">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-dark-500">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-850 hover:bg-dark-800 focus:bg-dark-800 border border-dark-750 text-white rounded pl-8 pr-3 py-1.5 outline-none focus:border-primary-500 text-xs transition-colors font-sans"
          />
        </div>
      </div>

      {/* Collections & Requests List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {isCreating && (
          <form onSubmit={handleCreate} className="flex items-center gap-2 mb-2 p-2 bg-dark-800 rounded-lg">
            <FiFolder className="text-primary-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="bg-transparent border-none outline-none text-xs w-full text-white"
            />
            <button type="submit" className="text-[10px] bg-primary-600 hover:bg-primary-500 text-white px-2 py-1 rounded shrink-0">
              Save
            </button>
            <button type="button" onClick={() => { setIsCreating(false); setNewCollectionName(''); }} className="text-xs text-dark-400 hover:text-white px-1">
              ✕
            </button>
          </form>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-4 p-2 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-dark-800 rounded"></div>
                    <div className="h-4 bg-dark-800 rounded w-2/3"></div>
                  </div>
                  <div className="pl-6 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-3 bg-dark-850 rounded"></div>
                      <div className="h-3 bg-dark-850 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center p-4 text-xs text-rose-400 flex flex-col items-center gap-2 border border-rose-500/20 bg-rose-500/5 rounded-lg">
              <p>Failed to connect to backend service.</p>
              <button
                onClick={fetchCollections}
                className="flex items-center gap-1.5 px-3 py-1 bg-dark-800 hover:bg-dark-750 text-white rounded text-[11px] font-medium border border-dark-700 transition-colors"
              >
                <FiRefreshCw size={12} />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (
            filteredCollections.map(collection => (
              <div key={collection.id} className="flex flex-col gap-1">
                {/* Collection Header */}
                <div 
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${parseInt(collectionId) === collection.id ? 'bg-dark-800/40 text-white' : 'text-dark-300 hover:bg-dark-800/20 hover:text-dark-100'}`}
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
                        className="bg-dark-950 border border-primary-500 rounded px-1 text-xs w-full outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate text-xs font-semibold">{collection.name}</span>
                    )}
                  </div>

                  {editingId !== collection.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleNewRequest(collection.id); }}
                        className="p-1 hover:text-primary-400 rounded"
                        title="Add Request"
                      >
                        <FiPlus size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEdit(collection); }}
                        className="p-1 hover:text-white rounded"
                        title="Rename"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(collection.id, collection.name); }}
                        className="p-1 hover:text-red-400 rounded"
                        title="Delete"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Nested Requests */}
                <div className="pl-4 border-l border-dark-800 ml-4 flex flex-col gap-0.5">
                  {collection.requests && collection.requests.map(req => (
                    <div
                      key={req.id}
                      onClick={() => navigate(`/requests/${req.id}`)}
                      className={`group flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors text-xs font-mono ${parseInt(requestId) === req.id ? 'bg-dark-800 text-white' : 'text-dark-400 hover:bg-dark-800/40 hover:text-dark-200'}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <span className={`font-bold text-[10px] w-8 shrink-0 ${getMethodColor(req.method)}`}>
                          {req.method}
                        </span>
                        <span className="truncate" title={req.name}>{req.name}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteRequest(e, req.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-400 rounded shrink-0"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(!collection.requests || collection.requests.length === 0) && (
                    <div className="text-[10px] text-dark-600 italic py-1 pl-2">
                      {searchTerm ? 'No matching requests' : 'Empty collection'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {!isLoading && !isError && filteredCollections.length === 0 && (
            <div className="text-center p-4 text-dark-500 text-xs">
              No matching collections or requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
