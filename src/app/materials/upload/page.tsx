"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function UploadMaterialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress for UI purposes (fetch doesn't support upload progress natively easily without XHR)
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      if (res.ok) {
        setResult({ success: `File uploaded successfully: ${data.fileAsset.name}` });
        setFile(null);
      } else {
        setResult({ error: data.error || "Upload failed." });
      }
    } catch (err) {
      setResult({ error: "An unexpected error occurred during upload." });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-16 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-10 border border-slate-700/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10" />
        
        <h1 className="text-3xl font-bold text-white mb-2">
          Upload <span className="neon-text-cyan">Content</span>
        </h1>
        <p className="text-slate-400 mb-8">
          Upload PDF modules, images, or assignment files.
        </p>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
              result.success 
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}
          >
            {result.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm">{result.success || result.error}</p>
          </motion.div>
        )}

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? "border-cyan-500 bg-cyan-500/10 scale-[1.02]" 
                : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/30"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Click or drag file to this area to upload</h3>
            <p className="text-slate-500 text-sm">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center">
                  <File className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium truncate max-w-[200px] md:max-w-md">{file.name}</h4>
                  <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!uploading && (
                <button 
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={removeFile}
                disabled={uploading}
                className="px-6 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={uploadFile}
                disabled={uploading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-cyan-500/25 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
