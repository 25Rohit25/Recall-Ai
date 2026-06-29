export const MEETING_STATUS = {
  PROCESSING: "processing",
  ANALYZED: "analyzed",
  FAILED: "failed"
} as const;

export type MeetingStatus = typeof MEETING_STATUS[keyof typeof MEETING_STATUS];

export const APP_LIMITS = {
  MAX_FILE_SIZE_MB: 500,
  MAX_DURATION_MINUTES: 180,
  SUPPORTED_FORMATS: ["video/mp4", "audio/mpeg", "audio/wav"]
} as const;
