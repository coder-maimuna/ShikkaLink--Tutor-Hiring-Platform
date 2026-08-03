const prisma = require('./server/src/config/prisma');

async function checkTutors() {
  try {
    const tutors = await prisma.user.findMany({
      where: { role: 'tutor' },
      select: { user_id: true, full_name: true, email: true },
      take: 5
    });

    console.log('Available Tutors:');
    console.log('=================');
    tutors.forEach(tutor => {
      console.log(`  ID: ${tutor.user_id}, Name: ${tutor.full_name}, Email: ${tutor.email}`);
    });

    // Check for sessions
    const sessions = await prisma.session.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    });

    console.log('\nRecent Sessions:');
    console.log('================');
    if (sessions.length === 0) {
      console.log('  No sessions found in database');
    } else {
      sessions.forEach(session => {
        console.log(`  Session ID: ${session.session_id}, Tutor ID: ${session.tutor_id}, Student ID: ${session.student_id}, Subject: ${session.subject}, Status: ${session.status}`);
      });
    }

    // Check for availability slots
    const slots = await prisma.availabilitySlot.findMany({
      take: 5
    });

    console.log('\nAvailability Slots:');
    console.log('===================');
    if (slots.length === 0) {
      console.log('  No availability slots found');
    } else {
      slots.forEach(slot => {
        console.log(`  Slot ID: ${slot.slot_id}, Tutor ID: ${slot.tutor_id}, Day: ${slot.day_of_week}, Time: ${slot.time_slot}, Subject: ${slot.subject}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTutors();
