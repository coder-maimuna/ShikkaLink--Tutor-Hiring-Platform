//sprint 3 afra---
const prisma = require('../config/prisma');

const sendDashboardResponse = (res, statusCode, payload) => res.status(statusCode).json(payload);

exports.studentDashboard = async (req, res) => {
  console.log('dashboard.controller.studentDashboard entered, req.user=', req.user);
  const userId = req.user && req.user.user_id;
  if (!userId) return sendDashboardResponse(res, 401, { success: false, message: 'No authenticated user' });
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { full_name: true, email: true }
    });

    if (!user) {
      return sendDashboardResponse(res, 404, { success: false, message: 'User not found' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { user_id: userId }
    });

    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd   = new Date(); todayEnd.setHours(23,59,59,999);

    const todaySessions = await prisma.session.findMany({
      where: { student_id: userId, scheduled_time: { gte: todayStart, lte: todayEnd } },
      orderBy: { scheduled_time: 'asc' }
    });

    const allSessions = await prisma.session.findMany({
      where: { student_id: userId }
    });

    const activeSubjects = [...new Set(allSessions.map(s => s.subject))].length;
    const completedSessions = allSessions.filter(s => s.status === 'completed');

    const subjectMap = {};
    completedSessions.forEach(s => {
      subjectMap[s.subject] = (subjectMap[s.subject] || 0) + 1;
    });
    
    // sprint 3 - calculate progress percentage for each subject
    const progress = Object.entries(subjectMap).map(([subject, completedCount]) => {
      const totalCount = allSessions.filter(s => s.subject === subject).length;
      const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return {
        subject,
        session_count: completedCount,
        progress_percentage: progressPercentage  // sprint 3 - add for UI progress bars
      };
    });

    // sprint 3 - fetch tutor details with ratings
    const myTutorsRaw = await prisma.session.findMany({
      where: { student_id: userId },
      distinct: ['tutor_id'],
      select: { tutor_id: true, subject: true }
    });

    // sprint 3 - enrich tutor data with names and ratings
    const myTutors = await Promise.all(
      myTutorsRaw.map(async (tutorSession) => {
        const tutorUser = await prisma.user.findUnique({
          where: { user_id: tutorSession.tutor_id },
          select: { full_name: true }
        });
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { user_id: tutorSession.tutor_id },
          select: { rating: true }
        });
        return {
          tutor_id: tutorSession.tutor_id,
          tutor_name: tutorUser?.full_name || 'Unknown',  // sprint 3 - include tutor name
          subject: tutorSession.subject,
          rating: tutorProfile?.rating || 0  // sprint 3 - include tutor rating
        };
      })
    );

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Student dashboard loaded',
      user,
      profile,
      stats: {
        active_subjects:  activeSubjects,
        session_hours:    completedSessions.length,
        my_tutors:        myTutors.length,
        today_sessions:   todaySessions.length
      },
      todaySessions,
      myTutors,
      progress
    });
  } catch (err) {
    console.error('studentDashboard error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to load student dashboard' });
  }
};

exports.tutorDashboard = async (req, res) => {
  console.log('dashboard.controller.tutorDashboard entered, req.user=', req.user);
  const userId = req.user && req.user.user_id;
  if (!userId) return sendDashboardResponse(res, 401, { success: false, message: 'No authenticated user' });
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { full_name: true, email: true, phone: true, address: true, is_verified: true }
    });

    if (!user) {
      return sendDashboardResponse(res, 404, { success: false, message: 'User not found' });
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { user_id: userId }
    });

    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd   = new Date(); todayEnd.setHours(23,59,59,999);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);

    // sprint 3 - fetch today's sessions with student names
    const todaySessionsRaw = await prisma.session.findMany({
      where: { tutor_id: userId, scheduled_time: { gte: todayStart, lte: todayEnd } },
      orderBy: { scheduled_time: 'asc' }
    });

    // sprint 3 - enrich with student names
    const todaySessions = await Promise.all(
      todaySessionsRaw.map(async (session) => {
        const studentUser = await prisma.user.findUnique({
          where: { user_id: session.student_id },
          select: { full_name: true }
        });
        return {
          ...session,
          student_name: studentUser?.full_name || 'Unknown'  // sprint 3 - add student name
        };
      })
    );

    const sessionsThisMonth = await prisma.session.count({
      where: { tutor_id: userId, scheduled_time: { gte: monthStart } }
    });

    // sprint 3 - fetch distinct students and their session counts
    const myStudentsRaw = await prisma.session.findMany({
      where: { tutor_id: userId },
      distinct: ['student_id'],
      select: { student_id: true, subject: true }
    });

    // sprint 3 - enrich with student details and session counts
    const myStudents = await Promise.all(
      myStudentsRaw.map(async (studentSession) => {
        const studentUser = await prisma.user.findUnique({
          where: { user_id: studentSession.student_id },
          select: { full_name: true }
        });
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { user_id: studentSession.student_id }
        });
        const sessionCount = await prisma.session.count({
          where: { tutor_id: userId, student_id: studentSession.student_id }
        });
        return {
          student_id: studentSession.student_id,
          student_name: studentUser?.full_name || 'Unknown',  // sprint 3 - add student name
          subject: studentSession.subject,
          student_class: studentProfile?.student_class || 'N/A',  // sprint 3 - add class info
          session_count: sessionCount  // sprint 3 - add session count
        };
      })
    );

    const practiceTests = await prisma.practiceTest.findMany({
      where: { tutor_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const slots = await prisma.availabilitySlot.findMany({
      where: { tutor_id: userId }
    });

    const tuitionBoard = await prisma.tuitionBoard.findMany({
      where: { tutor_id: userId },  // sprint 3 - FIX: only show current tutor's listings (prevents data leak)
      orderBy: { created_at: 'desc' },
      take: 5
    });

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Tutor dashboard loaded',
      user,
      stats: {
        active_students:     myStudents.length,
        sessions_this_month: sessionsThisMonth,
        rating:              tutorProfile?.rating ?? 0
      },
      todaySessions,
      myStudents,
      practiceTests,
      slots,
      tuitionBoard
    });
  } catch (err) {
    console.error('tutorDashboard error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to load tutor dashboard' });
  }
};

exports.getTutorProfileDetails = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    const education = await prisma.tutorEducation.findFirst({
      where: { tutor_id: tutorId }
    });
    const preference = await prisma.tutorPreference.findUnique({
      where: { tutor_id: tutorId }
    });
    const experiences = await prisma.tutorExperience.findMany({
      where: { tutor_id: tutorId }
    });
    const documents = await prisma.tutorDocument.findMany({
      where: { tutor_id: tutorId }
    });
    res.json({ education, preference, experiences, documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveTutorEducation = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    const existing = await prisma.tutorEducation.findFirst({
      where: { tutor_id: tutorId }
    });
    let result;
    if (existing) {
      result = await prisma.tutorEducation.update({
        where: { id: existing.id },
        data: { ...req.body, tutor_id: tutorId }
      });
    } else {
      result = await prisma.tutorEducation.create({
        data: { ...req.body, tutor_id: tutorId }
      });
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveTutorPreference = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    const result = await prisma.tutorPreference.upsert({
      where: { tutor_id: tutorId },
      update: { ...req.body },
      create: { ...req.body, tutor_id: tutorId }
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveTutorExperience = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    await prisma.tutorExperience.deleteMany({
      where: { tutor_id: tutorId }
    });
    const result = await prisma.tutorExperience.createMany({
      data: (req.body.experiences || []).map((exp) => ({
        ...exp,
        tutor_id: tutorId
      }))
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveTutorDocuments = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    // Check if req.body is an array (multiple documents) or single object (backward compatibility)
    const documents = Array.isArray(req.body) ? req.body : [req.body];

    // Create all documents
    const results = await Promise.all(
      documents.map((doc) =>
        prisma.tutorDocument.create({
          data: { ...doc, tutor_id: tutorId }
        })
      )
    );

    res.json({ success: true, data: results });
  } catch (err) {
    console.error('saveTutorDocuments error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Part 2: Submit for verification endpoint
exports.submitForVerification = async (req, res) => {
  const tutorId = req.user.user_id;
  try {
    const tutorProfile = await prisma.tutorProfile
      .findUnique({ where: { user_id: tutorId } });

    if (!tutorProfile?.teaching_experience?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please add teaching experience first'
      });
    }

    res.json({
      success: true,
      message: 'Verification submitted! Admin will review soon.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminDashboard = async (req, res) => {
  console.log('dashboard.controller.adminDashboard entered, req.user=', req.user);
  try {
    const total_students = await prisma.user.count({ where: { role: 'student' } });
    const verified_tutors = await prisma.user.count({ where: { role: 'tutor', is_verified: true } });
    const open_complaints = await prisma.complaint.count({ where: { status: 'open' } });
    const pending_verifications = await prisma.user.count({ where: { role: 'tutor', is_verified: false } });

    // sprint 3 - fetch unverified tutors
    const verificationQueueRaw = await prisma.user.findMany({
      where: { role: 'tutor', is_verified: false },
      select: {
        user_id: true, full_name: true, email: true, university: true, created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    // sprint 3 - enrich with tutor profile details (subject, experience, test score, interview status)
    const verificationQueue = await Promise.all(
      verificationQueueRaw.map(async (tutor) => {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { user_id: tutor.user_id },
          select: { 
            subject: true, 
            teaching_experience: true, 
            test_score: true, 
            interview_status: true 
          }
        });
        return {
          user_id: tutor.user_id,
          full_name: tutor.full_name,
          email: tutor.email,
          university: tutor.university || 'N/A',  // sprint 3 - add university
          subject: tutorProfile?.subject || 'Not specified',  // sprint 3 - add subject expertise
          teaching_experience: tutorProfile?.teaching_experience || 'N/A',  // sprint 3 - add experience
          test_score: tutorProfile?.test_score || 'Not taken',  // sprint 3 - add test score
          interview_status: tutorProfile?.interview_status || 'pending',  // sprint 3 - add interview status
          created_at: tutor.created_at
        };
      })
    );

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Admin dashboard loaded',
      stats: { total_students, verified_tutors, open_complaints, pending_verifications },
      verificationQueue
    });
  } catch (err) {
    console.error('adminDashboard error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to load admin dashboard' });
  }
};

// sprint 3 - NEW: Verify tutor endpoint for admin approval
exports.verifyTutor = async (req, res) => {
  console.log('dashboard.controller.verifyTutor entered, req.user=', req.user, 'params=', req.params);
  try {
    const { user_id } = req.params;
    const parsedUserId = Number.parseInt(user_id, 10);

    if (!Number.isInteger(parsedUserId)) {
      return sendDashboardResponse(res, 400, { success: false, message: 'Invalid user id' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { user_id: parsedUserId },
      select: { user_id: true, role: true, is_verified: true }
    });

    if (!targetUser) {
      return sendDashboardResponse(res, 404, { success: false, message: 'User not found' });
    }

    if (targetUser.role !== 'tutor') {
      return sendDashboardResponse(res, 400, { success: false, message: 'Only tutor accounts can be verified' });
    }

    if (targetUser.is_verified) {
      return sendDashboardResponse(res, 409, { success: false, message: 'Tutor is already verified' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: parsedUserId },
      data: { is_verified: true }
    });

    await prisma.tutorProfile.update({
      where: { user_id: parsedUserId },
      data: { interview_status: 'passed' }
    });

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Tutor verified successfully',
      data: {
        user_id: updatedUser.user_id,
        is_verified: updatedUser.is_verified
      }
    });
  } catch (err) {
    console.error('verifyTutor error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to verify tutor' });
  }
};

// sprint 3 - NEW: Reject tutor endpoint for admin rejection
exports.rejectTutor = async (req, res) => {
  console.log('dashboard.controller.rejectTutor entered, req.user=', req.user, 'params=', req.params);
  try {
    const { user_id } = req.params;
    const parsedUserId = Number.parseInt(user_id, 10);
    const { reason } = req.body;

    if (!Number.isInteger(parsedUserId)) {
      return sendDashboardResponse(res, 400, { success: false, message: 'Invalid user id' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { user_id: parsedUserId },
      select: { user_id: true, role: true }
    });

    if (!targetUser) {
      return sendDashboardResponse(res, 404, { success: false, message: 'User not found' });
    }

    if (targetUser.role !== 'tutor') {
      return sendDashboardResponse(res, 400, { success: false, message: 'Only tutor accounts can be rejected' });
    }

    await prisma.tutorProfile.update({
      where: { user_id: parsedUserId },
      data: { interview_status: 'failed' }
    });

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Tutor rejected',
      data: {
        user_id: parsedUserId,
        reason: reason || 'Not specified'
      }
    });
  } catch (err) {
    console.error('rejectTutor error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to reject tutor' });
  }
};

// sprint 3 - NEW: Get pending tutors with their documents for verification
exports.getPendingTutors = async (req, res) => {
  console.log('dashboard.controller.getPendingTutors entered, req.user=', req.user);
  try {
    const verificationQueueRaw = await prisma.user.findMany({
      where: {
        role: 'tutor',
        is_verified: false,
        is_active: true
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        university: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    // Enrich with tutor profile details and documents
    const verificationQueue = await Promise.all(
      verificationQueueRaw.map(async (tutor) => {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { user_id: tutor.user_id },
          select: {
            subject: true,
            teaching_experience: true,
            test_score: true,
            interview_status: true
          }
        });

        // Get documents for this tutor
        const documents = await prisma.tutorDocument.findMany({
          where: { tutor_id: tutor.user_id },
          select: {
            id: true,
            document_type: true,
            file_name: true,
            file_url: true,
            created_at: true
          },
          orderBy: { created_at: 'desc' }
        });

        return {
          user_id: tutor.user_id,
          full_name: tutor.full_name,
          email: tutor.email,
          phone: tutor.phone,
          university: tutor.university || 'N/A',
          created_at: tutor.created_at,
          subject: tutorProfile?.subject || 'Not specified',
          teaching_experience: tutorProfile?.teaching_experience || 'N/A',
          test_score: tutorProfile?.test_score || 'Not taken',
          interview_status: tutorProfile?.interview_status || 'pending',
          documents: documents
        };
      })
    );

    return sendDashboardResponse(res, 200, {
      success: true,
      message: 'Pending tutors loaded',
      pending_tutors: verificationQueue
    });
  } catch (err) {
    console.error('getPendingTutors error', err && err.stack);
    return sendDashboardResponse(res, 500, { success: false, message: err.message || 'Unable to load pending tutors' });
  }
};

exports.updateStudentProfile = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const { full_name, phone, address } = req.body;
    
    // Update user table
    await prisma.user.update({
      where: { user_id: userId },
      data: { full_name, phone, address }
    });
    
    // Update student_profile table
    await prisma.studentProfile.update({
      where: { user_id: userId },
      data: {
        student_class: req.body.student_class,
        tutor_preference: req.body.tutor_preference
      }
    });
    
    res.json({ 
      success: true,
      message: 'Profile updated'
    });
  } catch (err) {
    console.error('updateStudentProfile error', err && err.stack);
    res.status(500).json({ error: err.message || 'Unable to update profile' });
  }
};

exports.requestVerification = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { user_id: userId }
    });

    if (!tutorProfile?.teaching_experience?.trim()) {
      return res.status(400).json({
        error: 'Please enter teaching experience first'
      });
    }

    res.json({
      success: true,
      message: 'Verification request submitted! Admin will review soon.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTutorPersonal = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const {
      full_name, phone, address,
      teaching_experience, student_preference
    } = req.body;

    await prisma.user.update({
      where: { user_id: userId },
      data: {
        full_name: full_name || undefined,
        phone: phone || undefined,
        address: address || undefined
      }
    });

    await prisma.tutorProfile.update({
      where: { user_id: userId },
      data: {
        teaching_experience: teaching_experience || undefined,
        student_preference: student_preference || undefined
      }
    });

    res.json({ success: true, message: 'Saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
