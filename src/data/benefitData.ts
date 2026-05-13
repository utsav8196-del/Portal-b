export interface BenefitData {
  id: number;
  countryId: number;
  countryName: string;
  title: string;
  details: string;
  createdAt: string;
}

export const mockBenefits: BenefitData[] = [
  {
    id: 1,
    countryId: 1,
    countryName: 'United States',
    title: 'Healthcare Coverage',
    details: 'Comprehensive health insurance covering medical, dental, and vision with family options available.',
    createdAt: '2024-12-15'
  },
  {
    id: 2,
    countryId: 1,
    countryName: 'United States',
    title: 'Retirement Plan',
    details: 'Company matched 401(k) plan with immediate vesting and flexible investment options.',
    createdAt: '2024-12-14'
  },
  {
    id: 3,
    countryId: 2,
    countryName: 'United Kingdom',
    title: 'Paid Time Off',
    details: '25 days annual leave plus bank holidays, with option to buy additional days.',
    createdAt: '2024-12-10'
  },
  {
    id: 4,
    countryId: 2,
    countryName: 'United Kingdom',
    title: 'Parental Leave',
    details: 'Enhanced maternity and paternity leave beyond statutory requirements.',
    createdAt: '2024-12-08'
  },
  {
    id: 5,
    countryId: 3,
    countryName: 'Canada',
    title: 'Professional Development',
    details: 'Annual budget for courses, conferences, and certifications to support career growth.',
    createdAt: '2024-12-05'
  },
  {
    id: 6,
    countryId: 4,
    countryName: 'Germany',
    title: 'Flexible Working',
    details: 'Hybrid work model with flexible hours and remote working options.',
    createdAt: '2024-12-01'
  },
  {
    id: 7,
    countryId: 5,
    countryName: 'Australia',
    title: 'Wellness Program',
    details: 'Gym membership, mental health support, and wellness activities.',
    createdAt: '2024-11-28'
  },
  {
    id: 8,
    countryId: 7,
    countryName: 'France',
    title: 'Meal Vouchers',
    details: 'Daily meal vouchers for use at participating restaurants and supermarkets.',
    createdAt: '2024-11-25'
  },
  {
    id: 9,
    countryId: 10,
    countryName: 'Brazil',
    title: 'Transportation Allowance',
    details: 'Monthly stipend to cover commuting costs to and from work.',
    createdAt: '2024-11-20'
  },
  {
    id: 10,
    countryId: 11,
    countryName: 'India',
    title: 'Education Assistance',
    details: 'Tuition reimbursement for employees pursuing higher education related to their role.',
    createdAt: '2024-11-15'
  },
  {
    id: 11,
    countryId: 15,
    countryName: 'Singapore',
    title: 'Housing Allowance',
    details: 'Monthly contribution towards housing costs for relocated employees.',
    createdAt: '2024-11-10'
  },
  {
    id: 12,
    countryId: 3,
    countryName: 'Canada',
    title: 'Profit Sharing',
    details: 'Annual bonus based on company performance and individual contributions.',
    createdAt: '2024-11-05'
  }
];
