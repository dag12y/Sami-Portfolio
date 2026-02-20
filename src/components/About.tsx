import {
  AudioLines,
  Blend,
  Captions,
  Clapperboard,
  Crop,
  Gauge,
  KeyRound,
  Palette,
  Sparkles,
  Wand2,
} from 'lucide-react';

function About() {
  const skills = [
    { name: 'Video cutting, trimming, and sequencing', icon: Crop },
    { name: 'Motion graphics and visual effects (VFX)', icon: Sparkles },
    { name: 'Color correction and cinematic color grading', icon: Palette },
    { name: 'Audio editing and sound balancing', icon: AudioLines },
    { name: 'Keyframing and smooth animation', icon: KeyRound },
    { name: 'Transitions, filters, and text effects', icon: Wand2 },
    { name: 'Video stabilization and correction', icon: Gauge },
    { name: 'Subtitles and captions', icon: Captions },
    { name: 'Storytelling and pacing for engaging visuals', icon: Clapperboard },
    { name: 'Creative visual design and aesthetic composition', icon: Blend },
  ];

  return (
    <section id="about" className="py-24 bg-beige dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-dark dark:text-slate-100 mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-sage mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-text-dark/80 dark:text-slate-300 leading-relaxed mb-16 text-center animate-fade-in-up">
            I&apos;m the person who sees raw footage and thinks, &ldquo;Let&apos;s make this tell a
            story people can&apos;t look away from.&rdquo; I&apos;m a professional video editor with one year
            of experience, specializing in short-form promotional, tutorial, and self-improvement
            content. I bring ideas to life through high-quality, engaging edits that capture
            attention instantly and communicate messages clearly. I also craft long-form videos
            with smooth pacing and compelling storytelling. With a strong understanding of social
            media trends and audience behavior, I shape every project to connect, engage, and
            leave a lasting impression.
          </p>

          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-display font-bold text-text-dark dark:text-slate-100 mb-8">My Skills</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in-up cursor-default border border-transparent dark:border-slate-700"
                  style={{ animationDelay: `${0.05 * (index + 2)}s` }}
                >
                  <Icon className="w-8 h-8 text-taupe mx-auto mb-3 group-hover:text-sage transition-colors duration-300" />
                  <h3 className="text-text-dark dark:text-slate-100 font-semibold text-sm">{skill.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
