const prisma = require('./server/src/config/prisma');

async function checkSlots() {
  try {
    const slots = await prisma.availabilitySlot.findMany();

    console.log('Current Availability Slots:');
    console.log('===========================');
    if (slots.length === 0) {
      console.log('  No slots found - this is why the API fails');
      console.log('  You need to add availability slots for tutors in the database');
    } else {
      slots.forEach(slot => {
        console.log(`  Slot ID: ${slot.slot_id}, Tutor ID: ${slot.tutor_id}`);
        console.log(`    Day: ${slot.day_of_week}, Time: ${slot.time_slot}, Subject: ${slot.subject}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSlots();
