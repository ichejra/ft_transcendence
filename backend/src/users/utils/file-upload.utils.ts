import { extname } from 'path';

export const fileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };
  
  export const editFileName = (req: any, file: any, callback: any) => {
    callback(null, req.user.id + extname(file.originalname));
  };