const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerStudent = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password_hash: hashedPassword,
      address: data.address,
      role: "student"
    }
  });

  await prisma.studentProfile.create({
    data: {
      user_id: user.user_id,
      student_class: data.student_class,
      tutor_preference: data.tutor_preference
    }
  });

  return user;
};



const registerTutor = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password_hash: hashedPassword,
      address: data.address,
      role: "tutor"
    }
  });

  await prisma.tutorProfile.create({
    data: {
      user_id: user.user_id,
      teaching_experience: data.teaching_experience,
      student_preference: data.student_preference
    }
  });

  return user;
};



const login = async (data) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    },
    token
  };
};


module.exports = {
  registerStudent,
  registerTutor,
  login
};