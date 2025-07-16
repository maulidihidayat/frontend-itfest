"use client";
import { useState, FormEvent, DragEvent } from "react";
import { UploadCloud, FileCheck2, FileWarning } from "lucide-react";

export default function PdfToPptxConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError("");
      setSuccessMessage("");
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
      setSuccessMessage("");
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    let documentId = "";

    try {
      setProgressMessage("Uploading PDF...");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        "http://localhost:8000/api/v1/document/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await uploadResponse.json();
      documentId = result.document_id || result.id || "";
      if (!documentId) throw new Error("document_id not found.");

      setProgressMessage("Generating presentation...");
      const generateResponse = await fetch(
        `http://localhost:8000/api/v1/document/${documentId}/generate-presentation`,
        { method: "POST" }
      );

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        throw new Error(`Generation failed: ${errorText}`);
      }

      setProgressMessage("Downloading presentation...");
      const downloadResponse = await fetch(
        `http://localhost:8000/api/v1/document/download/presentation/${documentId}`
      );

      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        throw new Error(`Download failed: ${errorText}`);
      }

      const blob = await downloadResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "presentation.pptx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMessage("Success! Your download has started.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  return (
    <main id="home" className="flex min-h-screen  items-center justify-center px-4 py-10 bg-white dark:bg-[#0f172a]">
      <div className="w-full mt-20 max-w-xl p-10 md:p-10 space-y-6 rounded-2xl bg-white/70 dark:bg-gray-800/80 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-br from-sky-300 to-sky-400 text-transparent bg-clip-text dark:text-white tracking-wide">
            MINDSLIDE AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            Convert Your Documents to PowerPoint Instantly with AI.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Drag and Drop Upload */}
          <label
            htmlFor="pdf-upload"
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-300
              ${isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 bg-gray-50 dark:bg-gray-700/30"
              }`}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-300">
              <UploadCloud className="w-8 h-8" />
              {selectedFile ? (
                <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                  {selectedFile.name}
                </span>
              ) : (
                <span className="text-sm">Click or drag & drop Document file here</span>
              )}
            </div>
          </label>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="w-full py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 
              disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              transition duration-300"
          >
            {isLoading ? progressMessage || "Processing..." : "Convert to PPTX"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-950 dark:text-red-300 dark:border-red-700">
            <FileWarning className="w-4 h-4" />
            <span><strong>Error:</strong> {error}</span>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg dark:bg-green-950 dark:text-green-300 dark:border-green-700">
            <FileCheck2 className="w-4 h-4" />
            <span><strong>Success:</strong> {successMessage}</span>
          </div>
        )}
      </div>
    </main>
  );
}
