export interface NewsArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "New Benefits Package Announced",
    url: "https://example.com/news/benefits-package",
    description: "Our company is proud to announce an enhanced benefits package for all employees, including improved healthcare options and expanded retirement plans.",
    active: true,
    createdAt: "2025-04-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Quarterly Financial Results",
    url: "https://example.com/news/q1-results",
    description: "The company has exceeded expectations with Q1 financial results, showing a 15% increase in revenue compared to the same period last year.",
    active: true,
    createdAt: "2025-04-10T14:45:00Z"
  },
  {
    id: 3,
    title: "Office Renovation Project",
    url: "https://example.com/news/office-renovation",
    description: "The headquarters renovation project will begin next month. Temporary workspaces will be assigned to affected departments.",
    active: false,
    createdAt: "2025-04-05T09:15:00Z"
  },
  {
    id: 4,
    title: "Annual Company Retreat",
    url: "https://example.com/news/company-retreat",
    description: "This year's company retreat will take place at Mountain View Resort. Registration is now open for all employees.",
    active: true,
    createdAt: "2025-04-02T11:20:00Z"
  },
  {
    id: 5,
    title: "New Client Partnership",
    url: "https://example.com/news/client-partnership",
    description: "We're excited to announce our new partnership with GlobalTech Industries, which will expand our market presence in Asia.",
    active: true,
    createdAt: "2025-03-28T16:10:00Z"
  }
];
