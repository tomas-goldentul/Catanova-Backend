import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../../public/imagenes");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const nombreFinal = `${base || "imagen"}-${Date.now()}${extension}`;
    cb(null, nombreFinal);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no válido. Usá PNG, JPG, WEBP o GIF."));
  }
};

export const uploadImagen = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});