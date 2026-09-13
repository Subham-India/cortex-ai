import { useRef, useState } from "react";
import { Paperclip, Search, Lightbulb, MoreHorizontal, ArrowUp } from "../icons";
import { uploadDocument } from "../../services/chatService";

const CloseIcon = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChatInput = ({
  message,
  setMessage,
  sendMessage,
  loading,
  getToken,
  documentId,
  setDocumentId,
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const token = await getToken();
      const result = await uploadDocument(file, token);
      setDocumentId(result.document_id);
      setFileName(file.name);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearDocument = () => {
    setDocumentId(null);
    setFileName(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3">
      {fileName && (
        <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-gray-50 rounded-lg w-fit text-xs text-gray-600">
          <span>📄 {fileName}</span>
          <button onClick={clearDocument} className="hover:text-gray-900">
            <CloseIcon size={12} />
          </button>
        </div>
      )}
      {uploading && <div className="text-xs text-gray-400 mb-2 px-2">Uploading…</div>}
      {uploadError && <div className="text-xs text-red-500 mb-2 px-2">{uploadError}</div>}

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder={documentId ? "Ask about your document…" : "Ask anything"}
        className="w-full px-2 py-2 outline-none text-[15px] placeholder:text-gray-400"
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            <Paperclip size={16} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm text-gray-700">
            <Search size={14} />
            Deep Search
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm text-gray-700">
            <Lightbulb size={14} />
            Reason
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white disabled:opacity-50 hover:bg-gray-800"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;