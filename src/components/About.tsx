import { Video, Palette } from 'lucide-react';

function About() {
  const skills = [
    { name: 'CapCut', icon: Video },
    { name: 'DaVinci Resolve', icon: Palette },
  ];

  return (
    <section id="about" className="py-24 bg-beige">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-dark mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-sage mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-text-dark/80 leading-relaxed mb-16 text-center animate-fade-in-up">
            I am a professional video editor with one year of experience, specializing in short-form promotional, tutorial, and self-improvement content. I create engaging, high-quality edits that capture attention quickly and communicate messages clearly. I also have experience with long-form videos, maintaining strong pacing and storytelling. In addition, I have foundational knowledge of social media marketing, which helps me edit with platform trends, audience behavior, and engagement in mind. My goal is to deliver polished, reliable videos that keep clients satisfied and support long-term brand growth.
          </p>

          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-display font-bold text-text-dark mb-8">My Tools</h3>
          </div>
          <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="group bg-white rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in-up cursor-default"
                  style={{ animationDelay: `${0.05 * (index + 2)}s` }}
                >
                  <Icon className="w-8 h-8 text-taupe mx-auto mb-3 group-hover:text-sage transition-colors duration-300" />
                  <h3 className="text-text-dark font-semibold text-sm">{skill.name}</h3>
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

