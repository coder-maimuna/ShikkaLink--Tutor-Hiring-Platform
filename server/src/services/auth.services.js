//student registration
const user = await prisma.user.create(...)

//tutor registration
const tutor = await prisma.tutorProfile.create(...)

//login - find user by email
const user = await prisma.user.findFirst(...)
