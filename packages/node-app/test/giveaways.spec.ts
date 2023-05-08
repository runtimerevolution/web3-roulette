import request from 'supertest';
import { app } from '../src/main';
import { Giveaway } from '../src/models';

describe('GET /', () => {
  it('should return a message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello API' });
  });
});

describe('GET /giveaways', () => {
  it('should return an empty array if no giveaways exist', async () => {
    const response = await request(app).get('/giveaways');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return a list of giveaways if they exist', async () => {
    const giveaways = [
      new Giveaway({
        title: 'Giveaway 1',
        description: 'Description for giveaway 1',
        startTime: new Date(),
        endTime: new Date(),
        numberOfWinners: 1
      }),
      new Giveaway({
        title: 'Giveaway 2',
        description: 'Description for giveaway 2',
        startTime: new Date(),
        endTime: new Date(),
        numberOfWinners: 1
      }),
    ];
    await Promise.all(giveaways.map((giveaway) => giveaway.save()));

    const response = await request(app).get('/giveaways');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Giveaway 1' }),
        expect.objectContaining({ title: 'Giveaway 2' }),
      ]),
    );
  });
});

describe('GET /giveaways/:id', () => {
  it('should return 404 not found when the id does not exist', async () => {
    const response = await request(app).get('/giveaways/invalid-id');
    
    console.log(response)
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Giveaway with ID invalid-id not found');
  });


  it('should return a giveaway if it exists', async () => {
    const giveaway = new Giveaway({
      title: 'Giveaway',
      description: 'Description for giveaway',
      startTime: new Date(),
      endTime: new Date(),
      numberOfWinners: 1
    });
    await giveaway.save();

    const response = await request(app).get(`/giveaways/${giveaway._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Giveaway');
    expect(response.body.description).toBe('Description for giveaway');
    expect(new Date(response.body.startTime)).toEqual(giveaway.startTime);
    expect(new Date(response.body.endTime)).toEqual(giveaway.endTime);
    expect(response.body.numberOfWinners).toEqual(1);
  });
});
