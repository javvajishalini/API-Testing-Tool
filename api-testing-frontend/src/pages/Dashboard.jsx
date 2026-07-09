import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RequestEditor from '../components/editor/RequestEditor';
import ResponseViewer from '../components/viewer/ResponseViewer';

function Dashboard() {
  const { collectionId, requestId } = useParams();

  return (
    <MainLayout>
      {/* We can use CSS Grid or Flexbox to place Editor and Viewer */}
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          {(!collectionId && !requestId) ? (
            <div className="flex-1 flex items-center justify-center text-dark-500 flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p>Select a collection or request to start</p>
            </div>
          ) : (
            <RequestEditor />
          )}
        </div>
        
        {/* Only show response viewer if a request is selected, or always show placeholder. We'll always show for layout demo. */}
        {(collectionId || requestId) && (
          <div className="flex-1 min-w-0 flex flex-col border-l border-dark-800">
            <ResponseViewer />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;
