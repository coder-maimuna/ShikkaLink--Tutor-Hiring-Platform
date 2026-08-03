const prisma = require('../config/prisma');

/**
 * Create a new session (student booking)
 * POST /api/sessions
 * Requires: student authentication + role check
 */
exports.createSession = async (req, res) => {
  try {
    console.log('=== Creating Session ===');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);

    const { student_id } = req.user; // From auth middleware
    const { tutor_id, subject, duration_minutes } = req.body;

    console.log('student_id from user:', student_id);
    console.log('tutor_id:', tutor_id);
    console.log('subject:', subject);
    console.log('duration_minutes:', duration_minutes);

    // Validate required fields
    if (!tutor_id || !subject || !duration_minutes) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: tutor_id, subject, duration_minutes'
      });
    }

    // Check if tutor exists and is verified
    const tutor = await prisma.user.findUnique({
      where: { user_id: parseInt(tutor_id) },
      select: { user_id: true, role: true, is_verified: true }
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    if (tutor.role !== 'tutor') {
      return res.status(400).json({
        success: false,
        message: 'Only tutors can be booked'
      });
    }

    if (!tutor.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book sessions with unverified tutors'
      });
    }

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { user_id: student_id },
      select: { user_id: true, role: true }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'Only students can book sessions'
      });
    }

    console.log('Creating session with data:', {
      tutor_id: parseInt(tutor_id),
      student_id: student_id,
      subject,
      scheduled_time: new Date(),
      status: 'upcoming',
      duration_minutes: parseInt(duration_minutes)
    });

    const session = await prisma.session.create({
      data: {
        tutor_id: parseInt(tutor_id),
        student_id: student_id,
        subject,
        scheduled_time: new Date(),
        status: 'upcoming',
        duration_minutes: parseInt(duration_minutes)
      },
      include: {
        tutor: {
          select: {
            user_id: true,
            full_name: true,
            email: true
          }
        }
      }
    });

    console.log('Session created successfully:', session);

    res.status(201).json({
      success: true,
      message: 'Session booked successfully',
      session
    });

  } catch (error) {
    console.error('=== Error Creating Session ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message,
      details: error.stack
    });
  }
};

/**
 * Get all sessions for the logged-in student
 * GET /api/student/sessions?status=upcoming
 * Protected route - requires student authentication
 */
exports.getStudentSessions = async (req, res) => {
  try {
    const { student_id } = req.user; // From auth middleware
    const { status } = req.query;

    // Build filter based on status query parameter
    const where = {
      student_id: student_id
    };

    if (status && ['upcoming', 'completed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    // Fetch sessions with tutor details
    const sessions = await prisma.session.findMany({
      where,
      orderBy: { scheduled_time: 'desc' },
      include: {
        tutor: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            address: true
          }
        }
      }
    });

    // Add readable date strings
    const formattedSessions = sessions.map(session => ({
      ...session,
      tutor_name: session.tutor.full_name,
      scheduled_time_formatted: session.scheduled_time.toISOString()
    }));

    res.json({
      success: true,
      sessions: formattedSessions,
      total: formattedSessions.length
    });

  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message
    });
  }
};

/**
 * Get all sessions for the logged-in tutor
 * GET /api/tutor/sessions?status=upcoming
 * Protected route - requires tutor authentication
 */
exports.getTutorSessions = async (req, res) => {
  try {
    const { tutor_id } = req.user; // From auth middleware
    const { status } = req.query;

    // Build filter based on status query parameter
    const where = {
      tutor_id: parseInt(tutor_id)
    };

    if (status && ['upcoming', 'completed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    // Fetch sessions with student details
    const sessions = await prisma.session.findMany({
      where,
      orderBy: { scheduled_time: 'desc' },
      include: {
        student: {
          select: {
            user_id: true,
            full_name: true,
            email: true
          }
        }
      }
    });

    // Add readable date strings
    const formattedSessions = sessions.map(session => ({
      ...session,
      student_name: session.student.full_name,
      booked_date: session.scheduled_time
    }));

    res.json({
      success: true,
      sessions: formattedSessions,
      total: formattedSessions.length
    });

  } catch (error) {
    console.error('Error fetching tutor sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message
    });
  }
};

/**
 * Delete a session (cancel booking)
 * DELETE /api/sessions/:session_id
 * Protected route - requires authentication (student or tutor)
 */
exports.deleteSession = async (req, res) => {
  try {
    const session_id = parseInt(req.params.session_id);

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { session_id },
      include: {
        student: true,
        tutor: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify the user has permission to delete this session
    const { user_id, role } = req.user;

    // Students can only cancel their own sessions
    if (role === 'student' && session.student_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own sessions'
      });
    }

    // Tutors can only cancel their own sessions
    if (role === 'tutor' && session.tutor_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own sessions'
      });
    }

    // Delete the session
    await prisma.session.delete({
      where: { session_id }
    });

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel session',
      error: error.message
    });
  }
};
