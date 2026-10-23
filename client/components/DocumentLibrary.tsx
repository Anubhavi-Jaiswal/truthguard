import React, { useState } from 'react';
import { 
  Files, 
  Upload, 
  Trash2, 
  FileText, 
  Calendar, 
  Tag, 
  FileCheck, 
  RotateCcw,
  Plus,
  X,
  ExternalLink
} from 'lucide-react';
import { Document, PolicyCategory } from '../../shared/types';

interface DocumentLibraryProps {
  documents: Document[];
  onRefresh: () => void;
  selectedDocId?: string;
  onClearSelectedDoc?: () => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onRefresh,
  selectedDocId,
  onClearSelectedDoc
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(
    selectedDocId ? documents.find(d => d.id === selectedDocId) || null : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PolicyCategory>('HR');
  const [version, setVersion] = useState('1.0');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredDocs = filterCategory === 'ALL'
    ? documents
    : documents.filter(d => d.category === filterCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileToUpload(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
      setUploadError('Please select a file.');
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('version', version);
    formData.append('effectiveFrom', effectiveFrom);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload document.');
      }

      setIsUploading(false);
      setFileToUpload(null);
      setTitle('');
      onRefresh();
    } catch (err: any) {
      setUploadError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document from the library?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetCorpus = async () => {
    if (!confirm('Reset repository back to default 12 synthetic documents?')) return;
    try {
      await fetch('/api/documents/reset', { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Files className="w-5 h-5 text-electric-blue" />
            Document Library & Provenance Repository
          </h2>
          <p className="text-sm text-slate-400">
            Browse indexed enterprise policy records, version histories, and explicit supersession dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetCorpus}
            className="px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Corpus</span>
          </button>
          <button
            onClick={() => setIsUploading(true)}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-violet hover:opacity-90 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['ALL', 'HR', 'IT_SECURITY', 'EXPENSE'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-electric-violet/20 text-electric-blue border border-electric-violet/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {cat === 'ALL' ? 'All Policies' : cat.replace('_', ' ')}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto font-mono">
          Showing {filteredDocs.length} of {documents.length} documents
        </span>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedDoc?.id === doc.id
                ? 'bg-navy-900 border-electric-blue shadow-lg shadow-electric-blue/10'
                : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 hover:bg-navy-900'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  {doc.category}
                </span>
                <span className="font-mono text-[11px] text-electric-violet font-semibold">
                  v{doc.version}
                </span>
              </div>

              <h3 className="font-semibold text-white text-sm line-clamp-2 leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {doc.content.slice(0, 150)}...
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Eff: {doc.effectiveFrom}
              </span>
              {doc.supersedes && (
                <span className="text-amber-400 text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded">
                  Supersedes {doc.supersedes.length}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-navy-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-electric-blue uppercase">
                  {selectedDoc.category} • v{selectedDoc.version}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Format</span>
                  <span className="text-slate-200 uppercase font-semibold">{selectedDoc.sourceType}</span>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Published</span>
                  <span className="text-slate-200">{selectedDoc.publishedAt}</span>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Effective Date</span>
                  <span className="text-emerald-400">{selectedDoc.effectiveFrom}</span>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Supersedes</span>
                  <span className="text-amber-400">{selectedDoc.supersedes?.join(', ') || 'None'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Extracted Document Text
                </span>
                <pre className="p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-navy-950 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedDoc.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Document</span>
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-electric-blue" />
                Ingest New Document
              </h3>
              <button
                onClick={() => setIsUploading(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Upload File (PDF, DOCX, TXT, MD)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-navy-950 border border-slate-700 rounded text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. IT Security Standard: Encryption Policy"
                  className="w-full p-2 bg-navy-950 border border-slate-700 rounded text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                    className="w-full p-2 bg-navy-950 border border-slate-700 rounded text-slate-200"
                  >
                    <option value="HR">HR</option>
                    <option value="IT_SECURITY">IT Security</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full p-2 bg-navy-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Effective Date</label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full p-2 bg-navy-950 border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-electric-blue text-white font-semibold hover:bg-sky-400"
                >
                  Ingest & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
