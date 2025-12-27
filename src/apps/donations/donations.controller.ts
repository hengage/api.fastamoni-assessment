import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CurrentUserCtx } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { DonationsService } from './donations.service';
import { DonationDto, MakeDonationDto } from './dto/donation.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Msgs } from 'src/common/utils/messages.utils';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: DonationDto })
  @ApiBearerAuth()
  @ResponseMessage(Msgs.donation.DONATION_SUCCESS())
  makeDonation(
    @CurrentUserCtx() user: User,
    @Body() makeDonationDto: MakeDonationDto,
  ) {
    return this.donationsService.makeDonation(user.id, makeDonationDto);
  }
}
