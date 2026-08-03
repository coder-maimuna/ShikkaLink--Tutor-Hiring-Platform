// Create Session Request
export interface CreateSessionRequest {
  tutor_id: number;
  subject: string;
  duration_minutes: number;
}

// Session Response
export interface Session {
  session_id: number;
  tutor_id: number;
  student_id: number;
  subject: string;
  scheduled_time: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  meeting_link?: string;
  duration_minutes?: number;
  created_at: Date;
  tutor_name?: string;
  scheduled_time_formatted?: string;
  student_name?: string;
  booked_date?: Date;
  tutor?: {
    user_id: number;
    full_name: string;
    email: string;
  };
  student?: {
    user_id: number;
    full_name: string;
    email: string;
  };
}

// Get Student Sessions Response
export interface StudentSessionsResponse {
  success: boolean;
  sessions: Session[];
  total: number;
}

// Get Tutor Sessions Response
export interface TutorSessionsResponse {
  success: boolean;
  sessions: Session[];
  total: number;
}
