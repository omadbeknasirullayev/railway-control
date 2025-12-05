import { PartialType } from "@nestjs/swagger";
import { CreateFaceLogDto } from "./create-face-log.dto";

export class UpdateFaceLogDto extends PartialType(CreateFaceLogDto) {}