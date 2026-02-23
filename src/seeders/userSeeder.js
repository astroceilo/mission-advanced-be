import bcrypt from "bcrypt";
import User from "../models/userModels.js";
import { userFactory } from "../factories/userFactory.js";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [];

  // Admin
  users.push(
    userFactory({
      full_name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    }),
  );
  console.log("Admin seeded");

  // Instructors
  for (let i = 0; i < 15; i++) {
    users.push(
      userFactory({
        password: hashedPassword,
        role: "instructor",
        status: "active",
      })
    );
  }
  console.log("Instructors seeded");

  // Students
  for (let i = 0; i < 10; i++) {
    users.push(
      userFactory({
        password: hashedPassword,
        role: "student",
        status: "active",
      })
    );
  }
  console.log("Students seeded");

  await User.bulkCreate(users, { ignoreDuplicates: true });
  console.log("Admin, Instructors, and Students seeded successfully 🚀");
};
