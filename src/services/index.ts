export { apiClient, ApiClientError } from "./api-client";
export {
  getAvailability,
  scheduleCall,
  rescheduleCall,
} from "./schedule.service";
export type {
  AvailabilityResponse,
  ScheduleRequest,
  RescheduleRequest,
  ScheduleResponse,
  RescheduleResponse,
} from "./schedule.service";
