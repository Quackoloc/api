import { InvitationCodeRepository } from './invitation-code.repository';
import { InvitationCodeNotFoundException } from '../../domain/colocation.exceptions';
import * as dotenv from 'dotenv';
import { Colocation } from '../../domain/entities/colocation.entity';
import {
  clearTables,
  getInvitationCodeRepository,
  initializeTestDataSource,
} from '../../../../common/test-utils';
import { DataSource } from 'typeorm';

dotenv.config();

describe('InvitationCodeRepository Integration with PostgreSQL', () => {
  let repository: InvitationCodeRepository;
  let ds: DataSource;

  beforeAll(async () => {
    ds = await initializeTestDataSource();
    repository = getInvitationCodeRepository(ds);
  });

  afterAll(async () => {
    await ds.destroy();
  });

  beforeEach(async () => {
    await clearTables(ds); // ✅ cleaner reset
  });

  it('findOneByCode should return the invitation code if exists', async () => {
    const colocationRepo = ds.getRepository(Colocation);
    const coloc = colocationRepo.create({
      title: 'Test Coloc',
      backgroundImage: '',
      address: '',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
    });
    await colocationRepo.save(coloc);

    const invitation = repository.create({
      code: 'ABC123',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      colocation: coloc,
    });
    await repository.save(invitation);

    const found = await repository.findOneByCode('ABC123');
    expect(found).not.toBeNull();
    expect(found!.code).toBe('ABC123');
  });

  it('findOneByCode should return null if not exists', async () => {
    const found = await repository.findOneByCode('NOT_EXISTS');
    expect(found).toBeNull();
  });

  it('getOneByCode should return the invitation code if exists', async () => {
    const colocationRepo = ds.getRepository(Colocation);
    const coloc = colocationRepo.create({
      title: 'Test Coloc',
      backgroundImage: '',
      address: '',
      tasksRotationFrequency: 7,
      nextRotationDate: new Date(),
    });
    await colocationRepo.save(coloc);

    const invitation = repository.create({
      code: 'XYZ789',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      colocation: coloc, // 👈 important
    });
    await repository.save(invitation);

    const found = await repository.getOneByCode('XYZ789');
    expect(found.code).toBe('XYZ789');
  });

  it('getOneByCode should throw if not exists', async () => {
    await expect(repository.getOneByCode('INVALID')).rejects.toThrow(
      InvitationCodeNotFoundException
    );
  });
});
