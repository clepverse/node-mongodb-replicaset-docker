const express = require('express');
const mongoose = require('mongoose');

const Activity = require('./models/Activity');

const app = express();
const mongoURL = 'mongodb://127.0.0.1:27017/transactions';

const options = {
  readPreference: 'secondary',
};

mongoose
  .connect(mongoURL)
  .then(() => console.log('[OK]: MongoDB CONNECTED'))
  .catch((err) => console.error({ err }));

app.use(express.json());

app.get('/activities', async (req, res) => {
  const activities = await Activity.find();

  return res.status(200).json({
    message: 'ok',
    activities: activities,
  });
});

app.post('/activities', async (req, res) => {
  const { activities } = req.body;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    for (let activity of activities) {
      const newActivity = new Activity(activity);

      // await newActivity.save();

      await newActivity.save({ session });
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: 'ok',
    });
  } catch (error) {
    console.error({ error });

    await session.abortTransaction();

    return res.status(400).json({
      message: 'error',
      error,
    });
  } finally {
    session.endSession();
  }
});

mongoose.connection.on('connected', () => {
  const port = 3000;

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
