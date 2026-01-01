import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { HTTP_HEADERS } from 'src/common/constants';
import { CurrentUserCtx } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { IdParamPipe } from 'src/common/pipes/uuid-validation.pipes';
import { IdempotencyGuard } from 'src/common/services/idempotency/idempotency.guard';
import { Msgs } from 'src/common/utils/messages.utils';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { DonationsService } from './donations.service';
import { DonationsListQueryDto } from './dto/donation-query.dto';
import {
  GetDonationDetailResponseDto,
  GetDonationsListReponseDto,
  GetUserDonationStatsResponseDto,
  MakeDonationResponseDto,
} from './dto/donation-response.dto';
import { MakeDonationDto } from './dto/donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IdempotencyGuard)
  @ApiCreatedResponse({ type: () => MakeDonationResponseDto })
  @ApiBearerAuth()
  @ResponseMessage(Msgs.donation.DONATION_SUCCESS())
  makeDonation(
    @CurrentUserCtx() user: User,
    @Headers(HTTP_HEADERS.IDEMPOTENCY_KEY) idempotencyKey: string,
    @Body() makeDonationDto: MakeDonationDto,
  ) {
    return this.donationsService.makeDonation(
      user.id,
      makeDonationDto,
      idempotencyKey,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => GetDonationsListReponseDto })
  async getDonationsList(
    @CurrentUserCtx() user: User,
    @Query() query?: DonationsListQueryDto,
  ) {
    console.log('Query:', query);
    return this.donationsService.getDonationsList(user.id, query || {});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => GetDonationDetailResponseDto })
  async getDonationDetails(@Param('id', IdParamPipe) id: string) {
    return this.donationsService.getDonationDetails(id);
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => GetUserDonationStatsResponseDto })
  getUserDonationStats(@CurrentUserCtx() user: User) {
    return this.donationsService.getUserDonationStats(user.id);
  }
}
