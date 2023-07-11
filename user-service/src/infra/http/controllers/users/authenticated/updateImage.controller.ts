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
import { DefaultController } from '../../defaultController';

@Controller(name)
export class UpdateUserImageController extends DefaultController {
  constructor(private readonly uploadImageService: UploadImageService) {
    super();

    const { notFound } = this.uploadImageService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: notFound.message,
        to: new HttpException(notFound.message, HttpStatus.NOT_FOUND),
      },
    ]);
  }

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
      .catch((err) => this.interpretErrors(err));

    return { url };
  }
}
