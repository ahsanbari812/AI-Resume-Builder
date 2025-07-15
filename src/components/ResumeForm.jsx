import React from 'react'
import { User, Briefcase, GraduationCap, Target, Award, Plus, Trash2, Sparkles, Loader2, CheckCircle2, PlusCircle, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const buttonMotion = {
  whileHover: { scale: 1.05, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  whileTap: { scale: 0.97 }
}
const iconMotion = {
  whileHover: { rotate: [0, -10, 10, 0], scale: 1.15 },
  transition: { duration: 0.5, type: 'spring', stiffness: 200 }
}
const headerMotion = {
  whileHover: { scale: 1.04, color: '#6366f1' },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
}

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-zinc-700 rounded ${className}`} />
)

const ResumeForm = ({ resumeData, updateResumeData, onGenerateSection, isGenerating }) => {
  // Section completion logic for checkmarks
  const sectionComplete = {
    'personal-info': resumeData.personalInfo.name && resumeData.personalInfo.email && resumeData.personalInfo.phone,
    'summary': resumeData.summary && resumeData.summary.trim().length > 0,
    'experience': resumeData.experience.length > 0 && resumeData.experience[0].company && resumeData.experience[0].position,
    'education': resumeData.education.length > 0 && resumeData.education[0].institution && resumeData.education[0].degree,
    'skills': resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0],
    'achievements': resumeData.achievements && resumeData.achievements.length > 0 && resumeData.achievements[0],
  }

  const updatePersonalInfo = (field, value) => {
    updateResumeData('personalInfo', {
      ...resumeData.personalInfo,
      [field]: value
    })
  }

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    updateResumeData('experience', [...resumeData.experience, newExperience])
  }

  const updateExperience = (id, field, value) => {
    const updatedExperience = resumeData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    updateResumeData('experience', updatedExperience)
  }

  const removeExperience = (id) => {
    const filteredExperience = resumeData.experience.filter(exp => exp.id !== id)
    updateResumeData('experience', filteredExperience)
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
    updateResumeData('education', [...resumeData.education, newEducation])
  }

  const updateEducation = (id, field, value) => {
    const updatedEducation = resumeData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    )
    updateResumeData('education', updatedEducation)
  }

  const removeEducation = (id) => {
    const filteredEducation = resumeData.education.filter(edu => edu.id !== id)
    updateResumeData('education', filteredEducation)
  }

  const updateSkills = (value) => {
    // Don't filter out empty strings to allow typing spaces and commas
    const skillsArray = value.split(',').map(skill => skill.trim())
    updateResumeData('skills', skillsArray)
  }

  const updateAchievements = (value) => {
    // Store the raw text value to preserve spaces and formatting
    const achievementsArray = value.split('\n')
    updateResumeData('achievements', achievementsArray)
  }

  // Custom sections
  const addCustomSection = () => {
    const newSection = { id: Date.now(), title: '', content: '' };
    updateResumeData('customSections', [...(resumeData.customSections || []), newSection]);
  };
  const updateCustomSection = (id, field, value) => {
    const updated = resumeData.customSections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec);
    updateResumeData('customSections', updated);
  };
  const removeCustomSection = (id) => {
    updateResumeData('customSections', resumeData.customSections.filter(sec => sec.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <motion.div id="personal-info" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center space-x-2 mb-4">
          <motion.span {...iconMotion}>
            <User className="w-5 h-5 text-cyan-500" />
          </motion.span>
          <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Personal Information
            {sectionComplete['personal-info'] && (
              <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.span>
            )}
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="form-input"
              placeholder="Your Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={resumeData.jobTitle}
              onChange={(e) => updateResumeData('jobTitle', e.target.value)}
              className="form-input"
              placeholder="Your Job Title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="form-input"
              placeholder="Your Email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="form-input"
              placeholder="Your Phone Number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="form-input"
              placeholder="Your Location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="form-input"
              placeholder="linkedin.com/in/xyz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub / Portfolio
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.github}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="form-input"
              placeholder="github.com/xyz or portfolio.com"
            />
          </div>
        </div>
      </motion.div>

      {/* Professional Summary */}
      <motion.div id="summary" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span {...iconMotion}>
              <Target className="w-5 h-5 text-cyan-500" />
            </motion.span>
            <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Professional Summary
              {sectionComplete['summary'] && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.span>
              )}
            </motion.h2>
          </div>
          <motion.button
            {...buttonMotion}
            onClick={() => onGenerateSection('summary')}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: '#B8860B' }} />
            )}
            <span>AI Generate</span>
          </motion.button>
        </div>
        {isGenerating ? (
          <Skeleton className="h-32 w-full mb-2" />
        ) : (
          <textarea
            value={resumeData.summary}
            onChange={(e) => updateResumeData('summary', e.target.value)}
            className="form-input h-32 resize-none"
            placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
          />
        )}
      </motion.div>

      {/* Work Experience */}
      <motion.div id="experience" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span {...iconMotion}>
              <Briefcase className="w-5 h-5 text-cyan-500" />
            </motion.span>
            <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Work Experience
              {sectionComplete['experience'] && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.span>
              )}
            </motion.h2>
          </div>
          <motion.button
            {...buttonMotion}
            onClick={addExperience}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Experience #{index + 1}
                </h3>
                {resumeData.experience.length > 1 && (
                  <motion.button
                    {...buttonMotion}
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="form-input"
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="form-input"
                    placeholder="Job Title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="form-input"
                    placeholder="Present"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="form-input h-24 resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div id="education" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span {...iconMotion}>
              <GraduationCap className="w-5 h-5 text-cyan-500" />
            </motion.span>
            <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Education
              {sectionComplete['education'] && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.span>
              )}
            </motion.h2>
          </div>
          <motion.button
            {...buttonMotion}
            onClick={addEducation}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Education #{index + 1}
                </h3>
                {resumeData.education.length > 1 && (
                  <motion.button
                    {...buttonMotion}
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="form-input"
                    placeholder="University Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="form-input"
                    placeholder="Bachelor's"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    className="form-input"
                    placeholder="Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GPA
                  </label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="form-input"
                    placeholder="3.8/4.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div id="skills" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span {...iconMotion}>
              <Target className="w-5 h-5 text-cyan-500" />
            </motion.span>
            <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Skills
              {sectionComplete['skills'] && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.span>
              )}
            </motion.h2>
          </div>
          <motion.button
            {...buttonMotion}
            onClick={() => onGenerateSection('skills')}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: '#B8860B' }} />
            )}
            <span>AI Generate</span>
          </motion.button>
        </div>
        {isGenerating ? (
          <Skeleton className="h-10 w-full mb-2" />
        ) : (
          <input
            type="text"
            value={resumeData.skills.join(', ')}
            onChange={(e) => updateSkills(e.target.value)}
            className="form-input"
            placeholder="JavaScript, React, Node.js, Python, SQL (comma-separated)"
          />
        )}
      </motion.div>

      {/* Achievements */}
      <motion.div id="achievements" className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span {...iconMotion}>
              <Award className="w-5 h-5 text-cyan-500" />
            </motion.span>
            <motion.h2 {...headerMotion} className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Achievements
              {sectionComplete['achievements'] && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.span>
              )}
            </motion.h2>
          </div>
          <motion.button
            {...buttonMotion}
            onClick={() => onGenerateSection('achievements')}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: '#B8860B' }} />
            )}
            <span>AI Generate</span>
          </motion.button>
        </div>
        {isGenerating ? (
          <Skeleton className="h-32 w-full mb-2" />
        ) : (
          <textarea
            value={resumeData.achievements.join('\n')}
            onChange={(e) => updateAchievements(e.target.value)}
            className="form-input h-32 resize-none"
            placeholder="List your key achievements, awards, and certifications (one per line)..."
          />
        )}
      </motion.div>

      {/* Custom Sections */}
      <div className="rounded-2xl border border-cyan-700 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-500" />
            Custom Sections
          </h2>
          <motion.button
            {...buttonMotion}
            onClick={addCustomSection}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Add Section
          </motion.button>
        </div>
        <div className="space-y-4">
          {resumeData.customSections && resumeData.customSections.map((sec, idx) => (
            <motion.div
              key={sec.id}
              className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 flex flex-col gap-2 shadow-md hover:shadow-xl transition-shadow relative"
              whileHover={{ scale: 1.01, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={sec.title}
                  onChange={e => updateCustomSection(sec.id, 'title', e.target.value)}
                  className="form-input flex-1 text-lg font-semibold bg-zinc-800 border-zinc-700 text-cyan-200 placeholder:text-zinc-400"
                  placeholder={`Section Title (e.g., Volunteer Work, Languages)`}
                />
                <motion.button
                  {...buttonMotion}
                  onClick={() => removeCustomSection(sec.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove section"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
              <textarea
                value={sec.content}
                onChange={e => updateCustomSection(sec.id, 'content', e.target.value)}
                className="form-input h-20 resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                placeholder="Section content (e.g., list your languages, volunteer work, etc.)"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResumeForm 