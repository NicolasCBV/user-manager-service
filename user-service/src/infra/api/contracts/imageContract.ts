export abstract class ImageContract {
  abstract send(file: Express.Multer.File): Promise<void>;
  abstract delete(url: string): Promise<void>;
}
