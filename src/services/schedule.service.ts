import { apiClient } from "./api-client";
import type { Lang } from "@/i18n/types";

export interface AvailabilityResponse {
  slots: Record<string, string[]>;
}

export interface ScheduleRequest {
  name: string;
  company: string;
  email: string;
  description?: string;
  datetime: string;
  timezone: string;
  lang: Lang;
}

export interface RescheduleRequest {
  eventId: string;
  email: string;
  datetime: string;
  lang: Lang;
}

export interface ScheduleResponse {
  success: boolean;
}

export interface RescheduleResponse {
  success: boolean;
  action: string;
}

export function getAvailability(
  from: string,
  to: string,
): Promise<AvailabilityResponse> {
  return apiClient.get<AvailabilityResponse>(
    `/api/availability?from=${from}&to=${to}`,
  );
}

export function scheduleCall(
  data: ScheduleRequest,
): Promise<ScheduleResponse> {
  return apiClient.post<ScheduleResponse>("/api/schedule", data);
}

export function rescheduleCall(
  data: RescheduleRequest,
): Promise<RescheduleResponse> {
  return apiClient.post<RescheduleResponse>("/api/reschedule", data);
}
