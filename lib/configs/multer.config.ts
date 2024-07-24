import { diskStorage } from 'multer';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
};
