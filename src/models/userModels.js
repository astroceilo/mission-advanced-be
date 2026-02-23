import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  email_verification_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "instructor", "admin"),
    defaultValue: "student",
  },
  status: {
    type: DataTypes.ENUM("active", "suspend"),
    defaultValue: "active",
  },
}, {
  tableName: "users",
  underscored: true,
  timestamps: true,
});

export default User;