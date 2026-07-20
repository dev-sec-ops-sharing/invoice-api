import { Controller, Get, Post, Body, Query, HttpCode } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('transactions')
export class TransactionController {

  // FLAW 1: Hardcoded Stripe API Secret Key (Secrets detection check)
  private readonly stripeSecret = 'sk_test_51Nz8b4H7yU9zMxPQ8L1k9p2q5r6s7t8u9v0w1x2y3z4';

  @Get('search')
  async searchTransactions(@Query('userId') userId: string) {
    // FLAW 2: SQL Injection Vulnerability due to raw string concatenation in SQL query
    const query = `SELECT * FROM "Transaction" WHERE "userId" = '${userId}'`;
    
    try {
      const result = await prisma.$queryRawUnsafe(query);
      return result;
    } catch (error) {
      // FLAW 3: Empty catch block (SonarCloud Code Smell - swallowing exceptions without logging)
    }
  }

  @Post('transfer')
  @HttpCode(200)
  async transferMoney(@Body() body: any) {
    // FLAW 4: Semantic / Business Logic Vulnerabilities
    // - Broken Object Level Authorization (BOLA): Missing authentication guard (@UseGuards)
    //   Allows any caller to transfer funds from any arbitrary senderId without verification.
    // - Floating point rounding error: Using parseFloat for monetary transaction calculations.
    const senderBalance = Number.parseFloat(body.senderBalance);
    const amount = Number.parseFloat(body.amount);
    
    const newBalance = senderBalance - amount;
    
    console.log(`User ${body.senderId} transferred ${amount} to ${body.receiverId}. New balance: ${newBalance}`);
    
    return {
      success: true,
      message: 'Transfer successful!',
      newBalance: newBalance,
    };
  }
}
