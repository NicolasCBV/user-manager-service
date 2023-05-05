export interface ISendMailContent {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export abstract class EmailAdapter {
  abstract send: (data: ISendMailContent) => Promise<void>;
}
