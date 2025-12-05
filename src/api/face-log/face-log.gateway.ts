import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { FaceLogResponseDto } from "./dto/face-log-response.dto";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class FaceLogGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	private readonly logger = new Logger(FaceLogGateway.name);

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	emitNewFaceLog(faceLog: FaceLogResponseDto) {
		this.server.emit("newFaceLog", faceLog);
		this.logger.log(`Emitted new face log: ${faceLog.id}`);
	}
}
