require('dotenv').config();
const mongoose = require('mongoose');
const University = require('../models/University');

const universities = [
  {
    name: 'Harvard University',
    country: 'USA',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 60000,
    competitiveness: 'Very High',
    minGPA: 3.8,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Top-tier research university',
    ranking: 3,
  },
  {
    name: 'Massachusetts Institute of Technology',
    country: 'USA',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 59000,
    competitiveness: 'Very High',
    minGPA: 3.8,
    examRequirements: ['IELTS', 'GRE', 'GMAT'],
    description: 'Leading tech and engineering university',
    ranking: 2,
  },
  {
    name: 'Stanford University',
    country: 'USA',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 57000,
    competitiveness: 'Very High',
    minGPA: 3.8,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Prestigious research university',
    ranking: 4,
  },
  {
    name: 'University of Cambridge',
    country: 'UK',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 45000,
    competitiveness: 'Very High',
    minGPA: 3.7,
    examRequirements: ['IELTS'],
    description: 'Historic institution of excellence',
    ranking: 5,
  },
  {
    name: 'University of Oxford',
    country: 'UK',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 44000,
    competitiveness: 'Very High',
    minGPA: 3.7,
    examRequirements: ['IELTS'],
    description: 'World-renowned academic institution',
    ranking: 6,
  },
  {
    name: 'University of Melbourne',
    country: 'Australia',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 35000,
    competitiveness: 'High',
    minGPA: 3.5,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Leading Australian university',
    ranking: 37,
  },
  {
    name: 'University of Toronto',
    country: 'Canada',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 30000,
    competitiveness: 'High',
    minGPA: 3.5,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Top Canadian research university',
    ranking: 21,
  },
  {
    name: 'National University of Singapore',
    country: 'Singapore',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 32000,
    competitiveness: 'High',
    minGPA: 3.4,
    examRequirements: ['IELTS'],
    description: 'Leading Asian university',
    ranking: 8,
  },
  {
    name: 'University of Tokyo',
    country: 'Japan',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 28000,
    competitiveness: 'Medium',
    minGPA: 3.2,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Premier Japanese university',
    ranking: 39,
  },
  {
    name: 'Ruprecht Karl University of Heidelberg',
    country: 'Germany',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 15000,
    competitiveness: 'Medium',
    minGPA: 3.0,
    examRequirements: ['IELTS'],
    description: 'Oldest German university',
    ranking: 64,
  },
  {
    name: 'University of Amsterdam',
    country: 'Netherlands',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 20000,
    competitiveness: 'Medium',
    minGPA: 3.2,
    examRequirements: ['IELTS'],
    description: 'Research-intensive university',
    ranking: 58,
  },
  {
    name: 'ETH Zurich',
    country: 'Switzerland',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 50000,
    competitiveness: 'Very High',
    minGPA: 3.7,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Top engineering and science university',
    ranking: 10,
  },
  {
    name: 'University of British Columbia',
    country: 'Canada',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 28000,
    competitiveness: 'High',
    minGPA: 3.4,
    examRequirements: ['IELTS', 'GRE'],
    description: 'Prestigious Canadian university',
    ranking: 34,
  },
  {
    name: 'Seoul National University',
    country: 'South Korea',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 25000,
    competitiveness: 'High',
    minGPA: 3.3,
    examRequirements: ['IELTS'],
    description: 'Leading South Korean university',
    ranking: 30,
  },
  {
    name: 'University of São Paulo',
    country: 'Brazil',
    degreeTypes: ['Masters', 'PhD'],
    avgCost: 12000,
    competitiveness: 'Medium',
    minGPA: 3.0,
    examRequirements: ['IELTS'],
    description: 'Top university in Latin America',
    ranking: 84,
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-counsellor';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await University.deleteMany({});
    const result = await University.insertMany(universities);
    console.log(`${result.length} universities seeded successfully`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
