import { ConfigService } from '@nestjs/config';
import {
  cookieExtractor,
  JwtStrategy,
} from '../../src/app/auth/infrastructure/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    } as any;

    strategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should configure secretOrKey correctly', () => {
    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should extract token from cookies', () => {
    const fakeReq = { cookies: { accessToken: 'token123' } };
    const extractedToken = cookieExtractor(fakeReq as any);
    expect(extractedToken).toBe('token123');
  });

  it('validate should return user id', async () => {
    const payload = { sub: 42 };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ id: 42 });
  });
});
