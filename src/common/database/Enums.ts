export enum RolesEnum {
	SUPER_ADMIN = "super_admin",
	ADMIN = "admin",
	PATIENT = "patient",
	DOCTOR = "doctor",
}

export enum GenderEnum {
	MALE = "male",
	FEMALE = "female",
}

export enum WorkingStatusEnum {
	ACTIVE = "active",
	INACTIVE = "inactive",
	PENDING = "pending",
	BLOCKED = "blocked",
}

export enum OtpTypeEnum {
	DOCTOR = "doctor",
	PATIENT = "patient",
}

export enum DoctorStatus {
	UPLOADED = "uploaded", // filelarni yuklash jarayonida
	PENDING = "pending", // tasdiqlash kutilmoqda
	RESUBMITTED = "resubmitted", // qayta tasdiqlash uchun yuborgan
	ACTIVE = "active", // active holatda
	SUSPENDED = "suspended", // ma'lum sabablarga ko'ra to'xtatilgan
	REVOKED = "revoked", // ruxsat olib tashlangan
	REJECTED = "rejected", // rad etilgan
	REUPLOAD = "reupload", // hujjatni qayta yuklash kerak
}

export enum DoctorBookingModeEnum {
	REMOTE = "remote", // online/virtual
	ONSITE = "onsite", // klinikada
	HOME = "home", // uyga chaqirish
}

export enum BookingStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	CANCELLED = "cancelled",
	REJECTED = "rejected",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
	DIRECTED = "directed",
}

export enum CardOwnerType {
	DOCTOR = "doctor",
	PATIENT = "patient",
}

export enum TransactionStatus {
	Waiting = "waiting",
	Paid = "paid",
	Failed = "failed",
	Canceled = "canceled",
}

export enum CardType {
	UzCard = "uzcard",
	Humo = "humo",
	Master = "master",
	Visa = "visa",
	Mir = "mir",
}

export enum StaffRole {
	TRAIN_CHIEF = "train_chief",
	WAGON_SUPERVISOR = "wagon_supervisor",
}


export enum EmployeeAttendanceStatus {
	EXPECTED = "expected", // Kutilmoqda
	ARRIVED = "arrived", // Keldi
	LEFT = "left", // Chiqdi
	LATE = "late", // Kech qoldi
	ABSENT = "absent", // Kelmadi
}
