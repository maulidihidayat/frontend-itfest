"use client";

import { useState, FormEvent } from 'react';

export default function PdfToPptxConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError('');
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    let documentId = '';

    try {
      // --- LANGKAH 1: UPLOAD DOKUMEN ---
      setProgressMessage('Uploading PDF...');
      const formData = new FormData();
      formData.append('file', selectedFile); // Pastikan backend Anda mengharapkan key 'file'

      const uploadResponse = await fetch('http://localhost:8000/api/v1/document/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Upload failed: ${errorData.message || uploadResponse.statusText}`);
      }

      // Asumsi backend mengembalikan JSON seperti: { "document_id": "xyz-123" }
      // Sesuaikan 'document_id' jika key-nya berbeda di backend Anda
      const uploadResult = await uploadResponse.json();
      documentId = uploadResult.document_id; 
      if (!documentId) {
        throw new Error('Could not get document_id from upload response.');
      }
      console.log('Upload successful, Document ID:', documentId);


      // --- LANGKAH 2: GENERATE PRESENTASI ---
      setProgressMessage('Generating presentation...');
      const generateResponse = await fetch(`http://localhost:8000/api/v1/document/${documentId}/generate-presentation`, {
        method: 'POST',
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(`Generation failed: ${errorData.message || generateResponse.statusText}`);
      }
      console.log('Generation request successful.');


      // --- LANGKAH 3: DOWNLOAD PRESENTASI ---
      setProgressMessage('Downloading presentation...');
      const downloadResponse = await fetch(`http://localhost:8000/api/v1/document/download/presentation/${documentId}`);

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(`Download failed: ${errorData.message || downloadResponse.statusText}`);
      }

      const contentDisposition = downloadResponse.headers.get('content-disposition');
      let filename = 'presentation.pptx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const blob = await downloadResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      setSuccessMessage(`Success! Your download for "${filename}" has started.`);
      console.log('Download started.');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            PDF to PowerPoint Converter
          </h1>
          <p className="mt-2 text-gray-500">
            Follow the steps to get your presentation.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 sr-only">
              Upload PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {isLoading ? progressMessage : 'Start Conversion'}
          </button>
        </form>

        {error && (
          <div className="p-4 mt-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <p><span className="font-bold">Error:</span> {error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 mt-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg">
            <p><span className="font-bold">Success:</span> {successMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
}
