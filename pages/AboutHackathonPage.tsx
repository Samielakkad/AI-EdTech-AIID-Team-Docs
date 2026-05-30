

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, AcademicCapIcon } from '../components/IconComponents';

const AwardCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        const rotateX = (y - height / 2) / 25;
        const rotateY = -(x - width / 2) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out' }}
            className="glass-card interactive-card p-6 rounded-lg text-center h-full"
        >
            <div style={{ transform: 'translateZ(20px)' }}>
                <TrophyIcon className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                <h3 className="text-2xl text-white">{title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
            </div>
        </div>
    );
};

const AboutHackathonPage: React.FC = () => {
  const missionCardRef = useRef<HTMLDivElement>(null);
  const organizer1Ref = useRef<HTMLDivElement>(null);
  const organizer2Ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
      const card = ref.current;
      if (!card) return;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      const rotateX = (y - height / 2) / 25;
      const rotateY = -(x - width / 2) / 25;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement>) => {
      const card = ref.current;
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl sm:text-6xl">About the 2025 AIID Hackathon 🏆</h1>
        <p className="mt-6 max-w-4xl mx-auto text-xl text-gray-600 dark:text-gray-400">
          A launchpad for the next generation of AI innovators. Fostering collaboration, creativity, and the ethical application of artificial intelligence to solve real-world challenges.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-20">
        
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl text-center mb-12">Our Mission</h2>
          <div 
            ref={missionCardRef}
            onMouseMove={(e) => handleMouseMove(e, missionCardRef)}
            onMouseLeave={() => handleMouseLeave(missionCardRef)}
            style={{ transition: 'transform 0.2s ease-out' }}
            className="grid md:grid-cols-2 gap-12 items-center glass-card interactive-card p-8 rounded-lg"
          >
              <div className="order-2 md:order-1" style={{ transform: 'translateZ(20px)' }}>
                 <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    The AIID Hackathon is an annual event designed to bring together the brightest minds in technology, design, and business. Our goal is to create a dynamic environment where participants can explore the cutting edge of generative AI, collaborate in learning circles, and transform innovative ideas into tangible projects within a 72-hour sprint. We aim to not only showcase technical skill but also to emphasize the importance of clear communication, thorough documentation, and the potential for AI to make a positive global impact.
                  </p>
              </div>
              <div className="order-1 md:order-2">
                 <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop" alt="Hackathon event in progress" className="rounded-lg shadow-xl w-full h-full object-cover" style={{ transform: 'translateZ(40px)' }}/>
              </div>
          </div>
        </motion.section>

        <section>
          <h2 className="text-4xl text-center mb-8">Organizers & Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
             <div 
                ref={organizer1Ref}
                onMouseMove={(e) => handleMouseMove(e, organizer1Ref)}
                onMouseLeave={() => handleMouseLeave(organizer1Ref)}
                style={{ transition: 'transform 0.2s ease-out' }}
                className="glass-card interactive-card p-8 rounded-lg"
              >
                <div style={{ transform: 'translateZ(20px)' }}>
                  <AcademicCapIcon className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
                  <h3 className="text-2xl text-white">Tsinghua SIGS AIID</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">The host and academic force behind the event, providing mentorship and educational resources.</p>
                </div>
             </div>
             <div 
                ref={organizer2Ref}
                onMouseMove={(e) => handleMouseMove(e, organizer2Ref)}
                onMouseLeave={() => handleMouseLeave(organizer2Ref)}
                style={{ transition: 'transform 0.2s ease-out' }}
                className="glass-card interactive-card p-8 rounded-lg"
              >
                <div style={{ transform: 'translateZ(20px)' }}>
                   <AcademicCapIcon className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
                  <h3 className="text-2xl text-white">NetDragon Company</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">A key industry partner, offering technical support, API access, and real-world expertise.</p>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-4xl text-center mb-8">Award Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AwardCard 
              title="Best Documentation & Tutorial"
              description="Awarded to the team with the most comprehensive, clear, and inspiring documentation website that effectively teaches others how to replicate their success."
            />
            <AwardCard 
              title="Best Communication"
              description="Recognizes the team that excels in promoting their project, engaging with a global audience, and effectively communicating their project's vision and impact."
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutHackathonPage;