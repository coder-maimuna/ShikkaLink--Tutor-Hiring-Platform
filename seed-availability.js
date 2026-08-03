const prisma = require('./server/src/config/prisma');

async function seedAvailabilitySlots() {
  try {
    const tutorId = 2; // Tahasina Tasnim Afra

    // Define test availability slots for the tutor
    const slots = [
      {
        tutor_id: tutorId,
        day_of_week: 'Monday',
        time_slot: '09:00 - 10:00',
        subject: 'Mathematics'
      },
      {
        tutor_id: tutorId,
        day_of_week: 'Monday',
        time_slot: '10:00 - 11:00',
        subject: 'Mathematics'
      },
      {
        tutor_id: tutorId,
        day_of_week: 'Wednesday',
        time_slot: '14:00 - 15:00',
        subject: 'Physics'
      },
      {
        tutor_id: tutorId,
        day_of_week: 'Wednesday',
        time_slot: '15:00 - 16:00',
        subject: 'Chemistry'
      },
      {
        tutor_id: tutorId,
        day_of_week: 'Friday',
        time_slot: '16:00 - 17:00',
        subject: 'Mathematics'
      }
    ];

    console.log('Seeding availability slots...');
    console.log('=============================');

    // Clear existing slots for this tutor
    await prisma.availabilitySlot.deleteMany({
      where: { tutor_id: tutorId }
    });

    // Create new slots
    for (const slot of slots) {
      await prisma.availabilitySlot.create({
        data: slot
      });
      console.log(`  ✓ Added: ${slot.day_of_week} - ${slot.time_slot} (${slot.subject})`);
    }

    console.log('\n✓ Successfully seeded 5 availability slots for Tutor ID:', tutorId);

    // Verify
    const createdSlots = await prisma.availabilitySlot.findMany({
      where: { tutor_id: tutorId },
      orderBy: { day_of_week: 'asc', time_slot: 'asc' }
    });

    console.log('\nVerifying slots:');
    createdSlots.forEach(slot => {
      console.log(`  ${slot.day_of_week} - ${slot.time_slot} (${slot.subject})`);
    });

  } catch (error) {
    console.error('Error seeding slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAvailabilitySlots();
