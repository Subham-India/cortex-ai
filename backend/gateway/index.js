import express from 'express';
import dotenv from 'dotenv';
import proxy from "express-http-proxy";

dotenv.config();    
const app = express();



const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/auth', proxy(process.env.AUTH_SERVICE_URL));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});