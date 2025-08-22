import { UserTaskPreferenceRepository } from './user-task-preference.repository';
import { UserTaskPreference } from '../../domain/entities/user-task-preference.entity';
import {
  getUserTaskPreferenceRepository,
  initializeTestDataSource,
} from '../../../../common/test-utils';
import { DataSource } from 'typeorm';

describe('UserTaskPreferenceRepository', () => {
  let repository: UserTaskPreferenceRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    repository = getUserTaskPreferenceRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getOneById', () => {
    it('should return the user task preference if it exists', async () => {
      const mockPreference = { id: 1, someField: 'value' } as unknown as UserTaskPreference;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPreference);

      const result = await repository.getOneById(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: undefined,
      });
      expect(result).toEqual(mockPreference);
    });

    it('should return the user task preference with relations if options are provided', async () => {
      const mockPreference = { id: 2, someField: 'another' } as unknown as UserTaskPreference;
      const relations = { user: true };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPreference);

      const result = await repository.getOneById(2, relations);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations,
      });
      expect(result).toEqual(mockPreference);
    });
  });
});
