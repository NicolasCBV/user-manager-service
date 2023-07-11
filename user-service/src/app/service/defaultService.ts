interface IProps<T> {
  previsibleErrors: T;
}

export class DefaultService<T> {
  protected readonly props: IProps<T>;

  constructor(input: IProps<T>) {
    this.props = input;
  }

  get previsibileErrors(): IProps<T>['previsibleErrors'] {
    return this.props.previsibleErrors;
  }
}
