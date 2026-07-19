import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController, MockAuthGuard } from './transaction.controller';
import { PrismaClient } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';

// Mock the PrismaClient module
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    transaction: {
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockPrisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    
    // Get the mocked PrismaClient instance
    const prismaInstance = new PrismaClient();
    mockPrisma = prismaInstance;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchTransactions', () => {
    it('should return transactions successfully', async () => {
      const mockTransactions = [
        { id: '1', userId: 'user1', senderId: 'user1', receiverId: 'user2', amount: 100 },
      ];
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await controller.searchTransactions('user1');
      expect(result).toEqual(mockTransactions);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
    });

    it('should throw InternalServerErrorException when database query fails', async () => {
      mockPrisma.transaction.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(controller.searchTransactions('user1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('transferMoney', () => {
    it('should transfer money successfully with sufficient balance', async () => {
      const payload = {
        senderId: 'user1',
        receiverId: 'user2',
        senderBalance: '100.00',
        amount: '30.00',
      };

      const result = await controller.transferMoney(payload);
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(70);
    });

    it('should throw InternalServerErrorException with insufficient balance', async () => {
      const payload = {
        senderId: 'user1',
        receiverId: 'user2',
        senderBalance: '20.00',
        amount: '30.00',
      };

      await expect(controller.transferMoney(payload)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('MockAuthGuard', () => {
    it('should return true if headers exist', () => {
      const guard = new MockAuthGuard();
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} }),
        }),
      } as any;
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });
});
