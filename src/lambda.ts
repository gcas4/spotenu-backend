import app from './index';
import serverless from 'serverless-http';
import 'mysql';

export const handler = serverless(app);