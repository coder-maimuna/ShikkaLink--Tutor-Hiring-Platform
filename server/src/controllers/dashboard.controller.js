//sprint 3 afra---
const prisma = require('../config/prisma');

exports.studentDashboard = async (req, res) => {
  console.log('dashboard.controller.studentDashboard entered, req.user=', req.user);
  const userId = req.user && req.user.user_id;
  if (!userId) return res.status(401).json({ message: 'No authenticated user' });
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { full_name: true, email: true }
    });

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

    res.json({
      user,
      profile,
      stats: {
        active_subjects:  activeSubjects,
        session_hours:    completedSessions.length,  // sprint 3 - note: this is session count until duration field is populated
        my_tutors:        myTutors.length,
        today_sessions:   todaySessions.length
      },
      todaySessions,
      myTutors,  // sprint 3 - now includes tutor_name and rating
      progress  // sprint 3 - now includes progress_percentage
    });
  } catch (err) {
    console.error('studentDashboard error', err && err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.tutorDashboard = async (req, res) => {
  console.log('dashboard.controller.tutorDashboard entered, req.user=', req.user);
  const userId = req.user && req.user.user_id;
  if (!userId) return res.status(401).json({ message: 'No authenticated user' });
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { full_name: true }
    });

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

    res.json({
      user,
      stats: {
        active_students:     myStudents.length,
        sessions_this_month: sessionsThisMonth,
        rating:              tutorProfile?.rating ?? 0
      },
      todaySessions,  // sprint 3 - now includes student_name
      myStudents,  // sprint 3 - now includes student_name, student_class, session_count
      practiceTests,
      slots,
      tuitionBoard
    });
  } catch (err) {
    console.error('tutorDashboard error', err && err.stack);
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

    res.json({
      stats: { total_students, verified_tutors, open_complaints, pending_verifications },
      verificationQueue  // sprint 3 - now includes enriched tutor profile data
    });
  } catch (err) {
    console.error('adminDashboard error', err && err.stack);
    res.status(500).json({ error: err.message });
  }
};

// sprint 3 - NEW: Verify tutor endpoint for admin approval
exports.verifyTutor = async (req, res) => {
  console.log('dashboard.controller.verifyTutor entered, req.user=', req.user, 'params=', req.params);
  try {
    const { user_id } = req.params;
    
    // Update user is_verified status
    const updatedUser = await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: { is_verified: true }
    });

    // Update tutor profile interview status
    await prisma.tutorProfile.update({
      where: { user_id: parseInt(user_id) },
      data: { interview_status: 'passed' }
    });

    res.json({ 
      message: 'Tutor verified successfully', 
      user_id: updatedUser.user_id,
      is_verified: updatedUser.is_verified
    });
  } catch (err) {
    console.error('verifyTutor error', err && err.stack);
    res.status(500).json({ error: err.message });
  }
};

// sprint 3 - NEW: Reject tutor endpoint for admin rejection
exports.rejectTutor = async (req, res) => {
  console.log('dashboard.controller.rejectTutor entered, req.user=', req.user, 'params=', req.params);
  try {
    const { user_id } = req.params;
    const { reason } = req.body;

    // Update tutor profile interview status to failed
    await prisma.tutorProfile.update({
      where: { user_id: parseInt(user_id) },
      data: { interview_status: 'failed' }
    });

    res.json({ 
      message: 'Tutor rejected', 
      user_id: parseInt(user_id),
      reason: reason || 'Not specified'
    });
  } catch (err) {
    console.error('rejectTutor error', err && err.stack);
    res.status(500).json({ error: err.message });
  }
};