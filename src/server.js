import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as sapper from '@sapper/server';

dotenv.config();

const { PORT, NODE_ENV, MONGO_URI } = process.env;
const dev = NODE_ENV === 'development';

const app = express();

app
  .use(express.json())
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  );

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (dbError) => {
    if (dbError) {
      throw dbError;
    }
    app.listen(PORT, (error) => {
      if (error) console.log('error', error);
    });
  }
);
