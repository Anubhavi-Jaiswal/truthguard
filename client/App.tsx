import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { AskTruthGuard } from './components/AskTruthGuard';
import { DocumentLibrary } from './components/DocumentLibrary';
import { ConflictExplorer } from './components/ConflictExplorer';
import { TestBench } from './components/TestBench';
import { Document, Conflict } from '../shared/types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  const fetchHealthAndData = async () => {
    try {
      const docsRes = await fetch('/api/documents');
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
      }

      const confRes = await fetch('/api/conflicts');
      if (confRes.ok) {
        const confData = await confRes.json();
        setConflicts(confData.conflicts || []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    fetchHealthAndData();
  }, []);

  const handleSelectDocument = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentTab('documents');
  };

  const handleRunSampleQuestion = (question: string) => {
    setCurrentTab('qa');
  };

  return (
    <div className="min-h-screen bg-[#f4f0ff] text-slate-900 overflow-hidden font-sans">
      <div className="flex h-screen m-0 bg-white/65 lg:m-5 lg:rounded-[2rem] lg:shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:border lg:border-white overflow-hidden">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        documentCount={documents.length}
        conflictCount={conflicts.length}
      />

      <div className="flex-1 flex flex-col h-full overflow-y-auto min-w-0 bg-gradient-to-br from-white via-violet-50/50 to-fuchsia-50/40">
        <main className="flex-1 p-4 sm:p-6 xl:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <Overview
              documentCount={documents.length}
              conflictCount={conflicts.length}
              onNavigate={setCurrentTab}
              onRunSample={handleRunSampleQuestion}
            />
          )}

          {currentTab === 'qa' && (
            <AskTruthGuard
              onSelectDocument={handleSelectDocument}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentLibrary
              documents={documents}
              onRefresh={fetchHealthAndData}
              selectedDocId={selectedDocId}
              onClearSelectedDoc={() => setSelectedDocId(undefined)}
            />
          )}

          {currentTab === 'conflicts' && (
            <ConflictExplorer
              conflicts={conflicts}
              onRefresh={fetchHealthAndData}
              onNavigateToQA={(q) => {
                setCurrentTab('qa');
              }}
            />
          )}

          {currentTab === 'testbench' && (
            <TestBench
              onNavigateToQA={(q) => {
                setCurrentTab('qa');
              }}
            />
          )}
        </main>
      </div>
      </div>
    </div>
  );
}
