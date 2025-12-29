import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATA_SOURCE, DONATION_FILTER_TYPES } from 'src/common/constants';
import { Msgs } from 'src/common/utils/messages.utils';
import { QueryBuilderUtil } from 'src/common/utils/query-builder.util';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DonationsListQueryDto } from './dto/donation-query.dto';
import { Donation } from './entities/donation.entity';

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

  async findAllBy(
    userId: ID,
    query?: DonationsListQueryDto,
  ): Promise<Donation[]> {
    const queryBuilder = this.donationRepo
      .createQueryBuilder('donation')
      .leftJoin('donation.donor', 'donor')
      .leftJoin('donation.beneficiary', 'beneficiary')
      .select([
        'donation',
        'donor.id',
        'donor.firstName',
        'donor.lastName',
        'beneficiary.id',
        'beneficiary.firstName',
        'beneficiary.lastName',
      ]);

    // User scoping
    this.buildUserQuery(queryBuilder, userId, query?.type);

    // Apply all filters using utility
    QueryBuilderUtil.applyAllFilters(
      queryBuilder,
      'donation',
      query as Record<string, string | number | undefined>,
      [
        'type',
        'startDate',
        'endDate',
        'minAmount',
        'maxAmount',
        'sortDirection',
        ...Object.values(DONATION_FILTER_TYPES),
      ],
    );

    return queryBuilder
      .orderBy('donation.createdAt', 'DESC')
      .limit(100)
      .getMany();
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
        'beneficiary.id',
        'beneficiary.firstName',
        'beneficiary.lastName',
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

  private buildUserQuery(
    qb: SelectQueryBuilder<Donation>,
    userId: string,
    type?: DonationListType,
  ): SelectQueryBuilder<Donation> {
    if (type === DONATION_FILTER_TYPES.SENT) {
      qb.where('donation.donorId = :userId', { userId });
    } else if (type === DONATION_FILTER_TYPES.RECEIVED) {
      qb.where('donation.beneficiaryId = :userId', { userId });
    } else {
      qb.where(
        '(donation.donorId = :userId OR donation.beneficiaryId = :userId)',
        { userId },
      );
    }
    return qb;
  }
}
