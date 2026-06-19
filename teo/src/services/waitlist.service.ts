import { apiClient } from "./api-client";

export interface WaitlistRequest {
  email: string;
  childAges: number[];
}

export interface WaitlistResponse {
  success: boolean;
}

export function joinWaitlist(data: WaitlistRequest): Promise<WaitlistResponse> {
  return apiClient.post<WaitlistResponse>("/api/waitlist", data);
}
