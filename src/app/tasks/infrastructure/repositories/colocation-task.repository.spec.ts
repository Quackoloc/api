import { Colocation } from '../../../colocations/domain/entities/colocation.entity';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ColocationTaskRepository } from './colocation-task.repository';
import * as dotenv from 'dotenv';
import { User } from '../../../user/domain/entities/user.entity';
import {
  clearTables,
  getColocationTaskRepository,
  initializeTestDataSource,
} from '../../../../common/test-utils';
import { DataSource } from 'typeorm';

dotenv.config();

describe('ColocationTaskRepository Integration with PostgreSQL', () => {
  let repository: ColocationTaskRepository;
  let dataSource: DataSource;
  let colocation: Colocation;
  let user: User;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    repository = getColocationTaskRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearTables(dataSource);

    colocation = dataSource.getRepository(Colocation).create({
      title: 'Test Coloc',
      backgroundImage: '',
      address: '123 Rue Test',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
    });
    await dataSource.getRepository(Colocation).save(colocation);

    user = dataSource.getRepository(User).create({
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice@test.com',
      password: 'hashed_password',
      avatar: 'https://example.com/avatar.png',
    });
    await dataSource.getRepository(User).save(user);
  });

  it('findByColocationId should return tasks of a given colocation', async () => {
    const task1 = repository.create({
      title: 'Dishwashing',
      description: 'Wash the dishes',
      colocation,
      assignedTo: user,
    });

    const task2 = repository.create({
      title: 'Vacuum',
      description: 'Vacuum the living room',
      colocation,
      assignedTo: user,
    });

    await repository.save([task1, task2]);

    const results = await repository.findByColocationId(colocation.id);
    expect(results).toHaveLength(2);
    expect(results.map((t) => t.title)).toContain('Dishwashing');
    expect(results.map((t) => t.title)).toContain('Vacuum');
  });

  it('getOneById should return task if exists', async () => {
    const task = repository.create({
      title: 'Garbage',
      description: 'Take out the trash',
      colocation,
      assignedTo: user,
    });
    await repository.save(task);

    const found = await repository.getOneById(task.id);
    expect(found.id).toBe(task.id);
    expect(found.title).toBe('Garbage');
  });

  it('findById should return task if exists', async () => {
    const task = repository.create({
      title: 'Laundry',
      description: 'Do the laundry',
      colocation,
      assignedTo: user,
    });
    await repository.save(task);

    const found = await repository.findById(task.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('Laundry');
  });

  it('findById should return null if task does not exist', async () => {
    const found = await repository.findById(999);
    expect(found).toBeNull();
  });

  it('deleteOneById should soft delete a task', async () => {
    const task = repository.create({
      title: 'Cooking',
      description: 'Cook dinner',
      colocation,
      assignedTo: user,
    });
    await repository.save(task);

    await repository.deleteOneById(task.id);

    const found = await repository.findById(task.id);
    expect(found).toBeNull();

    const raw = await dataSource
      .getRepository(ColocationTask)
      .createQueryBuilder('task')
      .withDeleted()
      .where('task.id = :id', { id: task.id })
      .getOne();

    expect(raw).not.toBeNull();
  });
});
