import { Agenda } from '@hokify/agenda';

import { Giveaway } from '../models/giveaway.model';
import { handleGenerateWinners } from './model.utils';

export const agenda = new Agenda({
  db: {
    address: process.env.DATABASE_URI,
    collection: 'giveawayJobs',
  },
  maxConcurrency: 20,
});

agenda
  .on('ready', () => console.log('Agenda started!'))
  .on('error', () => console.log('Agenda connection error!'));

agenda.define('generateGiveawayWinners', async (job) => {
  const giveaway = await Giveaway.findById(job.attrs.data._id);
  try {
    if (!giveaway) return console.log('Giveaway not found.');
  
    if (giveaway.winners.length > 0)
      return console.log('Giveaway already has winners');
  
    await handleGenerateWinners(giveaway);
  } catch (error) {
    console.log(`Error while scheduling winner generation for giveaway '${giveaway.title}'`, error);
  }
});
export const scheduleWinnerGeneration = async (data) => {
  await agenda.start();
  await agenda.schedule(data.endTime, 'generateGiveawayWinners', data);
};
