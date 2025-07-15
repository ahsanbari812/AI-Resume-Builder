import axios from "axios";

// Base configuration for Gemini API
const GEMINI_CONFIG = {
  model: "gemini-2.5-flash",
  temperature: 0.7,
};

/**
 * Generate content for a specific resume section using Gemini
 * @param {string} prompt - The prompt to send to the AI
 * @param {number} numSuggestions - Number of suggestions to request
 * @returns {Promise<string[]>} - The generated content as an array of suggestions
 */
export async function generateResumeSection(prompt, numSuggestions = 1) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/gemini", // Use backend proxy
      {
        ...GEMINI_CONFIG,
        prompt: `You are a professional resume writer. Generate ${numSuggestions} distinct, concise, professional options suitable for a resume. Use bullet points where appropriate and keep the tone professional. Separate each option with a line containing only three dashes (---).\n\n${prompt}`
      }
    );
    // Split suggestions by '---' separator
    return response.data.content.split(/\n?---+\n?/).map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("AI generation error:", error);
    
    if (error.response?.status === 400) {
      throw new Error("Invalid request. Please check your input.");
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (error.response?.status >= 500) {
      throw new Error("Gemini service is currently unavailable. Please try again later.");
    } else {
      throw new Error("Failed to generate content. Please check your internet connection and try again.");
    }
  }
}

/**
 * Generate a professional summary based on user data
 * @param {Object} userData - User's resume data
 * @param {number} numSuggestions - Number of suggestions to request
 * @returns {Promise<string[]>} - Generated professional summaries
 */
export async function generateProfessionalSummary(userData, numSuggestions = 3) {
  const { personalInfo, jobTitle, skills, experience, industry } = userData;
  // Example outputs for few-shot prompting
  const examples = `
Example 1: Creative and detail-oriented Frontend Developer with 3+ years of experience building responsive web applications. Skilled in React and UI/UX, with a proven track record of improving user engagement and driving business results.

Example 2: Results-driven Software Engineer with expertise in JavaScript, React, and modern UI/UX practices. Adept at collaborating with cross-functional teams to deliver high-quality products on time.

Example 3: Passionate developer with a strong background in frontend technologies and a keen eye for design. Experienced in leading projects from concept to launch, ensuring seamless user experiences.`;

  const prompt = `You are an expert resume writer. Write ${numSuggestions} compelling, distinct professional summaries for a resume with the following details:

Name: ${personalInfo.name || 'Professional'}
Job Title: ${jobTitle || 'Professional'}
Industry: ${industry || 'General'}
Skills: ${skills && skills.length ? skills.join(', ') : 'various technical skills'}
Experience Level: ${experience && experience.length > 0 ? `${experience.length} years of experience` : 'entry-level'}

Each summary should be 2-3 sentences, highlight key strengths and career objectives, and be engaging and professional. Use a confident, modern tone. Here are some examples of the style you should follow:
${examples}

Separate each summary with a line containing only three dashes (---).`;
  return generateResumeSection(prompt, numSuggestions);
}

/**
 * Generate achievement bullet points based on job experience
 * @param {Object[]} experience - Job experience data
 * @param {number} numSuggestions - Number of suggestions to request
 * @returns {Promise<string[]>} - Generated achievement bullet lists
 */
export async function generateAchievements(experience, numSuggestions = 3) {
  // Example outputs for few-shot prompting
  const examples = `
Example 1:
- Increased website conversion rate by 20% through UI redesign
- Led a team of 4 developers to deliver a project 2 weeks ahead of schedule
- Automated deployment process, reducing release time by 30%

Example 2:
- Developed a reusable component library adopted across 3 teams
- Mentored 2 junior developers, improving team productivity
- Implemented analytics tracking, providing actionable insights to stakeholders
`;
  let prompt;
  if (!experience || experience.length === 0) {
    prompt = `You are an expert resume writer. Generate ${numSuggestions} sets of 3-5 professional achievement bullet points for a general professional. Focus on measurable accomplishments, leadership, and impact. Use a confident, modern tone. Here are some examples of the style you should follow:
${examples}
Separate each set with a line containing only three dashes (---).`;
  } else {
    const latestExperience = experience[0];
    prompt = `You are an expert resume writer. Generate ${numSuggestions} sets of 3-5 professional achievement bullet points for this job experience:

Position: ${latestExperience.position || 'Professional'}
Company: ${latestExperience.company || 'Company'}
Description: ${latestExperience.description || 'General professional work'}

Each set should be specific, measurable achievements that would be impressive on a resume. Use action verbs, include metrics where possible, and keep the tone confident and modern. Here are some examples of the style you should follow:
${examples}
Separate each set with a line containing only three dashes (---).`;
  }
  return generateResumeSection(prompt, numSuggestions);
}

/**
 * Generate job description based on position and company
 * @param {string} position - Job position
 * @param {string} company - Company name
 * @returns {Promise<string>} - Generated job description
 */
export async function generateJobDescription(position, company) {
  const prompt = `Write a professional job description for this position:
  
  Position: ${position}
  Company: ${company}
  
  Write 2-3 bullet points describing key responsibilities and achievements. Make it specific and professional.`;

  return generateResumeSection(prompt);
}

/**
 * Generate skills recommendations based on job title and context
 * @param {string} jobTitle - The job title
 * @param {string[]} skills - Existing skills
 * @param {string} industry - Industry
 * @param {number} numSuggestions - Number of suggestions to request
 * @returns {Promise<string[][]>} - Array of skill lists (each is an array of skills)
 */
export async function generateSkillsRecommendations(jobTitle, skills = [], industry = '', numSuggestions = 3) {
  // Example outputs for few-shot prompting
  const examples = `
Example 1: React, JavaScript, HTML5, CSS3, Redux, TypeScript, Figma, Responsive Design, Git, Agile, Communication, Problem Solving

Example 2: Node.js, Express, MongoDB, REST APIs, Docker, CI/CD, Teamwork, Adaptability, Time Management, Testing, Debugging
`;
  const prompt = `You are an expert resume writer. Recommend ${numSuggestions} distinct lists of 8-12 relevant skills for a ${jobTitle} position in the ${industry || 'general'} industry.
Include both technical and soft skills that would be valuable for this role.
If the following skills are already present, include them if relevant: ${skills && skills.length ? skills.join(', ') : 'none'}.
Here are some examples of the style you should follow:
${examples}
Return only the skills separated by commas for each list, and separate each list with a line containing only three dashes (---).`;
  const results = await generateResumeSection(prompt, numSuggestions);
  // Split each suggestion into an array of skills
  return results.map(s => s.split(',').map(skill => skill.trim()).filter(Boolean));
}

/**
 * Generate a personalized cover letter based on the full resume data
 * @param {Object} resumeData - The user's complete resume data
 * @returns {Promise<string>} - The generated cover letter
 */
export async function generateCoverLetter(resumeData) {
  const { personalInfo, jobTitle, summary, experience, education, skills, achievements, industry, dreamJob } = resumeData;
  const expString = (experience && experience.length > 0)
    ? experience.map(exp => `- ${exp.position || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''}): ${exp.description || ''}`).join('\n')
    : 'No experience provided.';
  const eduString = (education && education.length > 0)
    ? education.map(edu => `- ${edu.degree || ''} in ${edu.field || ''} from ${edu.institution || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`).join('\n')
    : 'No education provided.';
  const skillsString = (skills && skills.length > 0) ? skills.join(', ') : 'No skills provided.';
  const achievementsString = (achievements && achievements.length > 0) ? achievements.join('; ') : 'No achievements provided.';

  const prompt = `Write a professional, personalized cover letter for a job application using the following resume details. The letter should be engaging, highlight the candidate's strengths, and be suitable for a modern job search. Use a friendly but professional tone.\n\nName: ${personalInfo?.name || ''}\nEmail: ${personalInfo?.email || ''}\nPhone: ${personalInfo?.phone || ''}\nLocation: ${personalInfo?.location || ''}\nLinkedIn: ${personalInfo?.linkedin || ''}\nWebsite: ${personalInfo?.website || ''}\nGitHub: ${personalInfo?.github || ''}\nJob Title: ${jobTitle || ''}\nIndustry: ${industry || ''}\nDream Job: ${dreamJob || ''}\nSummary: ${summary || ''}\n\nExperience:\n${expString}\n\nEducation:\n${eduString}\n\nSkills: ${skillsString}\nAchievements: ${achievementsString}\n\nThe letter should be 3-5 paragraphs, tailored to a generic job application, and ready to be customized for a specific employer.\n\nReturn only the cover letter text, no extra commentary or formatting.`;

  const results = await generateResumeSection(prompt, 1);
  return results[0];
}

/**
 * Generate entire resume content based on basic information
 * @param {Object} basicInfo - Basic user information
 * @returns {Promise<Object>} - Generated resume sections
 */
export async function generateEntireResume(basicInfo) {
  const { name, jobTitle, skills } = basicInfo;
  
  try {
    const [summary, achievements, skillsList] = await Promise.all([
      generateProfessionalSummary({ personalInfo: { name }, jobTitle, skills }),
      generateAchievements([]),
      generateSkillsRecommendations(jobTitle)
    ]);

    return {
      summary,
      achievements: achievements.split('\n').filter(item => item.trim()),
      skills: skillsList.map(skill => skill.trim())
    };
  } catch (error) {
    throw new Error(`Failed to generate resume: ${error.message}`);
  }
}

/**
 * Validate API key (basic check)
 * @returns {boolean} - Whether the API key is set
 */
export function isApiKeyConfigured() {
  return true; // No API key needed for local proxy
}

/**
 * Get API key status for UI feedback
 * @returns {Object} - Status information
 */
export function getApiKeyStatus() {
  return {
    configured: true,
    message: "API key is configured"
  };
} 