import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../client/public/uploads'));
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    cb(null, originalname);
  },
});

export const resumeUpload = multer({
  storage: storage
}).single('resume')

export const uploads = multer({
  storage: storage
}).single('companyLogo');


export const profileImgUpload = multer({
  storage: storage
}).single('profileImg');

export const exampleUpload = multer({
  storage: storage
}).single('attachment');