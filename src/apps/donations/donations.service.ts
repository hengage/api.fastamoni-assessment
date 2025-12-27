import { DonationsRepository } from './donations.repository';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { AtomicTransactionService } from '../../database/atomic-transaction.service';
import { Donation } from './entities/donation.entity';
import { DonationStatus } from '../../common/enums';
import { Msgs } from '../../common/utils/messages.utils';
import { EntityManager } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MakeDonationDto } from './dto/donation.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DonationsService {
  constructor(
    private readonly donationsRepo: DonationsRepository,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
    private readonly atomicTransaction: AtomicTransactionService,
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
  ): Promise<Donation> {
    return this.atomicTransaction.runInAtomic(async (manager) => {
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
    });
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
}
