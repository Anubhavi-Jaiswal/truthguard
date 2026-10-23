import React, { useState } from 'react';
import { 
  Files, 
  Upload, 
  Trash2, 
  FileText, 
  Calendar, 
  RotateCcw,
  Plus,
  X,
  ExternalLink,
  Search,
  Filter
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchesCat = filterCategory === 'ALL' || doc.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
    if (!confirm('Remove this document from the indexed repository?')) return;
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
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Document Registry</h2>
          <p className="text-xs text-slate-500">
            Authoritative documents, effective date boundaries, and supersession links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCorpus}
            className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Corpus</span>
          </button>
          <button
            onClick={() => setIsUploading(true)}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs">
          {['ALL', 'HR', 'IT_SECURITY', 'EXPENSE'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Policies' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter documents..."
            className="bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 w-64"
          />
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="py-2.5 px-3">Title & Summary</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Version</th>
              <th className="py-2.5 px-3">Effective Range</th>
              <th className="py-2.5 px-3">Supersedes</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filteredDocs.map(doc => (
              <tr 
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 max-w-sm">
                  <div className="font-semibold text-slate-900 truncate">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{doc.content.slice(0, 90)}...</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-medium">
                    {doc.category}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-600">v{doc.version}</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                  <span>{doc.effectiveFrom}</span>
                  {doc.effectiveTo && <span className="text-slate-400"> → {doc.effectiveTo}</span>}
                </td>
                <td className="py-2.5 px-3">
                  {doc.supersedes && doc.supersedes.length > 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-medium">
                      {doc.supersedes.length} policy
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(doc);
                    }}
                    className="text-slate-700 hover:text-slate-900 font-medium mr-2 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDocs.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No matching documents found in the current filter.
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-white border border-slate-300 rounded shadow-xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  {selectedDoc.category} • Version {selectedDoc.version}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Format</span>
                  <span className="text-slate-900 uppercase font-semibold">{selectedDoc.sourceType}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Published</span>
                  <span className="text-slate-900">{selectedDoc.publishedAt}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Effective Date</span>
                  <span className="text-emerald-700 font-semibold">{selectedDoc.effectiveFrom}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Supersedes</span>
                  <span className="text-amber-700 font-semibold">{selectedDoc.supersedes?.join(', ') || 'None'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Extracted Passage Content
                </span>
                <pre className="p-4 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedDoc.id)}
                className="text-xs text-rose-700 hover:text-rose-800 flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Document</span>
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3.5 py-1.5 rounded bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-slate-700" />
                Upload & Ingest Policy Document
              </h3>
              <button
                onClick={() => setIsUploading(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">File (PDF, DOCX, TXT, MD)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. IT Security Standard: Encryption Guidelines"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  >
                    <option value="HR">HR</option>
                    <option value="IT_SECURITY">IT Security</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Effective Date</label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-white font-medium hover:bg-slate-800"
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
