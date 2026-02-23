import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Course = sequelize.define(
  "Course",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
    },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
    total_modules: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating_avg: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    duration_total_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
    instructor_id: DataTypes.BIGINT,
  },
  {
    tableName: "courses",
    underscored: true,
  }
);

export default Course;