const requiredEnv = [
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_NAME'
];

export const validateEnv = () => {
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is required`);
    }
  });
};
