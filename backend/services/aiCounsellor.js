const axios = require('axios');
const User = require('../models/User');
const University = require('../models/University');
const Shortlist = require('../models/Shortlist');
const Task = require('../models/Task');

const analyzeProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const userOnboarding = user.onboarding;
    const shortlistedCount = await Shortlist.countDocuments({ userId });
    const lockedUniversity = await Shortlist.findOne({
      userId,
      isLocked: true,
    }).populate('universityId');

    const prompt = `
    You are an expert study abroad counselor. Analyze this student's profile and provide guidance:
    
    Student Profile:
    - Education Level: ${userOnboarding.academic?.educationLevel}
    - Major: ${userOnboarding.academic?.major}
    - GPA: ${userOnboarding.academic?.gpa || 'Not provided'}
    - Intended Degree: ${userOnboarding.studyGoals?.intendedDegree}
    - Field of Study: ${userOnboarding.studyGoals?.fieldOfStudy}
    - Preferred Countries: ${userOnboarding.studyGoals?.preferredCountries?.join(', ')}
    - Yearly Budget: ${userOnboarding.budget?.yearlyBudget}
    - Funding Type: ${userOnboarding.budget?.fundingType}
    - IELTS Status: ${userOnboarding.exams?.ielts}
    - GRE/GMAT Status: ${userOnboarding.exams?.greGmat}
    - SOP Status: ${userOnboarding.exams?.sop}
    - Shortlisted Universities: ${shortlistedCount}
    - Locked University: ${lockedUniversity?.universityId?.name || 'None'}
    
    Provide:
    1. Assessment of strengths and gaps
    2. Specific recommendations
    3. Next steps in JSON format with recommended actions
    
    Format the response as JSON:
    {
      "message": "Your counseling message here",
      "strengths": ["strength1", "strength2"],
      "gaps": ["gap1", "gap2"],
      "recommendations": ["recommendation1"],
      "actions": [
        {
          "type": "shortlist",
          "universityId": "university_id",
          "category": "Dream/Target/Safe"
        },
        {
          "type": "createTask",
          "title": "Task title",
          "description": "Task description",
          "taskType": "SOP/Exam/Form/Deadline/Document/General",
          "priority": "Low/Medium/High",
          "dueDate": "2024-MM-DD"
        }
      ]
    }`;

    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('AI Counsellor Error:', error);
    throw error;
  }
};

const callGeminiAPI = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return generateMockResponse(prompt);
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    try {
      return JSON.parse(text);
    } catch {
      return {
        message: text,
        actions: [],
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return generateMockResponse(prompt);
  }
};

const generateMockResponse = (prompt) => {
  const mockResponses = [
    {
      message:
        'Based on your profile, you have a strong foundation for pursuing studies abroad. Your GPA and exam scores are competitive. I recommend focusing on perfecting your SOP and building a diverse university list with Dream, Target, and Safe options.',
      strengths: [
        'Strong academic background',
        'Clear career goals',
        'Budget clarity',
      ],
      gaps: ['IELTS score below target', 'Limited research university details'],
      recommendations: [
        'Complete IELTS to 7.0+',
        'Research 2-3 more universities',
        'Draft SOP focusing on career goals',
      ],
      actions: [
        {
          type: 'createTask',
          title: 'Complete IELTS Preparation',
          description: 'Target score: 7.0 or above',
          taskType: 'Exam',
          priority: 'High',
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          type: 'createTask',
          title: 'Draft Statement of Purpose',
          description:
            'Highlight your academic journey, career aspirations, and why this program fits',
          taskType: 'SOP',
          priority: 'High',
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ],
    },
    {
      message:
        'Your profile shows good potential for selective universities. Focus on strengthening your application narrative. Consider universities that align with your budget constraints while maintaining academic competitiveness.',
      strengths: ['Clear field of study', 'Diverse university preferences'],
      gaps: [
        'GRE/GMAT not completed',
        'Budget may limit options at top-ranked universities',
      ],
      recommendations: [
        'Complete GRE/GMAT soon',
        'Explore scholarships and funding options',
        'Build a balanced shortlist',
      ],
      actions: [
        {
          type: 'createTask',
          title: 'Schedule GRE Exam',
          description: 'Aim for top 30th percentile',
          taskType: 'Exam',
          priority: 'High',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          type: 'createTask',
          title: 'Research Scholarship Opportunities',
          description: 'Find scholarships matching your profile',
          taskType: 'Document',
          priority: 'Medium',
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ],
    },
  ];

  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

const executeActions = async (userId, actions) => {
  try {
    if (!actions || !Array.isArray(actions)) return [];

    const results = [];
    for (const action of actions) {
      if (action.type === 'createTask') {
        const task = new Task({
          userId,
          universityId: action.universityId,
          title: action.title,
          description: action.description,
          taskType: action.taskType,
          dueDate: action.dueDate,
          priority: action.priority,
          generatedByAI: true,
        });
        await task.save();
        results.push(task);
      } else if (action.type === 'shortlist') {
        const shortlist = new Shortlist({
          userId,
          universityId: action.universityId,
          category: action.category,
        });
        await shortlist.save();
        results.push(shortlist);
      }
    }
    return results;
  } catch (error) {
    console.error('Error executing actions:', error);
    return [];
  }
};

module.exports = {
  analyzeProfile,
  callGeminiAPI,
  executeActions,
};
