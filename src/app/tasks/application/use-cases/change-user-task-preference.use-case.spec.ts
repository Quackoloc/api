import { Test, TestingModule } from '@nestjs/testing';
import { ChangeUserTaskPreferenceUseCase } from './change-user-task-preference.use-case';
import {
  UserTaskPreferenceRepositoryGateway,
  UserTaskPreferenceRepositoryToken,
} from '../../domain/gateways/user-task-preference.repository.gateway';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../colocations/domain/gateways/colocation.repository.gateway';
import { UserTaskPreference } from '../../domain/entities/user-task-preference.entity';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';
import {
  CannotCreateUserTaskPreferenceException,
  MembersNotFoundException,
} from '../../../colocations/domain/colocation.exceptions';
import { UserTaskPreferenceDto } from '../dtos/user-task-preference.dto';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';

jest.mock('../../../../config/logger.config', () => ({
  logger: { log: jest.fn() },
}));

describe('ChangeUserTaskPreferenceUseCase', () => {
  let useCase: ChangeUserTaskPreferenceUseCase;
  let preferenceRepository: jest.Mocked<UserTaskPreferenceRepositoryGateway>;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;

  const mockColocationId = 1;
  const mockRecurrentTaskId = 99;
  const mockUserId = 42;
  const mockConnectedUser: ConnectedUser = { id: mockUserId };

  const mockTask = {
    id: mockRecurrentTaskId,
    isRecurrent: true,
    title: 'Take out trash',
    description: 'Every week',
  } as ColocationTask;

  const mockPreferenceEntity: UserTaskPreference = {
    id: 123,
    userId: mockUserId,
    taskId: mockRecurrentTaskId,
    isOptedIn: true,
  } as any;

  beforeEach(async () => {
    preferenceRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      getOneById: jest.fn(),
      upsert: jest.fn(),
    } as any;

    taskRepository = { getOneById: jest.fn() } as any;
    colocationRepository = { isColocationMember: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeUserTaskPreferenceUseCase,
        { provide: UserTaskPreferenceRepositoryToken, useValue: preferenceRepository },
        { provide: ColocationTaskRepositoryToken, useValue: taskRepository },
        { provide: ColocationRepositoryToken, useValue: colocationRepository },
      ],
    }).compile();

    useCase = module.get(ChangeUserTaskPreferenceUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new preference if not existing and user is a member', async () => {
    preferenceRepository.findOne.mockResolvedValue(null);
    colocationRepository.isColocationMember.mockResolvedValue(true);
    taskRepository.getOneById.mockResolvedValue(mockTask);
    preferenceRepository.save.mockImplementation(async (entity) => ({
      ...entity,
      id: 123,
    }));

    const result = await useCase.execute(
      mockColocationId,
      mockRecurrentTaskId,
      mockUserId,
      true,
      mockConnectedUser
    );

    expect(colocationRepository.isColocationMember).toHaveBeenCalledWith(
      mockUserId,
      mockColocationId
    );
    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockRecurrentTaskId);
    expect(preferenceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId: mockUserId, taskId: mockRecurrentTaskId, isOptedIn: true })
    );
    expect(result).toEqual(
      UserTaskPreferenceDto.fromEntity({ ...mockPreferenceEntity, isOptedIn: true })
    );
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw MembersNotFoundException if user is not a colocation member', async () => {
    preferenceRepository.findOne.mockResolvedValue(null);
    colocationRepository.isColocationMember.mockResolvedValue(false);

    await expect(
      useCase.execute(mockColocationId, mockRecurrentTaskId, mockUserId, true, mockConnectedUser)
    ).rejects.toThrow(MembersNotFoundException);

    expect(taskRepository.getOneById).not.toHaveBeenCalled();
    expect(preferenceRepository.save).not.toHaveBeenCalled();
  });

  it('should throw CannotCreateUserTaskPreferenceException if task is not recurrent', async () => {
    preferenceRepository.findOne.mockResolvedValue(null);
    colocationRepository.isColocationMember.mockResolvedValue(true);
    taskRepository.getOneById.mockResolvedValue({ ...mockTask, isRecurrent: false });

    await expect(
      useCase.execute(mockColocationId, mockRecurrentTaskId, mockUserId, true, mockConnectedUser)
    ).rejects.toThrow(CannotCreateUserTaskPreferenceException);

    expect(preferenceRepository.save).not.toHaveBeenCalled();
  });

  it('should update existing preference if found', async () => {
    const existingPreference = { ...mockPreferenceEntity, isOptedIn: false };
    preferenceRepository.findOne.mockResolvedValue(existingPreference as UserTaskPreference);
    preferenceRepository.save.mockImplementation(async (entity) => entity);

    const result = await useCase.execute(
      mockColocationId,
      mockRecurrentTaskId,
      mockUserId,
      true,
      mockConnectedUser
    );

    expect(preferenceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        userId: mockUserId,
        taskId: mockRecurrentTaskId,
        isOptedIn: true,
      })
    );
    expect(result.isOptedIn).toBe(true);
    expect(logger.log).toHaveBeenCalled();
  });

  it('should propagate errors from repository.save', async () => {
    preferenceRepository.findOne.mockResolvedValue(null);
    colocationRepository.isColocationMember.mockResolvedValue(true);
    taskRepository.getOneById.mockResolvedValue(mockTask);
    preferenceRepository.save.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute(mockColocationId, mockRecurrentTaskId, mockUserId, true, mockConnectedUser)
    ).rejects.toThrow('DB error');
  });
});
