import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RequestEditor from '../components/editor/RequestEditor';
import ResponseViewer from '../components/viewer/ResponseViewer';
import { requestService } from '../services/api';
import toast from 'react-hot-toast';

function Dashboard() {
  const { collectionId, requestId } = useParams();
  
  const [response, setResponse] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async (requestData) => {
    setIsExecuting(true);
    setResponse(null);
    try {
      const result = await requestService.execute(requestData);
      setResponse(result);
    } catch (error) {
      toast.error('Execution failed: ' + (error.response?.data?.message || error.message));
      setResponse({
        statusCode: 0,
        statusText: 'Network Error',
        body: 'Failed to reach the backend proxy. Is it running?',
        timeMs: 0,
        sizeBytes: 0,
        headers: {}
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          {(!collectionId && !requestId && false) ? (
            <div className="flex-1 flex items-center justify-center text-dark-500 flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p>Select a collection or request to start</p>
            </div>
          ) : (
            <RequestEditor onExecute={handleExecute} isExecuting={isExecuting} />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col border-l border-dark-800">
          <ResponseViewer response={response} isExecuting={isExecuting} />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
