import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DonationStatus } from '../../common/enums';
import { Msgs } from '../../common/utils/messages.utils';
import { AtomicTransactionService } from '../../database/atomic-transaction.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { DonationsRepository } from './donations.repository';
import { DonationsListQueryDto } from './dto/donation-query.dto';
import { MakeDonationDto } from './dto/donation.dto';
import { Donation } from './entities/donation.entity';
import { CursorPaginationResult } from 'src/common/interfaces/pagination.interface';
import { IdempotencyService } from 'src/common/services/idempotency/idempotency.service';

@Injectable()
export class DonationsService {
  constructor(
    private readonly donationsRepo: DonationsRepository,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
    private readonly atomicTransaction: AtomicTransactionService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  async createDonation(
    data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>,
    manager?: EntityManager,
  ): Promise<Donation> {
    return this.donationsRepo.createDonation(data, manager);
  }

  async makeDonation(
    donorId: string,
    makeDonationDto: MakeDonationDto,
    idempotencyKey: string,
  ): Promise<Donation> {
    return this.atomicTransaction.runInAtomic(async (manager) => {
      return this.idempotencyService.execute(
        {
          key: idempotencyKey,
          requestPath: '/donations',
          userId: donorId,
        },
        (manager) => this.processDonation(donorId, makeDonationDto, manager),
        manager,
      );
    });
  }

  private async processDonation(
    donorId: string,
    makeDonationDto: MakeDonationDto,
    manager: EntityManager,
  ): Promise<Donation> {
    const beneficiary = await this.verifyBeneficiary(
      makeDonationDto.beneficiaryId,
      manager,
    );

    // Process donation
    const transactionRef = this.generateTransactionRef();
    const { donorWallet, beneficiaryWallet } =
      await this.walletService.transferFundsInternally(
        donorId,
        makeDonationDto.beneficiaryId,
        makeDonationDto.transactionPin,
        makeDonationDto.amount,
        manager,
      );

    // Create donation record
    return this.createDonation(
      {
        donor: { id: donorId },
        beneficiary: { id: beneficiary.id },
        donorWallet: { id: donorWallet.id },
        beneficiaryWallet: { id: beneficiaryWallet.id },
        amount: makeDonationDto.amount,
        message: makeDonationDto.message,
        transactionRef,
        status: DonationStatus.SUCCESS,
      },
      manager,
    );
  }

  private async verifyBeneficiary(
    beneficiaryId: string,
    manager?: EntityManager,
  ): Promise<User> {
    const beneficiary = await this.usersService.findOneOrNull(
      { id: beneficiaryId },
      ['id'],
      manager,
    );

    if (!beneficiary) {
      throw new NotFoundException(Msgs.donation.BENEFICIARY_NOT_FOUND());
    }

    return beneficiary;
  }

  private generateTransactionRef(): string {
    return `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async getUserDonationStats(
    userId: ID,
  ): Promise<{ sent: number; received: number }> {
    const [sent, received] = await Promise.all([
      this.donationsRepo.countBy({ donor: { id: userId } }),
      this.donationsRepo.countBy({ beneficiary: { id: userId } }),
    ]);

    return { sent, received };
  }

  async getDonationDetails(id: ID): Promise<Donation> {
    return this.donationsRepo.getDonationDetails(id);
  }

  async getDonationsList(
    userId: ID,
    filter: DonationsListQueryDto,
  ): Promise<CursorPaginationResult<Donation, 'donations'>> {
    return this.donationsRepo.findAllBy(userId, filter);
  }
}
