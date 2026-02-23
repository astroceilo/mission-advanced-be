import sequelize from "./config/database.js";
import Course from "./models/courseModels.js";
import User from "./models/userModels.js";
import { seedCourses } from "./seeders/courseSeeder.js";
import { seedUsers } from "./seeders/userSeeder.js";

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const isFresh = process.argv.includes("--fresh");

    if (isFresh) {
      console.log("Fresh mode ON 🔥");

      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

      await Course.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });

      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      console.log("Tables truncated");
    }

    await seedUsers(15);
    await seedCourses(20);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeeder();
