import { BadRequestException } from '@nestjs/common';
import * as fs  from 'fs';
import { extname } from 'path';

export const fileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('Only image files are allowed!'), false);
    }
    callback(null, true);
  };
  
  export const editFileName = (req: any, file: any, callback: any) => {
    const files = fs.readdirSync(`${process.env.DESTINATION}`);
    files.forEach(file => {
      if (file.match(`${req.user.id}`)){
        fs.unlinkSync(`${process.env.DESTINATION}/${file}`);
      }
    })
    callback(null, req.user.id + extname(file.originalname));
  };