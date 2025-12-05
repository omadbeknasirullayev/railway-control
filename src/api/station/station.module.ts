import { Module } from "@nestjs/common";
import { StationService } from "./station.service";
import { StationController } from "./station.controller";
import { Station } from "src/common/database/enity/station.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([Station])],
	controllers: [StationController],
	providers: [StationService],
})
export class StationModule {}
