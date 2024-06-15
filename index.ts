import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';

admin.initializeApp({
  credential: admin.credential.cert(functions.config().todo_firebase_config),
  databaseURL: 'https://YOUR-PROJECT-default-rtdb.firebaseio.com',
});

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
};
export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
