interface IProps {
  name: string;
  message: string;
  state: string;
}

export class CacheError extends Error {
  readonly _state;

  constructor(input: IProps) {
    super(input.message);

    this.name = input.name;
    this._state = input.state;

    Object.setPrototypeOf(this, CacheError);
  }
}
