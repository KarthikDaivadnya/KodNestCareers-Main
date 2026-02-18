export const SAMPLE_RESUME = {
  name: 'Karthik Daivadnya',
  email: 'karthik@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  summary:
    'Full-stack engineer with 3+ years building scalable web applications. Passionate about clean architecture, AI-assisted tooling, and shipping products that users love. Experienced with React, Node.js, and cloud infrastructure.',
  education: [
    { id: 'edu-1', institution: 'PES University', degree: 'B.Tech', field: 'Computer Science & Engineering', from: '2018', to: '2022' },
  ],
  experience: [
    {
      id: 'exp-1', company: 'Infosys', role: 'Software Engineer', from: 'Jul 2022', to: 'Present',
      bullets: [
        'Architected and shipped a React dashboard used by 50,000+ enterprise users, reducing load time by 40%.',
        'Built RESTful APIs with Node.js and PostgreSQL, handling 2M+ requests/day.',
        'Led migration from class components to React hooks, cutting bundle size by 25%.',
      ],
    },
    {
      id: 'exp-2', company: 'KodNest', role: 'Teaching Assistant', from: 'Jan 2022', to: 'Jun 2022',
      bullets: [
        'Mentored 200+ students in DSA, Java, and full-stack web development.',
        'Designed coding assessments and reviewed 500+ project submissions.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1', name: 'AI Resume Builder',
      description: 'A Lovable + GPT-4o powered tool that auto-tailors resumes to job descriptions and shows real-time ATS score.',
      techStack: ['React', 'Tailwind', 'GPT-4o', 'Vite'],
      link: 'https://github.com/karthikdaivadnya/ai-resume-builder',
      liveUrl: 'https://ai-resume-builder.vercel.app',
    },
    {
      id: 'proj-2', name: 'Placement Readiness Platform',
      description: 'KodNest internal tool for JD analysis, skill extraction, and 7-day interview prep planning.',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      link: 'https://github.com/karthikdaivadnya/prp',
      liveUrl: '',
    },
  ],
  skillGroups: {
    technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'REST APIs'],
    soft: ['Team Leadership', 'Problem Solving', 'Mentoring'],
    tools: ['Git', 'Docker', 'AWS', 'Vite', 'Figma'],
  },
  github: 'https://github.com/karthikdaivadnya',
  linkedin: 'https://linkedin.com/in/karthikdaivadnya',
}
