import type { Admin, ClubStats, Event, Registration } from './models'

export const CLUB_NAME = 'Nova Tech & Cultural Club'
export const CLUB_SHORT = 'Nova Club'

export const DEFAULT_ADMIN: Admin = {
  id: 'admin-1',
  email: 'admin@novaclub.edu',
  password: 'admin123',
}

export const CLUB_STATS: ClubStats = {
  totalEvents: 25,
  totalStudents: 500,
  workshops: 15,
  partners: 10,
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70'

/** Curated Unsplash banners (full photo IDs — truncated IDs fail to load). */
const IMAGES = {
  techfest:
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70',
  codesprint:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
  designday:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70',
  campusconnect:
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70',
  hacknova:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=70',
  aiml: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=70',
  culturalnight:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=70',
  sportsmeet:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=70',
  webdev: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=70',
  fireside:
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=70',
  esports:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=70',
} as const

const seedEvents: Event[] = [
  {
    id: 'evt-techfest-2026',
    title: 'TechFest 2026',
    description:
      'Our flagship annual technology festival returns bigger than ever. Spend a day immersed in emerging tech — live demos from student startups, an AI/ML showcase, robotics arenas, lightning talks by industry engineers, and a closing panel on careers in technology. Whether you are shipping your first project or your fiftieth, TechFest is where the campus tech community comes together. Lunch, swag and certificates included for all registered attendees.',
    category: 'Technology',
    date: '2026-10-12',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Main Auditorium',
    image: IMAGES.techfest,
    organizer: 'Nova Tech Team',
    registrationDeadline: '2026-10-08',
    maxParticipants: 500,
    status: 'Published',
    featured: true,
    rules: [
      'Carry your college ID for entry verification.',
      'Registration closes on October 8 or when seats fill.',
      'Laptops are optional; demo stations are provided.',
      'Be seated 10 minutes before the keynote.',
    ],
    createdAt: '2026-08-02T10:00:00.000Z',
  },
  {
    id: 'evt-codesprint',
    title: 'CodeSprint',
    description:
      'A high-energy 9-hour competitive programming sprint. Solve escalating algorithmic challenges in teams of two, climb the live leaderboard, and win prizes worth ₹30,000. Problems span data structures, dynamic programming, graphs and a mystery final round. Beginners are welcome — a warm-up track runs alongside the main contest with mentors available throughout the day.',
    category: 'Coding',
    date: '2026-10-18',
    startTime: '09:00',
    endTime: '18:00',
    venue: 'Computer Lab 2',
    image: IMAGES.codesprint,
    organizer: 'Nova Coding Wing',
    registrationDeadline: '2026-10-15',
    maxParticipants: 120,
    status: 'Published',
    rules: [
      'Teams of two; solo participants will be paired on-site.',
      'Any language supported by the judge is allowed.',
      'Internet restricted to documentation sites.',
      'Bring your own charger and peripherals if you prefer.',
    ],
    createdAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'evt-design-day',
    title: 'Design Day',
    description:
      'A full day dedicated to product design. Learn design systems, typography and UI motion in hands-on sessions, then put it into practice in a guided design sprint where teams take a brief from wireframe to polished prototype. Mentors from the design industry review every prototype at the end of the day, and the strongest teams get featured in the club showcase.',
    category: 'Design',
    date: '2026-10-24',
    startTime: '10:00',
    endTime: '17:00',
    venue: 'Design Studio, Block C',
    image: IMAGES.designday,
    organizer: 'Nova Design Collective',
    registrationDeadline: '2026-10-20',
    maxParticipants: 80,
    status: 'Published',
    rules: [
      'Bring a laptop with Figma installed (free plan is fine).',
      'No prior design experience required.',
      'Teams of three are formed during the sprint briefing.',
    ],
    createdAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'evt-campus-connect',
    title: 'Campus Connect',
    description:
      'An evening of structured networking with seniors, alumni and recruiters. Rotating small-group tables, a resume clinic, and an "ask me anything" panel with alumni now working at leading product companies. Come with questions; leave with a wider network and a sharper resume. Light refreshments are on us.',
    category: 'Networking',
    date: '2026-10-30',
    startTime: '17:00',
    endTime: '20:00',
    venue: 'Central Lawn',
    image: IMAGES.campusconnect,
    organizer: 'Nova Community Team',
    registrationDeadline: '2026-10-27',
    maxParticipants: 150,
    status: 'Published',
    rules: [
      'Business casual attire recommended.',
      'Carry printed copies of your resume for the clinic.',
      'The networking rounds start promptly at 5:30 PM.',
    ],
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'evt-hacknova',
    title: 'HackNova 24-Hour Hackathon',
    description:
      'Build something real in 24 hours. HackNova brings together 200 hackers, themed problem statements from our industry partners, unlimited coffee, and a judging panel of engineering leaders. Teams of up to four compete across web, mobile and AI tracks. hardware kits are available on request for IoT projects.',
    category: 'Competition',
    date: '2026-11-07',
    startTime: '09:00',
    endTime: '09:00',
    venue: 'Innovation Hub, Block A',
    image: IMAGES.hacknova,
    organizer: 'Nova Tech Team',
    registrationDeadline: '2026-11-01',
    maxParticipants: 200,
    status: 'Published',
    rules: [
      'Teams of two to four members.',
      'All code must be written during the event.',
      'Sleep pods and meals provided on-site.',
      'Shortlisted teams demo live at 8:00 AM on day two.',
    ],
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'evt-aiml-workshop',
    title: 'AI & ML Bootcamp',
    description:
      'A hands-on, two-session bootcamp that takes you from Python fundamentals to training and deploying your first machine-learning model. Session one covers data wrangling and model basics with scikit-learn; session two goes end-to-end with a real dataset and a deployed demo. Every participant leaves with a working project on GitHub.',
    category: 'Workshop',
    date: '2026-10-20',
    startTime: '14:00',
    endTime: '18:00',
    venue: 'Seminar Hall 3',
    image: IMAGES.aiml,
    organizer: 'Nova Learning Circle',
    registrationDeadline: '2026-10-17',
    maxParticipants: 60,
    status: 'Published',
    rules: [
      'Basic Python knowledge is recommended.',
      'Install Anaconda or use the provided cloud notebooks.',
      'Attendance certificates require both sessions.',
    ],
    createdAt: '2026-08-25T10:00:00.000Z',
  },
  {
    id: 'evt-cultural-night',
    title: 'Nova Cultural Night',
    description:
      'An evening celebrating the creative side of campus — live music bands, dance crews, stand-up comedy, a fashion showcase and an open-mic stage. Student performances are selected by audition, and the night closes with a headline act. Food stalls open from 5 PM. Family and friends are welcome with a valid pass.',
    category: 'Cultural',
    date: '2026-11-14',
    startTime: '17:30',
    endTime: '22:00',
    venue: 'Open Air Theatre',
    image: IMAGES.culturalnight,
    organizer: 'Nova Cultural Wing',
    registrationDeadline: '2026-11-10',
    maxParticipants: 400,
    status: 'Published',
    rules: [
      'Audition sign-ups close two weeks before the event.',
      'Passes are non-transferable.',
      'No outside food or beverages.',
    ],
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'evt-intra-sports',
    title: 'Intra-Club Sports Meet',
    description:
      'A friendly, day-long sports meet for club members — cricket and football sixes, badminton doubles, table tennis and chess blitz. Medals for winning teams, a "best spirit" award, and plenty of reasons to cheer. Register as a team or as a free agent and we will place you.',
    category: 'Sports',
    date: '2026-11-21',
    startTime: '08:30',
    endTime: '17:00',
    venue: 'College Sports Complex',
    image: IMAGES.sportsmeet,
    organizer: 'Nova Sports Committee',
    registrationDeadline: '2026-11-15',
    maxParticipants: 250,
    status: 'Published',
    rules: [
      'Wear appropriate sports shoes; kits provided.',
      'One player may represent a maximum of two disciplines.',
      'Report 20 minutes before your first fixture.',
    ],
    createdAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'evt-web-vibes',
    title: 'Modern Web Development Workshop',
    description:
      'From zero to deployed in one day. Build a full-stack app with React and a serverless backend, learn component thinking, routing and state, and ship it live on the internet before you leave. Perfect for students preparing for hackathon season.',
    category: 'Workshop',
    date: '2026-09-28',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Computer Lab 1',
    image: IMAGES.webdev,
    organizer: 'Nova Learning Circle',
    registrationDeadline: '2026-09-25',
    maxParticipants: 50,
    status: 'Completed',
    rules: [
      'Bring a laptop with Node.js 18+ installed.',
      'A GitHub account is required for deployment.',
    ],
    createdAt: '2026-09-08T10:00:00.000Z',
  },
  {
    id: 'evt-startup-talk',
    title: 'Fireside Chat: Building Startups on Campus',
    description:
      'Two founders who started in this very college share how they went from classroom idea to funded startup. Honest conversation about first customers, failures, cofounder dynamics and what they wish they knew earlier. Q&A ends the session.',
    category: 'Networking',
    date: '2026-09-20',
    startTime: '16:00',
    endTime: '17:30',
    venue: 'Conference Room 2',
    image: IMAGES.fireside,
    organizer: 'Nova Community Team',
    registrationDeadline: '2026-09-18',
    maxParticipants: 90,
    status: 'Completed',
    rules: ['Questions can be submitted in advance during registration.'],
    createdAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'evt-esports-draft',
    title: 'Nova Esports Cup',
    description:
      'The first campus esports cup — Valorant and EA FC tournaments with a spectator lounge, caster desk and prize pool. Registrations are per team of five plus one substitute.',
    category: 'Sports',
    date: '2026-12-05',
    startTime: '11:00',
    endTime: '20:00',
    venue: 'Gaming Arena, Block D',
    image: IMAGES.esports,
    organizer: 'Nova Sports Committee',
    registrationDeadline: '2026-11-28',
    maxParticipants: 160,
    status: 'Draft',
    rules: [
      'Teams of five plus one substitute.',
      'Tournament code of conduct applies.',
    ],
    createdAt: '2026-09-15T10:00:00.000Z',
  },
]

function reg(
  n: number,
  eventId: string,
  name: string,
  email: string,
  college: string,
  year: Registration['year'],
  phone: string,
  status: Registration['status'],
  registeredAt: string,
): Registration {
  return { id: `reg-seed-${n}`, eventId, name, email, college, year, phone, status, registeredAt }
}

const seedRegistrations: Registration[] = [
  reg(1, 'evt-techfest-2026', 'Aarav Sharma', 'aarav.sharma@student.nova.edu', 'Nova Institute of Technology', '2nd Year', '9876543210', 'Registered', '2026-09-10T09:30:00.000Z'),
  reg(2, 'evt-techfest-2026', 'Diya Patel', 'diya.patel@student.nova.edu', 'Nova Institute of Technology', '3rd Year', '9812345678', 'Attended', '2026-09-11T14:05:00.000Z'),
  reg(3, 'evt-codesprint', 'Rohan Mehta', 'rohan.mehta@student.nova.edu', 'Vidya College of Engineering', '4th Year', '9898989898', 'Registered', '2026-09-12T11:20:00.000Z'),
  reg(4, 'evt-codesprint', 'Sneha Iyer', 'sneha.iyer@student.nova.edu', 'Nova Institute of Technology', '1st Year', '9765432109', 'Registered', '2026-09-13T08:45:00.000Z'),
  reg(5, 'evt-design-day', 'Kabir Singh', 'kabir.singh@student.nova.edu', 'National Design Institute', '2nd Year', '9988776655', 'Registered', '2026-09-14T16:30:00.000Z'),
  reg(6, 'evt-design-day', 'Ananya Rao', 'ananya.rao@student.nova.edu', 'Nova Institute of Technology', '3rd Year', '9123456780', 'Cancelled', '2026-09-15T10:10:00.000Z'),
  reg(7, 'evt-campus-connect', 'Vivaan Gupta', 'vivaan.gupta@student.nova.edu', 'Vidya College of Engineering', '4th Year', '9871234567', 'Registered', '2026-09-16T12:00:00.000Z'),
  reg(8, 'evt-campus-connect', 'Ishita Nair', 'ishita.nair@student.nova.edu', 'Nova Institute of Technology', '2nd Year', '9900112233', 'Registered', '2026-09-17T15:40:00.000Z'),
  reg(9, 'evt-hacknova', 'Arjun Reddy', 'arjun.reddy@student.nova.edu', 'Nova Institute of Technology', '3rd Year', '9789654123', 'Registered', '2026-09-18T09:15:00.000Z'),
  reg(10, 'evt-hacknova', 'Meera Joshi', 'meera.joshi@student.nova.edu', 'City Engineering College', '2nd Year', '9845123678', 'Registered', '2026-09-18T19:25:00.000Z'),
  reg(11, 'evt-aiml-workshop', 'Karan Malhotra', 'karan.malhotra@student.nova.edu', 'Nova Institute of Technology', '1st Year', '9761234509', 'Registered', '2026-09-19T11:55:00.000Z'),
  reg(12, 'evt-aiml-workshop', 'Pooja Verma', 'pooja.verma@student.nova.edu', 'Vidya College of Engineering', '3rd Year', '9933221144', 'Attended', '2026-09-20T13:35:00.000Z'),
  reg(13, 'evt-cultural-night', 'Aditya Kumar', 'aditya.kumar@student.nova.edu', 'Nova Institute of Technology', '1st Year', '9887766554', 'Registered', '2026-09-21T17:50:00.000Z'),
  reg(14, 'evt-cultural-night', 'Nisha Agarwal', 'nisha.agarwal@student.nova.edu', 'City Engineering College', '4th Year', '9700112233', 'Registered', '2026-09-22T09:05:00.000Z'),
  reg(15, 'evt-intra-sports', 'Yash Pandey', 'yash.pandey@student.nova.edu', 'Nova Institute of Technology', '2nd Year', '9866554433', 'Registered', '2026-09-23T14:20:00.000Z'),
  reg(16, 'evt-intra-sports', 'Riya Kapoor', 'riya.kapoor@student.nova.edu', 'National Design Institute', '1st Year', '9812003344', 'Registered', '2026-09-24T10:40:00.000Z'),
  reg(17, 'evt-web-vibes', 'Devansh Shah', 'devansh.shah@student.nova.edu', 'Vidya College of Engineering', '3rd Year', '9877002211', 'Attended', '2026-09-25T08:30:00.000Z'),
  reg(18, 'evt-web-vibes', 'Tanvi Desai', 'tanvi.desai@student.nova.edu', 'Nova Institute of Technology', '2nd Year', '9768001234', 'Attended', '2026-09-25T12:15:00.000Z'),
  reg(19, 'evt-startup-talk', 'Nikhil Bansal', 'nikhil.bansal@student.nova.edu', 'City Engineering College', '4th Year', '9755512345', 'Cancelled', '2026-09-26T15:45:00.000Z'),
  reg(20, 'evt-startup-talk', 'Shreya Menon', 'shreya.menon@student.nova.edu', 'Nova Institute of Technology', '3rd Year', '9899001122', 'Attended', '2026-09-27T10:20:00.000Z'),
  reg(21, 'evt-techfest-2026', 'Aditya Rao', 'aditya.rao@student.nova.edu', 'City Engineering College', '3rd Year', '9812398765', 'Registered', '2026-09-28T11:30:00.000Z'),
  reg(22, 'evt-codesprint', 'Ishaan Khanna', 'ishaan.khanna@student.nova.edu', 'Nova Institute of Technology', '4th Year', '9876512340', 'Registered', '2026-09-28T16:10:00.000Z'),
  reg(23, 'evt-design-day', 'Pooja Hegde', 'pooja.hegde@student.nova.edu', 'National Design Institute', '1st Year', '9812340987', 'Registered', '2026-09-29T09:00:00.000Z'),
  reg(24, 'evt-aiml-workshop', 'Neha Saxena', 'neha.saxena@student.nova.edu', 'Vidya College of Engineering', '2nd Year', '9988771230', 'Registered', '2026-09-29T12:45:00.000Z'),
]

export const SEED_EVENTS = seedEvents
export const SEED_REGISTRATIONS = seedRegistrations
export const FALLBACK_EVENT_IMAGE = FALLBACK_IMG
