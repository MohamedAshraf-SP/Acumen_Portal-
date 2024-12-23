import multer from "multer";
import path from "path";
import fs from "fs";

const urlParsingLastWord = (url) => {
  if (!url) return "default";
  const match = url.match(/\/([^\/?]+)\/?$/); // Ignore query strings
  return match ? match[1] : "default";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.lastword = urlParsingLastWord(req.baseUrl);
    const uploadPath = `uploads/${req.lastword}`;
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Create directories recursively
      }
      cb(null, uploadPath); // Folder where files will be saved
    } catch (error) {
      cb(new Error("Failed to create upload directory"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = "_" + Date.now();
    const sanitizedFileName = path.basename(file.originalname); // Sanitize file name
    cb(null, `${req.lastword}${uniqueSuffix}_${sanitizedFileName}`);
  },
});

export const upload = multer({ storage: storage });
