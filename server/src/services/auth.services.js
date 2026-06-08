//student registration
const user = await prisma.user.create(
    {
        data: {
    full_name: full_name,
    email: email,
    phone: phone,
    password_hash: hashedPassword,
    address: address,
    role: "student"
}
}
);
//student profile
const student = await prisma.studentProfile.create({
    data: {
    user_id: user.user_id,
    student_class: student_class,
    tutor_preference: tutor_preference
}
});

//tutor registration
const tutor = await prisma.tutorProfile.create({
    data: {
    user_id: user.user_id,
    teaching_experience: teaching_experience,
    student_preference: student_preference
}
});

//login - find user by email
const user = await prisma.user.findFirst({
where: {
    email: email
}
});

//password verification
if (!user) {
    throw new Error("User not found");
}

const isMatch = await bcrypt.compare(
    password,
    user.password_hash
);

if (!isMatch) {
    throw new Error("Invalid credentials");
}

//token generation using JWT
generateToken()