// import connection from './database/connection.js';

// const testConnection = async () => {
//   try {
//     const [rows] = await connection.query('SELECT 1 + 1 AS result');
//     console.log('✅ Database Connected!');
//     console.log('Test Query Result:', rows);
//     console.log(process.env.DB_NAME);
//   } catch (error) {
//     console.error('❌ Database Connection Failed');
//     console.error("Error Message:", error.message);
//     console.error("Error Code:", error.code);
//   }
// };

// testConnection();

import express from 'express';
import usersRoutes from './routes/users.routes.js';

const app = express();

app.use(express.json());

app.use('/users', usersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

app.get('/', (req, res) => {
  res.send('API Running 🚀');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});