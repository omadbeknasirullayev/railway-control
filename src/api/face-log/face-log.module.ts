import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FaceLog, Employee, CameraDevice } from "src/common/database/enity";
import { FaceLogService } from "./face-log.service";
import { FaceLogController } from "./face-log.controller";
import { FaceLogGateway } from "./face-log.gateway";
import { HikvisionListenerService } from "../hikvision/hikvision-listener.service";

@Module({
	imports: [TypeOrmModule.forFeature([FaceLog, Employee, CameraDevice])],
	controllers: [FaceLogController],
	providers: [FaceLogService, FaceLogGateway, HikvisionListenerService],
	exports: [FaceLogGateway],
})
export class FaceLogModule {}
