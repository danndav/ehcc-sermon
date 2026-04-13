import { Callback, Context, Handler } from 'aws-lambda';
import { config } from 'dotenv';

import { bootstrap } from './nest';

let server: Handler;

config();


export const handler = async (event: unknown, context: Context, callback: Callback): Promise<unknown> => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
