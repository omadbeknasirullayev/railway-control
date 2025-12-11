import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { SendOtpCodeDto } from "./dto/send-otp-code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import axios from "axios";
import { VerifySmsCodeDto } from "./dto/verify-sms-code.dto";
import { errorPrompt } from "src/infrastructure/lib/prompts/errorPrompt";
import { RolesEnum } from "src/common/database/Enums";
import { LoginDto } from "./dto/login.dto";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Admin } from "src/common/database/enity";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Admin)
		private readonly adminRepo: Repository<Admin>,
		private readonly jwtToken: JwtToken,
	) {}
	/** admin login */
	async adminLogin(dto: LoginDto) {
		const admin = await this.adminRepo.findOneBy({
			username: dto.username,
			isActive: true,
			isDeleted: false,
		});
		if (!admin) {
			throw new HttpException(errorPrompt.usernameOrPasswordIncorrect, 400);
		}
		const isMatch = await BcryptEncryption.compare(dto.password, admin.password);
		if (!isMatch) {
			throw new HttpException(errorPrompt.usernameOrPasswordIncorrect, 400);
		}

		return { ...admin, token: await this.jwtToken.generateToken(admin, admin.role) };
	}
}

export function generateVerificationCode(): string {
	return Math.floor(1000 + Math.random() * 9000).toString();
}

export function AddMinutesToDate(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000).getTime();
}
