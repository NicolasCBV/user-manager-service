import {
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { IJwtTokenUser } from '@app/auth/jwt.core';
import { UploadImageService } from '@app/service/authenticated/uploadImage.service';
import { Request } from 'express';
import { name } from '..';

@Controller(name)
export class UpdateUserImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('upload-image')
  async uploadImage(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/png|image\/gif|image\/pjpeg)/gm,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const user = req.user as IJwtTokenUser;

    const url = await this.uploadImageService
      .exec(user.sub, file)
      .catch((err) => {
        if (err.message === "This user doesn't exist")
          throw new HttpException(err.message, HttpStatus.CONFLICT);

        throw new HttpException('Error on update image', HttpStatus.CONFLICT);
      });

    return { url };
  }
}
