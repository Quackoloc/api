import { User } from '../../../user/domain/entities/user.entity';
import { ColocationRepository } from './colocation.repository';
import { ColocationNotFoundException } from '../../domain/colocation.exceptions';
import * as dotenv from 'dotenv';
import {
  clearTables,
  getColocationRepository,
  initializeTestDataSource,
} from '../../../../common/test-utils';
import { DataSource } from 'typeorm';

dotenv.config();

describe('ColocationRepository Integration with PostgreSQL', () => {
  let repository: ColocationRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    repository = getColocationRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearTables(dataSource);
  });

  it('getById should return colocation if exists', async () => {
    const colocation = repository.create({
      title: 'Test',
      backgroundImage: '',
      address: '',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
    });
    await repository.save(colocation);

    const found = await repository.getById(colocation.id);
    expect(found.id).toBe(colocation.id);
    expect(found.title).toBe('Test');
  });

  it('getById should throw if colocation does not exist', async () => {
    await expect(repository.getById(999)).rejects.toThrow(ColocationNotFoundException);
  });

  it('isColocationMember should return true if user is member', async () => {
    const userRepo = dataSource.getRepository(User);
    const user = userRepo.create({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@test.com',
      password: 'hashed_password',
      avatar: 'https://example.com/avatar.png', // champ obligatoire rempli
    });
    await userRepo.save(user);

    const colocation = repository.create({
      title: 'Test',
      backgroundImage: '',
      address: '',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
      members: [user],
    });
    await repository.save(colocation);

    const result = await repository.isColocationMember(user.id, colocation.id);
    expect(result).toBe(true);
  });

  it('isColocationMember should return false if user is not member', async () => {
    const colocation = repository.create({
      title: 'Test',
      backgroundImage: '',
      address: '',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
      members: [],
    });
    await repository.save(colocation);

    const result = await repository.isColocationMember(1, colocation.id);
    expect(result).toBe(false);
  });
});
