import { extname } from 'path';

export const fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };
  
  export const editFileName = (req, file, callback) => {
    callback(null, req.user.id + extname(file.originalname));
  };