import { Giveaway } from "../models/giveaway.model";

describe('Giveaway model', () => {
  it('should be invalid if title is empty', () => {
    const giveaway = new Giveaway();
    const error = giveaway.validateSync()
    expect(error.errors.title).toBeDefined();
  });

  it('should be invalid if description is empty', () => {
    const giveaway = new Giveaway();
    const error = giveaway.validateSync()
    expect(error.errors.description).toBeDefined()
  });

  it('should be invalid if startTime is empty', () => {
    const giveaway = new Giveaway();
    const error = giveaway.validateSync()
    expect(error.errors.startTime).toBeDefined()
  });

  it('should be invalid if endTime is empty', () => {
    const giveaway = new Giveaway();
    const error = giveaway.validateSync()
    expect(error.errors.endTime).toBeDefined()
  });

  it('should be invalid if start time is in the past', async () => {
    const giveaway = new Giveaway({
      title: 'Test Giveaway',
      description: 'This is a test giveaway',
      startTime: new Date('2022-01-01'),
      endTime: Date.now() + 60,
    });

    const error = giveaway.validateSync()
    expect(error.errors.startTime).toBeDefined()
  });

  it('should be invalid if startTime is greater than or equal to endTime', () => {
    const giveaway = new Giveaway({
      title: 'Test giveaway',
      description: 'This is a test giveaway',
      startTime: new Date(2023, 6, 1),
      endTime: new Date(2023, 5, 30),
      numberOfWinners: 1
    });

    const error = giveaway.validateSync()
    expect(error.errors.startTime).toBeDefined()
  });

  it('should be invalid if numberOfWinners is less than or equal to 0', () => {
    const giveaway = new Giveaway({
      title: 'Test giveaway',
      description: 'This is a test giveaway',
      startTime: new Date(2023, 5, 30),
      endTime: new Date(2023, 6, 1),
      numberOfWinners: 0
    });

    const error = giveaway.validateSync()
    expect(error.errors.numberOfWinners).toBeDefined()
  });

  it('should be valid if all required fields are present and startTime is less than endTime and numberOfWinners is greater than 0', () => {
    const giveaway = new Giveaway({
      title: 'Test giveaway',
      description: 'This is a test giveaway',
      startTime: new Date(2023, 5, 30),
      endTime: new Date(2023, 6, 1),
      numberOfWinners: 1
    });

    const error = giveaway.validateSync()
    expect(error).toBeUndefined();
  });
});
