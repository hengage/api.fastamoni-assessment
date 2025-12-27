import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Donation } from './entities/donation.entity';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DATA_SOURCE } from 'src/common/constants';
import { Msgs } from 'src/common/utils/messages.utils';

@Injectable()
export class DonationsRepository {
  private readonly donationRepo: Repository<Donation>;

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.donationRepo = this.dataSource.getRepository(Donation);
  }

  async createDonation(
    data: Partial<Donation>,
    manager?: EntityManager,
  ): Promise<Donation> {
    const repo = manager?.getRepository(Donation) || this.donationRepo;
    const donation = repo.create(data);
    return repo.save(donation);
  }

  async findOneBy<K extends Keys<Donation>>(
    cond: FindOptionsWhere<Donation> | FindOptionsWhere<Donation>[],
    select?: K[],
    manager?: EntityManager,
    lock?: { mode: DatabaseLockMode },
  ): Promise<Donation> {
    const repo = manager?.getRepository(Donation) ?? this.donationRepo;
    const donation = await repo.findOne({
      where: cond,
      ...(select && { select }),
      ...(lock && { lock }),
    });

    if (!donation) {
      throw new NotFoundException(Msgs.common.NOT_FOUND('Donation'));
    }

    return donation;
  }

  async getDonationDetails(id: ID, manager?: EntityManager): Promise<Donation> {
    const repo = manager?.getRepository(Donation) ?? this.donationRepo;

    const donation = await repo
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.donor', 'donor')
      .leftJoinAndSelect('donation.beneficiary', 'beneficiary')
      .leftJoinAndSelect('donation.donorWallet', 'donorWallet')
      .leftJoinAndSelect('donation.beneficiaryWallet', 'beneficiaryWallet')
      .select([
        'donation',
        'donor.id',
        'donor.firstName',
        'donor.lastName',
        'donor.email',
        'beneficiary.id',
        'beneficiary.firstName',
        'beneficiary.lastName',
        'beneficiary.email',
        'donorWallet.id',
        'donorWallet.balance',
        'beneficiaryWallet.id',
        'beneficiaryWallet.balance',
      ])
      .where('donation.id = :id', { id })
      .getOne();

    if (!donation) {
      throw new NotFoundException(Msgs.common.NOT_FOUND('Donation'));
    }
    return donation;
  }

  async countBy(
    criteria: FindOptionsWhere<Donation> | FindOptionsWhere<Donation>[],
    manager?: EntityManager,
  ): Promise<number> {
    const repo = manager?.getRepository(Donation) ?? this.donationRepo;
    return repo.count({ where: criteria });
  }
}
