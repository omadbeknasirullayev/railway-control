import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FaceLog } from "src/common/database/enity/face-log.entity";
import { Employee } from "src/common/database/enity/employee.entity";
import { FaceLogService } from "./face-log.service";
import { FaceLogController } from "./face-log.controller";
import { FaceLogGateway } from "./face-log.gateway";
import { HikvisionListenerService } from "./hikvision-listener.service";

@Module({
	imports: [TypeOrmModule.forFeature([FaceLog, Employee])],
	controllers: [FaceLogController],
	providers: [FaceLogService, FaceLogGateway, HikvisionListenerService],
	exports: [FaceLogService, FaceLogGateway, HikvisionListenerService],
})
export class FaceLogModule {}
