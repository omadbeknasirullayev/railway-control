import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { SendOtpCodeDto } from "./dto/send-otp-code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import axios from "axios";
import { VerifySmsCodeDto } from "./dto/verify-sms-code.dto";
import { errorPrompt } from "src/infrastructure/lib/prompts/errorPrompt";
import { OtpTypeEnum, RolesEnum } from "src/common/database/Enums";
import { LoginDto } from "./dto/login.dto";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtToken: JwtToken,
	) {}

}

export function generateVerificationCode(): string {
	return Math.floor(1000 + Math.random() * 9000).toString();
}

export function AddMinutesToDate(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000).getTime();
}
