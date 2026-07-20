import { NestFactory } from '@nestjs/core';

const mockApp = {
  enableCors: jest.fn(),
  useGlobalPipes: jest.fn(),
  listen: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@nestjs/core', () => {
  return {
    NestFactory: {
      create: jest.fn().mockImplementation(() => Promise.resolve(mockApp)),
    },
  };
});

describe('main.ts', () => {
  it('should bootstrap the application', async () => {
    await import('./main');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(NestFactory.create).toHaveBeenCalled();
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalled();
  });
});
