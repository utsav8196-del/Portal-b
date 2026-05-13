export interface SocialMediaPost {
  id: number;
  title: string;
  url: string;
  description: string;
  active: boolean;
  platform: string;
  createdAt: string;
}

export const socialMediaPosts: SocialMediaPost[] = [
  {
    id: 1,
    title: "Employee Recognition Program",
    url: "https://linkedin.com/company/example/posts/12345",
    description: "We're proud to recognize our outstanding team members through our new Employee Recognition Program! #EmployeeAppreciation #CompanyCulture",
    active: true,
    platform: "LinkedIn",
    createdAt: "2025-05-10T09:30:00Z"
  },
  {
    id: 2,
    title: "Product Launch Announcement",
    url: "https://twitter.com/examplecompany/status/12345678901234",
    description: "Exciting news! Our latest product will launch next week. Stay tuned for more details! #ProductLaunch #Innovation",
    active: true,
    platform: "Twitter",
    createdAt: "2025-05-08T14:15:00Z"
  },
  {
    id: 3,
    title: "Behind the Scenes",
    url: "https://instagram.com/p/ABC123xyz/",
    description: "Take a peek behind the scenes at our design team working on our next big project! #BehindTheScenes #TeamWork",
    active: false,
    platform: "Instagram",
    createdAt: "2025-05-05T11:45:00Z"
  },
  {
    id: 4,
    title: "Company Milestone",
    url: "https://facebook.com/examplecompany/posts/987654321",
    description: "We're celebrating 10 years of business today! Thank you to all our customers and employees who made this possible. #Anniversary #Milestone",
    active: true,
    platform: "Facebook",
    createdAt: "2025-05-01T10:00:00Z"
  },
  {
    id: 5,
    title: "Industry Conference Highlights",
    url: "https://linkedin.com/company/example/posts/567890",
    description: "Highlights from this year's industry conference where our CEO delivered a keynote address on future trends. #Conference #IndustryLeader",
    active: true,
    platform: "LinkedIn",
    createdAt: "2025-04-25T16:20:00Z"
  }
];
