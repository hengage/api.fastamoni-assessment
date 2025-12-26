import { Body, Controller, Param, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { WalletService } from './wallet.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { SetTransactionPinResponseDto } from './dto/wallet-response.dto';
import { SetTransactionPinDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post(':id/transaction-pin')
  @ApiCreatedResponse({ type: () => SetTransactionPinResponseDto })
  @ResponseMessage('Transaction pin updated')
  async setTransactionPin(
    @Body() setTransactionPinDto: SetTransactionPinDto,
    @Param('id') walletId: string,
  ) {
    return this.walletService.setTransactionPin(
      walletId,
      setTransactionPinDto.pin,
    );
  }
}
