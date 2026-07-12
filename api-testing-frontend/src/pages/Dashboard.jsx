import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RequestEditor from '../components/editor/RequestEditor';
import ResponseViewer from '../components/viewer/ResponseViewer';
import { requestService, collectionService } from '../services/api';
import toast from 'react-hot-toast';

function Dashboard() {
  const { collectionId, requestId } = useParams();
  const navigate = useNavigate();
  
  const [collections, setCollections] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch request details if requestId is in the URL
  useEffect(() => {
    if (requestId) {
      fetchRequestDetails(requestId);
    } else {
      setActiveRequest(null);
    }
  }, [requestId]);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (error) {
      toast.error('Failed to load collections');
    }
  };

  const fetchRequestDetails = async (id) => {
    try {
      const request = await requestService.getById(id);
      setActiveRequest(request);
    } catch (error) {
      toast.error('Failed to load request details');
      navigate('/');
    }
  };

  const handleSaveRequest = async (requestData) => {
    try {
      if (requestData.id) {
        // Update existing request
        const updated = await requestService.update(requestData.id, requestData);
        setActiveRequest(updated);
        toast.success('Request updated');
      } else {
        // Create new request (fallback/unreachable via normal sidebar flow but good to have)
        const created = await requestService.create(requestData);
        navigate(`/requests/${created.id}`);
        toast.success('Request saved');
      }
      // Refresh sidebar list to show potential name/method/collection updates
      fetchCollections();
    } catch (error) {
      toast.error('Failed to save request');
    }
  };

  const handleExecute = async (requestData) => {
    setIsExecuting(true);
    setResponse(null);
    let finalResponse = null;

    try {
      const result = await requestService.execute(requestData);
      finalResponse = result;
      setResponse(result);
    } catch (error) {
      toast.error('Execution failed: ' + (error.response?.data?.message || error.message));
      finalResponse = {
        statusCode: 0,
        statusText: 'Error',
        body: 'Failed to reach backend',
        timeMs: 0,
        sizeBytes: 0,
        headers: {}
      };
      setResponse(finalResponse);
    } finally {
      setIsExecuting(false);
      
      // Save to history
      try {
        const historyItem = {
          requestId: requestData.id,
          method: requestData.method,
          url: requestData.url,
          timestamp: new Date().toISOString(),
          statusCode: finalResponse.statusCode,
          statusText: finalResponse.statusText,
          timeMs: finalResponse.timeMs
        };
        const saved = localStorage.getItem('apiflow-history');
        const history = saved ? JSON.parse(saved) : [];
        // Add to beginning, keep last 50
        const newHistory = [historyItem, ...history].slice(0, 50);
        localStorage.setItem('apiflow-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          {!requestId ? (
            <div className="flex-1 flex items-center justify-center text-dark-500 flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p>Select a request from a collection to start testing</p>
            </div>
          ) : (
            <RequestEditor 
              activeRequest={activeRequest}
              onSave={handleSaveRequest}
              collections={collections}
              onExecute={handleExecute} 
              isExecuting={isExecuting} 
            />
          )}
        </div>
        
        {requestId && (
          <div className="flex-1 min-w-0 flex flex-col border-l border-dark-800">
            <ResponseViewer response={response} isExecuting={isExecuting} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;
