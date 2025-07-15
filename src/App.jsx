import React, { useState, useRef, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Moon, Sun, Download, Sparkles, Loader2, X } from 'lucide-react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './components/ResumePDF';
import { pdf } from '@react-pdf/renderer';
import { 
  generateProfessionalSummary, 
  generateAchievements, 
  generateSkillsRecommendations,
  generateEntireResume,
  getApiKeyStatus,
  generateCoverLetter
} from './utils/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AISuggestionsModal from './components/AISuggestionsModal';

const sectionLinks = [
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
];

function DelayedPDFDownload({ resumeData }) {
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setShowLink(false);
    setTimeout(() => {
      setShowLink(true);
      setLoading(false);
    }, 3000); // 3 seconds
  };

  return (
    <>
      {!showLink ? (
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{loading ? 'Preparing PDF...' : 'Download PDF'}</span>
        </motion.button>
      ) : (
        <PDFDownloadLink
          document={<ResumePDF resumeData={resumeData} />}
          fileName={`${resumeData.personalInfo.name || 'resume'}.pdf`}
          className="btn-secondary flex items-center space-x-2"
        >
          {({ loading }) => (
            <>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{loading ? 'Preparing PDF...' : 'Download PDF'}</span>
            </>
          )}
        </PDFDownloadLink>
      )}
    </>
  );
}

function App() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiStatus, setAiStatus] = useState(getApiKeyStatus())
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: ''
    },
    jobTitle: '',
    summary: '',
    experience: [
      {
        id: 1,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ],
    skills: [],
    achievements: [],
    customSections: [] // array of { id, title, content }
  })
  const [activeSection, setActiveSection] = useState('personal-info');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState('');
  const [modalSuggestions, setModalSuggestions] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        setResumeData(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
  }, []);
  // Auto-save to localStorage on change
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    const handleScroll = () => {
      let found = 'personal-info';
      for (const link of sectionLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = link.id;
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show sidebar when mouse is at left edge (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 1024) {
        if (e.clientX <= 24) {
          setShowSidebar(true);
        } else if (showSidebar && e.clientX > 200) {
          setShowSidebar(false);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showSidebar]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  // Enhanced: handle AI suggestions modal for sections with context prompt
  const handleGenerateSection = async (section) => {
    if (!aiStatus.configured) {
      toast.error('Please configure your Gemini API key first!');
      return;
    }
    // Require job title for AI suggestions
    if (!resumeData.jobTitle || resumeData.jobTitle.trim() === '') {
      toast.error('Please enter your Job Title to generate AI suggestions!');
      // Try to scroll to the job title input
      const jobTitleInput = document.querySelector('input[placeholder="Your Job Title"]');
      if (jobTitleInput) {
        jobTitleInput.focus();
        jobTitleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setModalOpen(true);
    setModalSection(section);
    setModalSuggestions([]);
    setModalLoading(true);
    setPendingSection(section);
    try {
      let suggestions = [];
      if (section === 'summary') {
        suggestions = await generateProfessionalSummary(resumeData, 3);
      } else if (section === 'achievements') {
        suggestions = await generateAchievements(resumeData.experience, 3);
      } else if (section === 'skills') {
        suggestions = await generateSkillsRecommendations(resumeData.jobTitle, resumeData.skills, resumeData.industry || '', 3);
        suggestions = suggestions.map(arr => arr.join(', '));
      }
      setModalSuggestions(suggestions);
    } catch (error) {
      toast.error(`AI generation failed: ${error.message}`);
      setModalSuggestions([]);
    } finally {
      setModalLoading(false);
    }
  };

  // When user submits context modal
  const handleContextSubmit = (context) => {
    setResumeData(prev => ({
      ...prev,
      industry: context.industry || '',
      dreamJob: context.dreamJob || ''
    }));
    setModalOpen(false);
    // After saving context, immediately trigger the AI suggestions modal for the pending section (if any)
    if (pendingSection) {
      setTimeout(() => handleGenerateSection(pendingSection), 0);
    }
  };

  // When user selects a suggestion from modal
  const handleSelectSuggestion = (suggestion) => {
    if (pendingSection === 'summary') {
      setResumeData(prev => ({ ...prev, summary: suggestion }));
    } else if (pendingSection === 'achievements') {
      setResumeData(prev => ({ ...prev, achievements: suggestion.split('\n').filter(item => item.trim()) }));
    } else if (pendingSection === 'skills') {
      setResumeData(prev => ({ ...prev, skills: suggestion.split(',').map(skill => skill.trim()) }));
    }
    setModalOpen(false);
    setModalSuggestions([]);
    setPendingSection(null);
  };

  // Helper to check if all required fields are filled
  const isResumeComplete = () => {
    const { personalInfo, jobTitle, summary, experience, education, skills, achievements } = resumeData;
    return (
      personalInfo.name && personalInfo.email && personalInfo.phone &&
      jobTitle && summary &&
      experience.length > 0 && experience[0].company && experience[0].position && experience[0].description &&
      education.length > 0 && education[0].institution && education[0].degree && education[0].field &&
      skills.length > 0 && achievements.length > 0
    );
  };

  const handleGenerateCoverLetter = async () => {
    if (!isResumeComplete()) {
      toast.error('Please fill out all resume details before generating a cover letter!');
      return;
    }
    setCoverLetterLoading(true);
    setCoverLetterModalOpen(true);
    setCoverLetterText('');
    try {
      const letter = await generateCoverLetter(resumeData);
      setCoverLetterText(letter);
    } catch (error) {
      toast.error(`Cover letter generation failed: ${error.message}`);
      setCoverLetterText('');
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleManualDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(<ResumePDF resumeData={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.name || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to generate PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!showBuilder) {
    return (
      <AnimatePresence>
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LandingPage onGetStarted={() => setShowBuilder(true)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      {modalOpen && (
        <AISuggestionsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          suggestions={modalSuggestions}
          onSelect={handleSelectSuggestion}
          loading={modalLoading}
          section={modalSection}
        />
      )}
      {/* Cover Letter Modal */}
      {coverLetterModalOpen && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCoverLetterModalOpen(false)}
          >
            <motion.div
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-xl w-full mx-4 p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-cyan-100/30 dark:scrollbar-track-zinc-800/40"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={() => setCoverLetterModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-cyan-600 mb-2 text-center">AI-Generated Cover Letter</h2>
              {coverLetterLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-2" />
                  <span className="text-gray-500 dark:text-gray-300">Generating cover letter...</span>
                </div>
              ) : (
                <>
                  <textarea
                    className="w-full min-h-[220px] rounded-lg border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-vertical mb-2"
                    value={coverLetterText}
                    onChange={e => setCoverLetterText(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      className="px-4 py-1 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                      onClick={() => {
                        navigator.clipboard.writeText(coverLetterText);
                        toast.success('Cover letter copied!');
                      }}
                      disabled={!coverLetterText}
                    >
                      Copy
                    </button>
                    <button
                      className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                      onClick={() => setCoverLetterModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="min-h-screen font-inter bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-700 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-700 overflow-x-hidden"> {/* Cohesive with landing page */}
        {/* Sticky Sidebar Navigation (shows only when mouse at left edge) */}
        <AnimatePresence>
          {showSidebar && (
            <motion.nav
              key="sidebar"
              initial={{ x: -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -220, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="hidden lg:block fixed top-24 left-0 h-[80vh] z-30"
            >
              <ul className="flex flex-col gap-2 ml-4 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow p-4">
                {sectionLinks.map(link => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeSection === link.id
                          ? 'bg-cyan-600 text-white dark:bg-cyan-500' 
                          : 'text-gray-200 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
        {/* Top nav for mobile */}
        <nav className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 border-b border-cyan-700/30 dark:border-cyan-800/40">
          <ul className="flex flex-row gap-1 justify-between px-2 py-1 overflow-x-auto">
            {sectionLinks.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    activeSection === link.id
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500' 
                      : 'text-gray-200 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-zinc-700'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 shadow-lg border-b border-cyan-700/30 dark:border-cyan-800/40">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-2 sm:py-0 gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {showBuilder && (
                  <motion.button
                    whileHover={{ scale: 1.08, boxShadow: '0 4px 16px rgba(6,182,212,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowBuilder(false)}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all mr-1 sm:mr-2 text-sm sm:text-base"
                    style={{ fontSize: '1rem' }}
                  >
                    Home
                  </motion.button>
                )}
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-400 shadow-md">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </span>
                <div className="relative">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-100 dark:text-white tracking-tight">
                    AI Resume Builder
                  </h1>
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-2 sm:gap-4 justify-end mt-2 sm:mt-0">
                {/* AI Status Indicator */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-center sm:text-left ${
                  aiStatus.configured 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {aiStatus.configured ? 'AI Ready' : 'AI Not Configured'}
                </div>
                {/* Download PDF Button (direct PDFDownloadLink) */}
                <div className="inline-block w-full sm:w-auto">
                  <button
                    onClick={handleManualDownload}
                    className={
                      `flex w-full sm:w-auto items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-800 text-white font-medium rounded-lg ` +
                      `hover:bg-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200` +
                      (isDownloading ? ' opacity-50 cursor-not-allowed' : '')
                    }
                    disabled={isDownloading}
                    style={{ cursor: isDownloading ? 'not-allowed' : 'pointer' }}
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="text-sm sm:text-base">{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
                  </button>
                </div>
                {/* Generate Cover Letter Button */}
                <button
                  className={`w-full sm:w-auto ml-0 sm:ml-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs sm:text-sm font-semibold shadow hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all ${!isResumeComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleGenerateCoverLetter}
                  disabled={!isResumeComplete()}
                >
                  Generate Cover Letter
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Panel - Form */}
            <div className="space-y-6">
              <ResumeForm 
                resumeData={resumeData} 
                updateResumeData={updateResumeData}
                onGenerateSection={handleGenerateSection}
                isGenerating={isGenerating}
              />
            </div>
            
            {/* Right Panel - Preview */}
            <div className="space-y-6 overflow-x-auto pb-2" style={{ minWidth: 0 }}>
              <div className="min-w-[320px] max-w-full">
                <ResumePreview 
                  resumeData={resumeData} 
                />
              </div>
            </div>
          </div>
        </main>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      </div>
    </>
  )
}

export default App 