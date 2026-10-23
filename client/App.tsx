import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { AskTruthGuard } from './components/AskTruthGuard';
import { DocumentLibrary } from './components/DocumentLibrary';
import { ConflictExplorer } from './components/ConflictExplorer';
import { TestBench } from './components/TestBench';
import { SystemSettings } from './components/SystemSettings';
import { Document, Conflict, ExecutionMode } from '../shared/types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [systemMode, setSystemMode] = useState<ExecutionMode>('DEMO_DETERMINISTIC');
  const [systemProvider, setSystemProvider] = useState('deterministic-engine');
  const [systemModel, setSystemModel] = useState('TruthGuard-RuleEngine-v1');
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  const fetchHealthAndData = async () => {
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const health = await healthRes.json();
        setSystemMode(health.mode);
        setSystemProvider(health.provider);
        setSystemModel(health.model);
      }

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
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        documentCount={documents.length}
        conflictCount={conflicts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header
          mode={systemMode}
          systemProvider={systemProvider}
          systemModel={systemModel}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
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

          {currentTab === 'system' && (
            <SystemSettings
              mode={systemMode}
              provider={systemProvider}
              model={systemModel}
              onRefresh={fetchHealthAndData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
