import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/api/client';

interface AssignmentSubmissionProps {
  stepId: string;
  enrollmentId: string;
  existingSubmission?: {
    submissionText?: string;
    submissionFileUrl?: string;
    status: string;
  };
  onSubmitSuccess?: () => void;
}

export const AssignmentSubmission: React.FC<AssignmentSubmissionProps> = ({
  stepId,
  enrollmentId,
  existingSubmission,
  onSubmitSuccess,
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load existing submission
  useEffect(() => {
    if (existingSubmission) {
      if (existingSubmission.submissionText) {
        setSubmissionText(existingSubmission.submissionText);
      }
      if (existingSubmission.submissionFileUrl) {
        setUploadedFileUrl(existingSubmission.submissionFileUrl);
      }
      if (existingSubmission.status === 'SUBMITTED') {
        setSuccess(true);
      }
    }
  }, [existingSubmission]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Validate file
  const validateAndSetFile = (file: File) => {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, DOC, DOCX, TXT, JPG, and PNG files are allowed');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Handle drag and drop
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

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Upload file
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await api.files.upload(selectedFile);
      setUploadedFileUrl(response.data.url);
      setSelectedFile(null); // Clear selected file after upload
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit assignment
  const handleSubmit = async () => {
    if (!submissionText && !uploadedFileUrl) {
      setError('Please provide either text or upload a file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.progress.submitAssignment(stepId, {
        enrollmentId,
        submissionText: submissionText || undefined,
        submissionFileUrl: uploadedFileUrl || undefined,
      });

      setSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character counter
  const characterCount = submissionText.length;
  const maxCharacters = 5000;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Assignment Submitted Successfully!</h4>
            <p className="text-sm text-green-700 mt-1">
              Your submission has been saved. You can update it anytime before the deadline.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Text Submission */}
      <div className="space-y-2">
        <label htmlFor="submissionText" className="block font-medium text-gray-700">
          Your Response
        </label>
        <textarea
          id="submissionText"
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Type your assignment response here..."
          maxLength={maxCharacters}
          disabled={success}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {characterCount} / {maxCharacters} characters
          </span>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <label className="block font-medium text-gray-700">Attach File (Optional)</label>

        {/* Drag and Drop Area */}
        {!uploadedFileUrl && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your file here, or{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                browse
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  disabled={success}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
          </div>
        )}

        {/* Selected File */}
        {selectedFile && !uploadedFileUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload File'
              )}
            </button>
          </div>
        )}

        {/* Uploaded File */}
        {uploadedFileUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">File uploaded successfully</p>
                <a
                  href={uploadedFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-800 underline"
                >
                  View file
                </a>
              </div>
            </div>
            {!success && (
              <button
                onClick={() => setUploadedFileUrl(null)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {!success && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!submissionText && !uploadedFileUrl)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Assignment'
            )}
          </button>
        </div>
      )}

      {/* Update Button */}
      {success && (
        <div className="flex justify-end">
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Update Submission
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;
