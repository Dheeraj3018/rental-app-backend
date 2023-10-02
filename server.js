import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cors from 'cors';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.get('/', (req, res) => {
  res.send(
    "<h1>welcome to rental portal </h1>"
  );
})


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});