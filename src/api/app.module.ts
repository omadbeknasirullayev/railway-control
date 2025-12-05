import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { appConfig } from "src/config/app.config";
import { CorrelatorMiddleware } from "../infrastructure/middleware/correlator";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { StationModule } from "./station/station.module";
import { EmployeeModule } from './employee/employee.module';
import { TrainScheduleModule } from './train-schedule/train-schedule.module';
import { FaceLogModule } from './face-log/face-log.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "postgres",
			url: appConfig.DB_URL,
			entities: [__dirname + "/../common/database/enity/*.entity{.ts,.js}"],
			synchronize: true,
		}),
		NestScheduleModule.forRoot(),
		AuthModule,
		StationModule,
		EmployeeModule,
		TrainScheduleModule,
		FaceLogModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelatorMiddleware).forRoutes("*");
	}
}
