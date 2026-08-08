import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();
const app = express();



const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello from API gateway!');
});
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/auth${req.url}`,
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});