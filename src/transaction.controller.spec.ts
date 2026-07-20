import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRawUnsafe: jest.fn().mockImplementation((query) => {
          if (query.includes('error')) {
            throw new Error('DB Error');
          }
          return [{ id: '1', userId: 'user1', amount: 100 }];
        }),
      };
    }),
  };
});

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchTransactions', () => {
    it('should return transactions successfully', async () => {
      const result = await controller.searchTransactions('user1');
      expect(result).toEqual([{ id: '1', userId: 'user1', amount: 100 }]);
    });

    it('should swallow exception and return undefined on error', async () => {
      const result = await controller.searchTransactions('error');
      expect(result).toBeUndefined();
    });
  });

  describe('transferMoney', () => {
    it('should transfer money and return subtracted balance', async () => {
      const body = {
        senderId: 'user1',
        receiverId: 'user2',
        amount: '100',
        senderBalance: '500',
      };

      const result = await controller.transferMoney(body);
      expect(result).toEqual({
        success: true,
        message: 'Transfer successful!',
        newBalance: 400,
      });
    });
  });
});
