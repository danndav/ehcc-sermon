import { BadRequestException, Injectable } from '@nestjs/common';
import { AttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { Attendance } from '../../domain/entities/attendance.entity';

// HQ coordinates
const HQ_LATITUDE = 6.6313272;
const HQ_LONGITUDE = 3.3549024;
const GEOFENCE_RADIUS_METERS = 500;

function isWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radiusMeters: number): boolean {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= radiusMeters;
}

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async clockIn(userId: number, latitude: number, longitude: number, branchId?: number): Promise<Attendance> {
    // Check if already clocked in today
    const existing = await this.attendanceRepository.findTodayByUser(userId);
    if (existing) {
      throw new BadRequestException('Already clocked in today');
    }

    // Validate geofence
    if (!isWithinRadius(latitude, longitude, HQ_LATITUDE, HQ_LONGITUDE, GEOFENCE_RADIUS_METERS)) {
      throw new BadRequestException('You are not at church. Please move closer to clock in.');
    }

    return this.attendanceRepository.create({
      userId,
      latitude,
      longitude,
      branchId: branchId ?? null,
      clockedInAt: new Date(),
    });
  }

  async clockOut(userId: number): Promise<Attendance> {
    const record = await this.attendanceRepository.findTodayByUser(userId);
    if (!record) {
      throw new BadRequestException('You have not clocked in today');
    }
    if (record.clockedOutAt) {
      throw new BadRequestException('Already clocked out today');
    }

    // Clock-out only allowed from 1pm (13:00) Nigeria time (WAT = UTC+1)
    const now = new Date();
    const nigeriaHour = new Date(now.getTime() + 1 * 60 * 60 * 1000).getUTCHours();
    if (nigeriaHour < 13) {
      throw new BadRequestException('Clock-out is only available from 1:00 PM');
    }

    record.clockedOutAt = now;
    return this.attendanceRepository.save(record);
  }

  async getTodayStatus(userId: number): Promise<{ clockedIn: boolean; clockedInAt: string | null; clockedOut: boolean; clockedOutAt: string | null }> {
    const record = await this.attendanceRepository.findTodayByUser(userId);
    return {
      clockedIn: !!record,
      clockedInAt: record ? record.clockedInAt.toISOString() : null,
      clockedOut: !!record?.clockedOutAt,
      clockedOutAt: record?.clockedOutAt ? record.clockedOutAt.toISOString() : null,
    };
  }

  async getHistory(userId: number, page = 1, limit = 20) {
    const [records, total] = await this.attendanceRepository.findByUser(userId, page, limit);
    return { data: records, total, page, limit };
  }

  async getAllAttendance(page = 1, limit = 20) {
    const [records, total] = await this.attendanceRepository.findAll(page, limit);
    return { data: records, total, page, limit };
  }

  async getTodayAttendance() {
    const records = await this.attendanceRepository.findTodayAll();
    return { data: records, count: records.length };
  }

  async adminClockIn(userId: number, latitude: number, longitude: number, branchId?: number): Promise<Attendance> {
    const existing = await this.attendanceRepository.findTodayByUser(userId);
    if (existing) {
      throw new BadRequestException('User is already clocked in today');
    }

    if (!isWithinRadius(latitude, longitude, HQ_LATITUDE, HQ_LONGITUDE, GEOFENCE_RADIUS_METERS)) {
      throw new BadRequestException('You must be at church to clock in a member.');
    }

    return this.attendanceRepository.create({
      userId,
      branchId: branchId ?? null,
      latitude,
      longitude,
      clockedInAt: new Date(),
    });
  }
}
