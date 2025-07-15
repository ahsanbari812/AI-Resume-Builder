import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Briefcase, GraduationCap, Award, Layers, Github, Linkedin, Mail, Download, Eye, MapPin } from 'lucide-react';
import { useRef } from 'react';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.15, duration: 0.6 } })
};

// Floating Particles Component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate initial particles with more subtle movement
    const initialParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.2, // Much slower movement
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.1, // More subtle opacity
      directionChange: Math.random() * 0.02 + 0.01 // Random direction changes
    }));
    setParticles(initialParticles);

    // Smooth animation loop with requestAnimationFrame
    let animationId;
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;

        // Gentle bounce off edges with slight randomness
        if (newX <= 0 || newX >= window.innerWidth) {
          particle.speedX = -particle.speedX * (0.8 + Math.random() * 0.4);
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          particle.speedY = -particle.speedY * (0.8 + Math.random() * 0.4);
        }

        // Subtle random direction changes
        particle.speedX += (Math.random() - 0.5) * particle.directionChange;
        particle.speedY += (Math.random() - 0.5) * particle.directionChange;

        // Keep speeds within reasonable bounds
        particle.speedX = Math.max(-0.3, Math.min(0.3, particle.speedX));
        particle.speedY = Math.max(-0.3, Math.min(0.3, particle.speedY));

        return {
          ...particle,
          x: newX,
          y: newY
        };
      }));
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const features = [
  {
    icon: <User className="w-7 h-7 text-cyan-500" />,
    title: 'Personalized',
    desc: 'Tailor your resume with custom sections and personal branding.'
  },
  {
    icon: <Briefcase className="w-7 h-7 text-cyan-500" />,
    title: 'Professional',
    desc: 'Showcase your experience and skills with a modern, clean design.'
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-cyan-500" />,
    title: 'Academic',
    desc: 'Highlight your education, achievements, and certifications.'
  },
  {
    icon: <Award className="w-7 h-7 text-cyan-500" />,
    title: 'Achievements',
    desc: 'Stand out with awards, honors, and recognitions.'
  },
  {
    icon: <Layers className="w-7 h-7 text-cyan-500" />,
    title: 'Custom Sections',
    desc: 'Add languages, volunteer work, or anything you want!'
  },
  {
    icon: <Mail className="w-7 h-7 text-cyan-500" />,
    title: 'AI Cover Letter',
    desc: 'Instantly generate a personalized cover letter tailored to your resume.'
  },
];

const Typewriter = ({ text, highlightClass, interval = 18 }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, index + 1));
        setIndex(index + 1);
      }, interval);
      return () => clearTimeout(timeout);
    }
  }, [index, text, interval]);

  // Split for highlight
  const highlightStart = text.indexOf('Dream Resume');
  const highlightEnd = highlightStart + 'Dream Resume'.length;
  return (
    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-50 mb-3 sm:mb-4 leading-tight min-h-[2.5rem] sm:min-h-[3.5rem]">
      {displayed.slice(0, highlightStart)}
      <span className={highlightClass}>
        {displayed.slice(highlightStart, Math.min(highlightEnd, displayed.length))}
      </span>
      {displayed.slice(Math.min(highlightEnd, displayed.length))}
    </h1>
  );
}

// Animated, sleek resume preview for hero section
function ResumeHeroPreview() {
  // Shimmer animation for badge
  const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.45) 50%, rgba(34,211,238,0.15) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, boxShadow: '0 0 0 0 #22d3ee' }}
      animate={{ opacity: 1, scale: 1, boxShadow: '0 0 32px 4px #22d3ee55' }}
      whileHover={{ scale: 1.04, boxShadow: '0 0 48px 8px #22d3ee88' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.35 }}
      className="w-[320px] md:w-[350px] bg-white/90 dark:bg-zinc-900/90 rounded-2xl border-4 border-transparent p-0 flex flex-col gap-3 relative overflow-hidden cursor-pointer"
      style={{ minHeight: 340, boxShadow: '0 8px 40px 0 rgba(6,182,212,0.18)' }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-0" style={{
        background: 'linear-gradient(120deg, #22d3ee 0%, #818cf8 50%, #06b6d4 100%)',
        opacity: 0.18,
        filter: 'blur(8px)',
      }} />
      <div className="relative z-10 p-6 flex flex-col gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-2">
          <div className="text-xl font-bold text-gray-900 dark:text-white">Ahsan</div>
          <div className="text-cyan-600 dark:text-cyan-300 text-sm font-medium">Frontend Developer</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="text-gray-700 dark:text-gray-200 text-xs mb-2">
          <div>Ahsan@gmail.com</div>
          <div>Karachi, Pakistan</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-2">
          <div className="font-semibold text-gray-800 dark:text-cyan-200 text-sm mb-1">Experience</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Frontend Developer at TechCorp</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">2024 - Present</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }} className="mb-2">
          <div className="font-semibold text-gray-800 dark:text-cyan-200 text-sm mb-1">Education</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">B.Sc. Computer Science</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">FAST University</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-2">
          <div className="font-semibold text-gray-800 dark:text-cyan-200 text-sm mb-1">Skills</div>
          <div className="flex flex-wrap gap-1">
            <span className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 rounded-full px-2 py-0.5 text-xs font-medium">React</span>
            <span className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 rounded-full px-2 py-0.5 text-xs font-medium">JavaScript</span>
            <span className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 rounded-full px-2 py-0.5 text-xs font-medium">UI/UX</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute right-3 top-3">
          <span className="inline-block bg-cyan-400/20 text-cyan-700 dark:text-cyan-200 text-[10px] px-2 py-0.5 rounded-full font-semibold" style={shimmerStyle}>Live Preview</span>
        </motion.div>
      </div>
      {/* Shimmer keyframes */}
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </motion.div>
  );
}

const LandingPage = ({ onGetStarted }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-700 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-700 relative overflow-hidden">
    <FloatingParticles />
    <div className="max-w-5xl w-full mx-auto flex flex-col-reverse md:flex-row items-stretch justify-center gap-4 sm:gap-8 mb-8 sm:mb-14">
      {/* Left: Hero Text */}
      <motion.div
        className="flex-1 flex flex-col justify-center text-left items-start md:pr-8"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-100/80 dark:bg-cyan-900/40 rounded-full mb-3 sm:mb-5 shadow"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Sparkles className="w-5 h-5 animate-pulse" style={{ color: '#B8860B' }} />
          <span className="font-semibold text-cyan-700 dark:text-cyan-200 text-sm sm:text-base">AI-Powered Resume Builder</span>
        </motion.div>
        {/* Heading with smooth typing animation */}
        <Typewriter
          text="Craft Your Dream Resume Effortlessly"
          highlightClass="text-cyan-400"
          interval={45}
        />
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 text-left">
          Build a stunning, professional resume in minutes. Leverage AI to generate summaries, skills, and more—no design skills needed!
        </p>
        <motion.button
          whileHover={{ scale: 1.07, boxShadow: '0 6px 24px rgba(6,182,212,0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onGetStarted}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold text-base sm:text-lg shadow-lg hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 focus:outline-none transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" style={{ color: '#B8860B' }} />
          Get Started
        </motion.button>
      </motion.div>
      {/* Right: Responsive Animated Resume Preview */}
      <div className="flex-1 flex items-center justify-center py-4 sm:py-6 md:py-0">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[350px]">
          <ResumeHeroPreview />
        </div>
      </div>
    </div>
    {/* Feature Cards Below */}
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 items-stretch">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          className="bg-gray-900/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-5 sm:p-7 flex flex-col items-center text-center border border-cyan-700/30 dark:border-cyan-800/40 transition-all hover:scale-105 hover:shadow-2xl"
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={featureVariants}
        >
          <div className="mb-2 sm:mb-3">{f.icon}</div>
          <h3 className="text-base sm:text-lg font-semibold text-cyan-300 mb-1">{f.title}</h3>
          <p className="text-gray-300 text-xs sm:text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </div>
    <footer className="w-full text-xs sm:text-sm border-t border-cyan-700/30 dark:border-cyan-800/40 bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-md mt-6 sm:mt-8 text-gray-400 dark:text-zinc-500 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row items-center md:items-stretch w-full px-2 sm:px-4">
        <div className="flex-1 flex justify-center items-center text-xs sm:text-base font-light order-1 md:order-none w-full">
          <span>made with</span>
          <span role='img' aria-label='white heart' className='text-white animate-pulse text-lg mx-2' style={{ display: 'inline-block', verticalAlign: 'middle' }}>🤍</span>
          <span>by <span className='font-semibold text-cyan-300'>ahsan</span></span>
        </div>
        <div className="flex items-center gap-3 justify-end w-full md:w-auto order-2 md:order-none mt-3 sm:mt-4 md:mt-0">
          <a href="https://github.com/ahsanbari812" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <Github className="w-5 h-5 md:w-4 md:h-4 text-cyan-500" />
          </a>
          <a href="https://linkedin.com/in/ahsanbari812" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <Linkedin className="w-5 h-5 md:w-4 md:h-4 text-cyan-500" />
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage; 