import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { RolesEnum } from "src/common/database/Enums";
import { AuthPayload } from "src/common/type";
import { appConfig } from "src/config/app.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "appConfig.ACCESS_SECRET_KEY",
			// secretOrKey: config.REFRESH_SECRET_KEY,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: AuthPayload) {
		let user: {
			id: string | undefined;
			role: RolesEnum | undefined;
			phoneNumber: string | undefined;
		} | null = null;
		
		try {

		} catch (error) {
			throw error;
		}
		return user;
	}
}