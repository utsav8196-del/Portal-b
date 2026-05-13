export interface JobData {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  countryName: string;
  status: boolean;
  createdAt: string;
}

export const mockJobs: JobData[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Develop and maintain modern web applications using React, TypeScript, and Tailwind CSS.",
    location: "New York, NY",
    salary: "$100,000 - $130,000",
    countryName: "United States",
    status: true,
    createdAt: "2025-01-15"
  },
  {
    id: 2,
    title: "Backend Engineer",
    description: "Design and implement scalable APIs and services using Node.js and MongoDB.",
    location: "London",
    salary: "£75,000 - £95,000",
    countryName: "United Kingdom",
    status: true,
    createdAt: "2025-02-10"
  },
  {
    id: 3,
    title: "DevOps Specialist",
    description: "Manage CI/CD pipelines and cloud infrastructure using AWS, Docker, and Kubernetes.",
    location: "Toronto",
    salary: "CAD 90,000 - CAD 110,000",
    countryName: "Canada",
    status: false,
    createdAt: "2025-02-15"
  },
  {
    id: 4,
    title: "UX/UI Designer",
    description: "Create intuitive user interfaces and experiences for web and mobile applications.",
    location: "Berlin",
    salary: "€65,000 - €80,000",
    countryName: "Germany",
    status: true,
    createdAt: "2025-03-01"
  },
  {
    id: 5,
    title: "Data Scientist",
    description: "Analyze large datasets to extract insights and build predictive models.",
    location: "Sydney",
    salary: "AUD 110,000 - AUD 140,000",
    countryName: "Australia",
    status: true,
    createdAt: "2025-03-10"
  },
  {
    id: 6,
    title: "Product Manager",
    description: "Define product vision, roadmap, and features based on user research and business requirements.",
    location: "Tokyo",
    salary: "¥8,000,000 - ¥12,000,000",
    countryName: "Japan",
    status: false,
    createdAt: "2025-03-15"
  },
  {
    id: 7,
    title: "Full Stack Developer",
    description: "Build end-to-end applications using React, Node.js, and PostgreSQL.",
    location: "Paris",
    salary: "€70,000 - €90,000",
    countryName: "France",
    status: true,
    createdAt: "2025-04-01"
  },
  {
    id: 8,
    title: "QA Engineer",
    description: "Design and implement testing strategies and frameworks for web applications.",
    location: "Singapore",
    salary: "SGD 75,000 - SGD 95,000",
    countryName: "Singapore",
    status: true,
    createdAt: "2025-04-10"
  },
  {
    id: 9,
    title: "Mobile Developer",
    description: "Create cross-platform mobile applications using React Native or Flutter.",
    location: "Mumbai",
    salary: "₹1,500,000 - ₹2,500,000",
    countryName: "India",
    status: false,
    createdAt: "2025-04-15"
  },
  {
    id: 10,
    title: "Technical Project Manager",
    description: "Lead technical projects and coordinate between different stakeholders.",
    location: "Sao Paulo",
    salary: "R$150,000 - R$200,000",
    countryName: "Brazil",
    status: true,
    createdAt: "2025-05-01"
  },
  {
    id: 11,
    title: "Cloud Architect",
    description: "Design and implement cloud-based solutions using AWS, Azure, or GCP.",
    location: "Seattle, WA",
    salary: "$140,000 - $180,000",
    countryName: "United States",
    status: true,
    createdAt: "2025-05-05"
  },
  {
    id: 12,
    title: "Blockchain Developer",
    description: "Develop decentralized applications and smart contracts using Ethereum and Solidity.",
    location: "Zurich",
    salary: "CHF 120,000 - CHF 150,000",
    countryName: "Switzerland",
    status: true,
    createdAt: "2025-05-10"
  }
];
