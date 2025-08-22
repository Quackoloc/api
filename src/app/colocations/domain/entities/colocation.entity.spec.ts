import { Colocation } from './colocation.entity';

describe('Colocation entity', () => {
  let colocation: Colocation;

  beforeEach(() => {
    colocation = new Colocation();
    colocation.tasksRotationFrequency = 7;
  });

  it('should set nextRotationDate correctly before insert', () => {
    const fixedDate = new Date('2034-06-08T10:00:00Z');

    colocation.setNextRotationDate(fixedDate);

    const expectedDate = new Date(Date.UTC(2034, 5, 8)); // Juin = 5
    expectedDate.setUTCDate(expectedDate.getUTCDate() + colocation.tasksRotationFrequency);
    expectedDate.setUTCHours(16, 0, 0, 0);

    expect(colocation.nextRotationDate).toEqual(expectedDate);
  });

  it('should not fail if tasksRotationFrequency is null', () => {
    colocation.tasksRotationFrequency = null;

    expect(() => colocation.setNextRotationDate()).not.toThrow();
    expect(colocation.nextRotationDate).toBeUndefined();
  });

  it('should set nextRotationDate to 16:00 UTC', () => {
    const fixedTime = new Date('2024-08-22T10:00:00Z').getTime();
    jest.spyOn(global.Date, 'now').mockReturnValue(fixedTime);

    colocation.setNextRotationDate();

    const hours = colocation.nextRotationDate.getUTCHours();
    const minutes = colocation.nextRotationDate.getUTCMinutes();

    expect(hours).toBe(16);
    expect(minutes).toBe(0);

    jest.restoreAllMocks();
  });
});
