import { Body, Controller, Param, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post(':id/transaction-pin')
  // @ApiCreatedResponse({ type: () => Wallet })
  @ResponseMessage('Transaction pin updated')
  async setTransactionPin(
    @Body('pin') pin: string,
    @Param('id') walletId: string,
  ) {
    return this.walletService.setTransactionPin(walletId, pin);
  }
}
