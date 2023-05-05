import { Replace } from '@src/intra/helpers/replace';

export interface IPropsOTP {
  userIdentificator: string;
  code: string;
  checked: boolean;
  createdAt: Date;
}

type IPropsConstructor = Replace<
  Replace<IPropsOTP, { checked?: boolean }>,
  { createdAt?: Date }
>;

export class OTP {
  private props: IPropsOTP;

  constructor(props: IPropsConstructor) {
    this.props = {
      userIdentificator: props.userIdentificator,
      checked: props.checked ?? false,
      code: props.code,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  // code
  get userIdentificator(): string {
    return this.props.userIdentificator;
  }

  // code
  get code(): string {
    return this.props.code;
  }

  // checked
  get checked(): boolean {
    return this.props.checked;
  }

  set checked(checked: boolean) {
    this.props.checked = checked;
  }

  // createdAt
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
