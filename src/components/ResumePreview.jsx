import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react'
import { motion } from 'framer-motion'

const previewVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const ResumePreview = React.forwardRef(({ resumeData }, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <motion.div
      ref={ref}
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8"
      initial="hidden"
      animate="visible"
      variants={previewVariants}
    >
      {/* Profile Photo removed */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white no-pdf">Resume Preview</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 no-pdf">Live Preview</div>
      </div>
      
      {/* Resume Content */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 rounded-lg p-8 max-w-4xl w-full mx-auto shadow-sm overflow-x-auto break-words whitespace-pre-line">
        {/* Header */}
        <div className="border-b border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {resumeData.personalInfo.name || 'Your Name'}
          </h1>
          <p className="text-xl text-blue-600 font-medium mb-4 dark:text-blue-400">
            {resumeData.jobTitle || 'Professional Title'}
          </p>
          
          {/* Contact Information */}
          <div className="space-y-2 mb-2">
            <div className="flex flex-wrap md:flex-nowrap items-center gap-6 text-sm text-gray-600">
              {resumeData.personalInfo.email && (
                <div className="flex items-center space-x-2 min-w-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate font-medium">{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center space-x-2 min-w-0">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{resumeData.personalInfo.phone}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-6 text-sm text-gray-600">
              {resumeData.personalInfo.location && (
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo.linkedin && (
                <div className="flex items-center space-x-2 min-w-0">
                  <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{resumeData.personalInfo.linkedin}</span>
                </div>
              )}
              {resumeData.personalInfo.website && (
                <div className="flex items-center space-x-2 min-w-0">
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{resumeData.personalInfo.website}</span>
                </div>
              )}
              {resumeData.personalInfo.github && (
                <div className="flex items-center space-x-2 min-w-0">
                  <Github className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{resumeData.personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 dark:text-white">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-200">
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.experience.length > 0 && resumeData.experience[0].company && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1 dark:text-white">
              Work Experience
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                exp.company && (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-200">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium mb-2 dark:text-blue-400">{exp.company}</p>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-200">
                        {exp.description}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && resumeData.education[0].institution && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1 dark:text-white">
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                edu.institution && (
                  <div key={edu.id} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-200">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-primary-600 font-medium mb-1">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-gray-700 text-sm dark:text-gray-200">GPA: {edu.gpa}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 dark:text-white">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium dark:bg-zinc-700 dark:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {resumeData.achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 dark:text-white">
              Achievements & Awards
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-700 text-sm dark:text-gray-200">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Sections */}
        {resumeData.customSections && resumeData.customSections.map(sec => (
          <div key={sec.id} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 dark:text-white">
              {sec.title}
            </h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-200 whitespace-pre-line">
              {sec.content}
            </p>
          </div>
        ))}

        {/* Empty State */}
        {!resumeData.personalInfo.name && 
         !resumeData.jobTitle && 
         !resumeData.summary && 
         resumeData.experience.length === 0 && 
         resumeData.education.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium mb-2">Your Resume Preview</h3>
            <p className="text-sm">Start filling out the form on the left to see your resume here</p>
          </div>
        )}
      </div>
    </motion.div>
  )
  })
  
  ResumePreview.displayName = 'ResumePreview'
  
  export default ResumePreview 