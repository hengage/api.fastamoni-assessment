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
      // 1. Verify donor and beneficiary
      const [donor, beneficiary] = await Promise.all([
        this.usersService.findById(donorId, ['id'], manager),
        this.usersService.findById(
          makeDonationDto.beneficiaryId,
          ['id'],
          manager,
        ),
      ]);

      if (!beneficiary) {
        throw new NotFoundException(Msgs.users.NOT_FOUND());
      }

      // 2. Get wallets
      const [donorWallet, beneficiaryWallet] = await Promise.all([
        this.walletService.getWalletByUserId(
          donor.id,
          ['id', 'balance'],
          manager,
        ),
        this.walletService.getWalletByUserId(beneficiary.id, ['id'], manager),
      ]);

      // 3. Process payment
      const transactionRef = this.generateTransactionRef();
      // await this.walletService.transferFunds(
      //   {
      //     fromWalletId: donorWallet.id,
      //     toWalletId: beneficiaryWallet.id,
      //     amount: makeDonationDto.amount,
      //     transactionRef,
      //   },
      //   manager,
      // );

      // 4. Create donation record
      return this.createDonation(
        {
          donor: { id: donor.id },
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

  private generateTransactionRef(): string {
    return `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
