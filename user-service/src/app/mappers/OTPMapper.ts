import { OTP } from "../entities/OTP/_OTP";

interface OTPInJson {
    props: {
        userIdentificator: string,
      checked: boolean,
      code: string,
      createdAt: string,
    };
}

export class OTPMapper {
    static fromJsonToClass(otp: OTPInJson): OTP {
        return new OTP({
            code: otp.props.code,
            userIdentificator: otp.props.userIdentificator,
            checked: otp.props.checked,
            createdAt: new Date(otp.props.createdAt)
        });
    }
}