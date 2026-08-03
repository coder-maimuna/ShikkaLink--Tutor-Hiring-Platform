const prisma = require('../config/prisma');

/**
 * Get tutor profile details by tutor ID
 * Public endpoint for viewing tutor profiles
 */
exports.getTutorProfile = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutor_id);

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: 'Tutor ID is required'
      });
    }

    // Base user record — only verified tutors should be viewable
    const user = await prisma.user.findUnique({
      where: { user_id: tutorId },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        address: true,
        role: true,
        is_verified: true,
      },
    });

    if (!user || user.role !== 'tutor' || !user.is_verified) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // tutorProfile is keyed by user_id
    const profile = await prisma.tutorProfile.findUnique({
      where: { user_id: tutorId },
    });

    // tutorPreference is keyed by tutor_id (unique)
    const preference = await prisma.tutorPreference.findUnique({
      where: { tutor_id: tutorId },
    });

    const experiences = await prisma.tutorExperience.findMany({
      where: { tutor_id: tutorId },
      orderBy: { created_at: 'desc' },
    });

    // tutor_id is NOT unique on TutorEducation, so findFirst (not findUnique)
    const education = await prisma.tutorEducation.findFirst({
      where: { tutor_id: tutorId },
    });

    const tutorData = {
      tutor_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      address: user.address,
      rating: profile?.rating ? Number(profile.rating) : 0,
      experience: profile?.teaching_experience || 'Not specified',
      subjects: preference?.subjects || 'Not specified',
      class_range: preference?.class_range || 'Not specified',
      tuition_type: preference?.tuition_type || 'Not specified',
      salary_min: preference?.salary_range_min || 0,
      salary_max: preference?.salary_range_max || 0,
      curriculum: preference?.preferred_curriculum || 'Not specified',
      education: education || null,
      experiences: experiences.map(exp => ({
        institution: exp.institution || 'Institution not specified',
        subjects: exp.subjects || 'Various subjects',
        duration: exp.duration || 'Duration not specified',
      })),
    };

    res.json(tutorData);

  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutor profile',
      error: error.message,
    });
  }
};