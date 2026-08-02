const prisma = require('../config/prisma');

exports.searchTutors = async (req, res) => {
  try {
    const {
      subject,
      min_salary,
      max_salary,
      class_range,
      sort_by,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const preferenceFilter = {};
    if (subject) {
      preferenceFilter.subjects = { contains: subject };
    }
    if (class_range) {
      preferenceFilter.class_range = { contains: class_range };
    }
    if (min_salary) {
      preferenceFilter.salary_range_min = { gte: parseInt(min_salary, 10) };
    }
    if (max_salary) {
      preferenceFilter.salary_range_max = { lte: parseInt(max_salary, 10) };
    }

    const tutors = await prisma.user.findMany({
      where: {
        role: 'tutor',
        is_verified: true,
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        address: true,
      },
      skip,
      take: parsedLimit,
      orderBy: { created_at: 'desc' },
    });

    const tutorIds = tutors.map((t) => t.user_id);

    const profileMap = new Map(
      (await prisma.tutorProfile.findMany({
        where: { user_id: { in: tutorIds } },
      })).map((profile) => [profile.user_id, profile]),
    );

    const preferences = await prisma.tutorPreference.findMany({
      where: {
        tutor_id: { in: tutorIds },
        ...preferenceFilter,
      },
    });

    const experiences = await prisma.tutorExperience.findMany({
      where: { tutor_id: { in: tutorIds } },
    });

    let results = tutors.map((tutor) => {
      const profile = profileMap.get(tutor.user_id);
      const pref = preferences.find((p) => p.tutor_id === tutor.user_id);
      const exp = experiences.filter((e) => e.tutor_id === tutor.user_id);

      return {
        tutor_id: tutor.user_id,
        full_name: tutor.full_name,
        email: tutor.email,
        address: tutor.address,
        rating: profile?.rating ? Number(profile.rating) : 0,
        experience: profile?.teaching_experience,
        subjects: pref?.subjects || '',
        class_range: pref?.class_range || '',
        tuition_type: pref?.tuition_type || '',
        salary_min: pref?.salary_range_min || 0,
        salary_max: pref?.salary_range_max || 0,
        curriculum: pref?.preferred_curriculum || '',
        experiences: exp,
      };
    });

    if (subject || class_range) {
      results = results.filter((t) => {
        const matchSubject = subject
          ? (t.subjects || '').toLowerCase().includes(subject.toLowerCase())
          : true;
        const matchClass = class_range
          ? (t.class_range || '').toLowerCase().includes(class_range.toLowerCase())
          : true;
        return matchSubject && matchClass;
      });
    }

    if (sort_by === 'rating') {
      results.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sort_by === 'salary_low') {
      results.sort((a, b) => Number(a.salary_min) - Number(b.salary_min));
    } else if (sort_by === 'salary_high') {
      results.sort((a, b) => Number(b.salary_max) - Number(a.salary_max));
    }

    const total = results.length;

    res.json({
      success: true,
      total,
      page: parsedPage,
      limit: parsedLimit,
      tutors: results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTutorDetails = async (req, res) => {
  try {
    const tutorId = parseInt(req.params.tutor_id, 10);

    const tutor = await prisma.user.findUnique({
      where: { user_id: tutorId },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        address: true,
      },
    });

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const profile = await prisma.tutorProfile.findUnique({
      where: { user_id: tutorId },
    });

    const preference = await prisma.tutorPreference.findUnique({
      where: { tutor_id: tutorId },
    });

    const experiences = await prisma.tutorExperience.findMany({
      where: { tutor_id: tutorId },
    });

    const education = await prisma.tutorEducation.findFirst({
      where: { tutor_id: tutorId },
    });

    res.json({
      success: true,
      tutor: {
        ...tutor,
        rating: profile?.rating ? Number(profile.rating) : 0,
        experience: profile?.teaching_experience,
        preference,
        experiences,
        education,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
