const prisma = require('../config/prisma');

exports.adminDashboard = async (req, res) => {
  try {
    const total_students = await prisma.user.count({
      where: { role: 'student' }
    });
    const total_tutors = await prisma.user.count({
      where: { role: 'tutor' }
    });
    const verified_tutors = await prisma.user.count({
      where: { role: 'tutor', is_verified: true }
    });
    const pending_tutors = await prisma.user.count({
      where: { role: 'tutor', is_verified: false }
    });
    const open_complaints = await prisma.complaint.count({
      where: { status: 'open' }
    });
    const total_sessions = await prisma.session.count();

    res.json({
      stats: {
        total_students,
        total_tutors,
        verified_tutors,
        pending_tutors,
        open_complaints,
        total_sessions
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await prisma.user.findMany({
      where: { role: 'tutor' },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        address: true,
        is_verified: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    const tutorIds = tutors.map(t => t.user_id);
    const profiles = await prisma.tutorProfile.findMany({
      where: { user_id: { in: tutorIds } },
      select: {
        user_id: true,
        rating: true,
        teaching_experience: true
      }
    });

    const result = tutors.map(tutor => ({
      ...tutor,
      rating: profiles.find(
        p => p.user_id === tutor.user_id
      )?.rating || 0,
      teaching_experience: profiles.find(
        p => p.user_id === tutor.user_id
      )?.teaching_experience || ''
    }));

    res.json({ success: true, tutors: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'student' },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        address: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    const studentIds = students.map(s => s.user_id);
    const profiles = await prisma.studentProfile.findMany({
      where: { user_id: { in: studentIds } },
      select: {
        user_id: true,
        student_class: true,
        tutor_preference: true
      }
    });

    const result = students.map(student => ({
      ...student,
      student_class: profiles.find(
        p => p.user_id === student.user_id
      )?.student_class || '',
      tutor_preference: profiles.find(
        p => p.user_id === student.user_id
      )?.tutor_preference || ''
    }));

    res.json({ success: true, students: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingTutors = async (req, res) => {
  try {
    const pendingTutors = await prisma.user.findMany({
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
        address: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    const tutorIds = pendingTutors.map(t => t.user_id);

    const profiles = await prisma.tutorProfile.findMany({
      where: { user_id: { in: tutorIds } },
      select: {
        user_id: true,
        teaching_experience: true,
        student_preference: true,
        rating: true
      }
    });

    const documents = await prisma.tutorDocument.findMany({
      where: { tutor_id: { in: tutorIds } }
    });

    const education = await prisma.tutorEducation.findMany({
      where: { tutor_id: { in: tutorIds } }
    });

    const preferences = await prisma.tutorPreference.findMany({
      where: { tutor_id: { in: tutorIds } }
    });

    const result = pendingTutors.map(tutor => ({
      ...tutor,
      teaching_experience: profiles.find(
        p => p.user_id === tutor.user_id
      )?.teaching_experience || '',
      documents: documents.filter(
        d => d.tutor_id === tutor.user_id
      ),
      education: education.find(
        e => e.tutor_id === tutor.user_id
      ) || null,
      preference: preferences.find(
        p => p.tutor_id === tutor.user_id
      ) || null
    }));

    res.json({ success: true, pending_tutors: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyTutor = async (req, res) => {
  try {
    const tutorId = parseInt(req.params.tutor_id);
    await prisma.user.update({
      where: { user_id: tutorId },
      data: { is_verified: true }
    });
    res.json({ success: true, message: 'Tutor verified!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectTutor = async (req, res) => {
  try {
    const tutorId = parseInt(req.params.tutor_id);
    await prisma.user.update({
      where: { user_id: tutorId },
      data: { is_active: false }
    });
    res.json({ success: true, message: 'Tutor rejected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        is_verified: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    await prisma.user.update({
      where: { user_id: userId },
      data: { is_active: false }
    });
    res.json({ success: true, message: 'User suspended' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    await prisma.user.update({
      where: { user_id: userId },
      data: { is_active: true }
    });
    res.json({ success: true, message: 'User activated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }


};

exports.getTutorFullProfile = async (req, res) => {
  try {
    const tutorId = parseInt(req.params.tutor_id);
    const tutor = await prisma.user.findUnique({
      where: { user_id: tutorId },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        address: true,
        is_verified: true,
        is_active: true,
        created_at: true
      }
    });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    const documents = await prisma.tutorDocument.findMany({
      where: { tutor_id: tutorId }
    });
    const education = await prisma.tutorEducation.findFirst({
      where: { tutor_id: tutorId }
    });
    const preference = await prisma.tutorPreference.findUnique({
      where: { tutor_id: tutorId }
    });
    res.json({ 
      success: true, 
      tutor: { ...tutor, documents, education, preference }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};