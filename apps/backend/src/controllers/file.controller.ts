// Implementation of Priority 8: Assignment Submission - File Upload
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3, Day 5-7, Line 370

import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// For now, use local storage (production will use S3)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, JPG, PNG allowed.'));
    }
  }
});

export const uploadFile = upload.single('file');

export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📤 File upload request received');
    
    if (!req.file) {
      console.log('❌ No file in request');
      res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded successfully:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      url: fileUrl
    });

    res.json({ 
      success: true, 
      data: { 
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      } 
    });
  } catch (error: any) {
    console.error('❌ File upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
