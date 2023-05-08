import mongoose from 'mongoose';
import { app } from './app'

const host = process.env.SERVER_HOST;
const port = Number(process.env.SERVER_PORT);

/* Connecting to the database and then starting the server. */
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() =>
    app.listen(port, host,
      () => console.log(`[ ready ] http://${host}:${port}`)))
  .catch((error) => console.log(error))
