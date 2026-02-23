import { courseFactory } from "../factories/courseFactory.js";
import User from "../models/userModels.js";
import Course from "../models/courseModels.js";
import { faker } from "@faker-js/faker";

export const seedCourses = async (total = 20) => {
  const instructors = await User.findAll({
    where: { role: "instructor" },
  });

  if (!instructors.length) {
    throw new Error("No instructors found. Seed users first.");
  }

  const courses = [];

  for (let i = 0; i < total; i++) {
    const randomInstructor = faker.helpers.arrayElement(instructors);

    courses.push(
      courseFactory({
        instructor_id: randomInstructor.id,
      }),
    );
  }

  await Course.bulkCreate(courses);

  console.log(`${total} courses seeded successfully 🚀`);
};
