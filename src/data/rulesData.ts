export interface RuleData {
  id: number;
  countryId: number;
  countryName: string;
  title: string;
  details: string;
  createdAt: string;
}

export const mockRules: RuleData[] = [
  {
    id: 1,
    countryId: 1,
    countryName: 'United States',
    title: 'Working Hours Policy',
    details: '<p>Standard working hours are 9:00 AM to 5:00 PM, Monday through Friday. Employees are expected to work 40 hours per week.</p><p>Overtime must be approved by a manager in advance.</p>',
    createdAt: '2024-12-15'
  },
  {
    id: 2,
    countryId: 1,
    countryName: 'United States',
    title: 'Remote Work Policy',
    details: '<p>Employees are allowed to work remotely up to 2 days per week with manager approval.</p><p>All remote workers must be available during core business hours and maintain productivity standards.</p>',
    createdAt: '2024-12-14'
  },
  {
    id: 3,
    countryId: 2,
    countryName: 'United Kingdom',
    title: 'Data Protection Policy',
    details: '<p>All employees must comply with GDPR regulations when handling customer data.</p><p>Personal data should only be accessed on a need-to-know basis and must be stored securely.</p>',
    createdAt: '2024-12-10'
  },
  {
    id: 4,
    countryId: 3,
    countryName: 'Canada',
    title: 'Code of Conduct',
    details: '<p>Employees are expected to maintain professional behavior at all times.</p><p>Harassment, discrimination, and bullying will not be tolerated.</p>',
    createdAt: '2024-12-05'
  }
];
