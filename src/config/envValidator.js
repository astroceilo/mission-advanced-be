const requiredEnv = [
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_NAME",
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS"
];

export const validateEnv = () => {
  // Check if all required environment variables are set
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is required`);
    }
  });

  const numericEnv = ["PORT", "DB_PORT", "SMTP_PORT"];

  // Check if DB_PORT is a number
  numericEnv.forEach((key) => {
    if (isNaN(Number(process.env[key]))) {
      throw new Error(`${key} must be a number`);
    }
  });
};
