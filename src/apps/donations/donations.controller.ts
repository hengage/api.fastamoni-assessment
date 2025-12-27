import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CurrentUserCtx } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Msgs } from 'src/common/utils/messages.utils';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { DonationsService } from './donations.service';
import {
  GetUserDonationStatsResponseDto,
  MakeDonationResponseDto,
} from './dto/donation-response.dto';
import { MakeDonationDto } from './dto/donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: () => MakeDonationResponseDto })
  @ApiBearerAuth()
  @ResponseMessage(Msgs.donation.DONATION_SUCCESS())
  makeDonation(
    @CurrentUserCtx() user: User,
    @Body() makeDonationDto: MakeDonationDto,
  ) {
    return this.donationsService.makeDonation(user.id, makeDonationDto);
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: () => GetUserDonationStatsResponseDto })
  getUserDonationStats(@CurrentUserCtx() user: User) {
    return this.donationsService.getUserDonationStats(user.id);
  }
}
