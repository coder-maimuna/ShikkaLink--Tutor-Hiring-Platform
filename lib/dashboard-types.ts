export interface StudentDashboardResponse {
  success?: boolean;
  user?: { full_name?: string; email?: string };
  profile?: { student_class?: string; tutor_preference?: string } | null;
  stats?: {
    active_subjects?: number;
    session_hours?: number;
    my_tutors?: number;
    today_sessions?: number;
  };
  todaySessions?: Array<{
    session_id?: number;
    subject?: string;
    scheduled_time?: string;
    status?: string;
    meeting_link?: string | null;
    tutor_id?: number;
  }>;
  myTutors?: Array<{
    tutor_id?: number;
    tutor_name?: string;
    subject?: string;
    rating?: number | string;
  }>;
  progress?: Array<{
    subject?: string;
    session_count?: number;
    progress_percentage?: number;
  }>;
}

export interface TutorDashboardResponse {
  success?: boolean;
  user?: { full_name?: string };
  stats?: {
    active_students?: number;
    sessions_this_month?: number;
    rating?: number | string;
  };
  todaySessions?: Array<{
    session_id?: number;
    subject?: string;
    scheduled_time?: string;
    status?: string;
    meeting_link?: string | null;
    student_id?: number;
    student_name?: string;
  }>;
  myStudents?: Array<{
    student_id?: number;
    student_name?: string;
    subject?: string;
    student_class?: string;
    session_count?: number;
  }>;
  practiceTests?: Array<{
    test_id?: number;
    title?: string;
    type?: string;
    question_count?: number;
    status?: string;
    assign_date?: string | null;
    assigned_to?: number | null;
  }>;
  slots?: Array<{
    slot_id?: number;
    day_of_week?: string;
    time_slot?: string;
    subject?: string;
  }>;
  tuitionBoard?: Array<{
    listing_id?: number;
    subject?: string;
    days_per_week?: number;
    hours_per_session?: number;
    rate_bdt?: number;
    mode?: string;
  }>;
}

export interface TutorProfileDetailsResponse {
  education?: {
    id?: number;
    tutor_id?: number;
    current_institution?: string | null;
    current_level?: string | null;
    current_subject?: string | null;
    current_grad_year?: string | null;
    current_gpa?: string | null;
    prev_institution?: string | null;
    prev_level?: string | null;
    prev_subject?: string | null;
    prev_grad_year?: string | null;
    prev_gpa?: string | null;
  } | null;
  preference?: {
    id?: number;
    tutor_id?: number;
    subjects?: string | null;
    class_range?: string | null;
    preferred_gender?: string | null;
    tuition_type?: string | null;
    salary_range_min?: number | null;
    salary_range_max?: number | null;
    preferred_curriculum?: string | null;
  } | null;
  experiences?: Array<{
    id?: number;
    tutor_id?: number;
    institution?: string | null;
    class_range?: string | null;
    subjects?: string | null;
    duration?: string | null;
  }>;
  documents?: Array<{
    id?: number;
    tutor_id?: number;
    document_type?: string | null;
    file_name?: string | null;
    file_url?: string | null;
    uploaded_at?: string | null;
  }>;
}

export interface AdminDashboardResponse {
  success?: boolean;
  user?: { full_name?: string };
  stats?: {
    total_students?: number;
    total_tutors?: number;
    verified_tutors?: number;
    pending_tutors?: number;
    open_complaints?: number;
    total_sessions?: number;
  };
  recentPendingTutors?: Array<{
    user_id?: number;
    full_name?: string;
    email?: string;
    phone?: string;
    created_at?: string;
    tutorProfile?: {
      rating?: number | string;
      teaching_experience?: string;
      student_preference?: string;
    };
  }>;
}

export interface AdminTutorResponse {
  success?: boolean;
  tutors?: Array<{
    user_id?: number;
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: string;
    tutorProfile?: {
      rating?: number | string;
      teaching_experience?: string;
      student_preference?: string;
    };
  }>;
}

export interface AdminStudentResponse {
  success?: boolean;
  students?: Array<{
    user_id?: number;
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    is_active?: boolean;
    created_at?: string;
    studentProfile?: {
      student_class?: string;
      tutor_preference?: string;
    };
  }>;
}

export interface AdminPendingTutorResponse {
  success?: boolean;
  pending_tutors?: Array<{
    user_id?: number;
    full_name?: string;
    email?: string;
    phone?: string;
    created_at?: string;
    tutorProfile?: {
      rating?: number | string;
      teaching_experience?: string;
      student_preference?: string;
    };
    documents?: Array<{
      id?: number;
      tutor_id?: number;
      document_type?: string;
      file_name?: string;
      file_url?: string;
      uploaded_at?: string;
    }>;
    education?: {
      id?: number;
      tutor_id?: number;
      current_institution?: string;
      current_level?: string;
      current_subject?: string;
      current_grad_year?: string;
      current_gpa?: string;
    } | null;
    preference?: {
      id?: number;
      tutor_id?: number;
      subjects?: string;
      class_range?: string;
      preferred_gender?: string;
      tuition_type?: string;
      salary_range_min?: number | null;
      salary_range_max?: number | null;
      preferred_curriculum?: string;
    } | null;
  }>;
}

export interface AdminTutorFullProfileResponse {
  success?: boolean;
  tutor?: {
    user_id?: number;
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: string;
    tutorProfile?: {
      rating?: number | string;
      teaching_experience?: string;
      student_preference?: string;
    };
    documents?: Array<{
      id?: number;
      tutor_id?: number;
      document_type?: string;
      file_name?: string;
      file_url?: string;
      uploaded_at?: string;
    }>;
    education?: {
      id?: number;
      tutor_id?: number;
      current_institution?: string;
      current_level?: string;
      current_subject?: string;
      current_grad_year?: string;
      current_gpa?: string;
    } | null;
    preference?: {
      id?: number;
      tutor_id?: number;
      subjects?: string;
      class_range?: string;
      preferred_gender?: string;
      tuition_type?: string;
      salary_range_min?: number | null;
      salary_range_max?: number | null;
      preferred_curriculum?: string;
    } | null;
    experiences?: Array<{
      id?: number;
      tutor_id?: number;
      institution?: string;
      class_range?: string;
      subjects?: string;
      duration?: string;
    }>;
  };
}

export interface AdminUsersResponse {
  success?: boolean;
  users?: Array<{
    user_id?: number;
    full_name?: string;
    email?: string;
    role?: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: string;
  }>;
}
