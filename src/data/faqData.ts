export interface FAQData {
  id: number;
  countryId: number;
  countryName: string;
  question: string;
  answer: string;
  createdAt: string;
}

export const mockFAQs: FAQData[] = [
  {
    id: 1,
    countryId: 1,
    countryName: 'United States',
    question: 'What are the working hours?',
    answer: 'Standard working hours are 9:00 AM to 5:00 PM, Monday through Friday.',
    createdAt: '2024-12-15'
  },
  {
    id: 2,
    countryId: 1,
    countryName: 'United States',
    question: 'How do I request time off?',
    answer: 'Time off requests should be submitted through the HR portal at least two weeks in advance.',
    createdAt: '2024-12-14'
  },
  {
    id: 3,
    countryId: 2,
    countryName: 'United Kingdom',
    question: 'What is the dress code?',
    answer: 'The office maintains a business casual dress code. Formal attire is required for client meetings.',
    createdAt: '2024-12-10'
  },
  {
    id: 4,
    countryId: 3,
    countryName: 'Canada',
    question: 'How do I access technical support?',
    answer: 'Technical support is available by emailing support@company.com or calling the IT helpdesk at extension 1234.',
    createdAt: '2024-12-05'
  }
];
