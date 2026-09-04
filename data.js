// StartFEST 2026 schedule — transcribed from the official Silicon Slopes agenda image.
// Times are Mountain Time (MDT). Conference: June 23–24, 2026.

const CONFERENCE = {
  name: 'StartFEST 2026',
  venue: 'Mountain America Event Venue · Loveland Living Planet Aquarium',
  timezone: 'America/Denver',
  days: [
    { day: 1, label: 'Tue 23', full: 'Tuesday, June 23', date: '2026-06-23' },
    { day: 2, label: 'Wed 24', full: 'Wednesday, June 24', date: '2026-06-24' },
  ],
};

const TRACKS = {
  'AI': 'ai',
  'Marketing': 'marketing',
  'Operations': 'operations',
  'Funding': 'funding',
  'Self Leadership': 'leadership',
  'Sales': 'sales',
  'Resource Room': 'resource',
  'Mainstage': 'mainstage',
  'Hackathon': 'hackathon',
};

const SESSIONS = [
  // ── Day 1 · Tuesday, June 23 ──────────────────────────────────────────────
  { id: 'd1-welcome', day: 1, start: '09:00', end: '09:15', room: 'Mainstage', track: 'Mainstage',
    title: 'Welcome', speaker: 'Clint Betts, Lindsey Ivie', org: '' },
  { id: 'd1-keynote', day: 1, start: '09:15', end: '09:45', room: 'Mainstage', track: 'Mainstage',
    title: 'Opening Keynote', speaker: 'Nick Thomas', org: 'CEO Nordmark · Co-founded Bluetooth Special Interest Group' },
  { id: 'd1-panel', day: 1, start: '09:45', end: '10:15', room: 'Mainstage', track: 'Mainstage',
    title: 'The State of Silicon Slopes: Where the Money Is Moving', speaker: 'Ryan Caldwell, Tara Rosander', org: 'CEO MX · Deputy Director, COO GOED' },

  { id: 'd1-bridging', day: 1, start: '10:30', end: '11:05', room: 'Start Room', track: 'Funding',
    title: 'Bridging the Gap', speaker: 'Scott Holley', org: 'Executive Director, Lassonde Entrepreneur Institute' },
  { id: 'd1-correction', day: 1, start: '10:30', end: '11:05', room: 'Start Room', track: 'AI',
    title: 'Surviving the AI Correction', speaker: 'Michael Malin', org: 'Founder, Model Forge' },
  { id: 'd1-regulate', day: 1, start: '10:30', end: '11:05', room: 'Ignition Room', track: 'Self Leadership',
    title: "You Can't Scale What You Can't Regulate", speaker: 'Lisa Jones Christensen', org: 'Associate Professor of Entrepreneurship, Marriott School of Business, BYU' },
  { id: 'd1-blueprint', day: 1, start: '10:30', end: '11:05', room: 'Accelerator', track: 'AI',
    title: 'AI Blueprint Workshop', speaker: 'Cameo Doran', org: 'Founder, Cameo Labs' },

  { id: 'd1-break1', day: 1, start: '11:05', end: '11:25', room: '', track: '', title: 'Break', isBreak: true },

  { id: 'd1-gtm', day: 1, start: '11:25', end: '12:00', room: 'Start Room', track: 'Sales',
    title: 'AI Is Not Your CMO: The New GTM Math', speaker: 'Joe Grover', org: 'CGO, Ampleo' },
  { id: 'd1-funding', day: 1, start: '11:25', end: '12:00', room: 'Ignition Room', track: 'Funding',
    title: 'Funding', speaker: 'Brock Blake', org: 'CEO, Lendio' },
  { id: 'd1-stress', day: 1, start: '11:25', end: '12:00', room: 'Accelerator', track: 'Self Leadership',
    title: 'Even-Achieving: How to Balance Stress with Success', speaker: 'Erika Coleman', org: 'Erika Coleman Speaks' },

  { id: 'd1-lunch', day: 1, start: '12:00', end: '13:30', room: '', track: '', title: 'Networking Lunch', isBreak: true },

  { id: 'd1-content', day: 1, start: '13:30', end: '14:05', room: 'Start Room', track: 'Marketing',
    title: 'How to Make Content People Actually Want to Watch', speaker: 'Levi Lindsay', org: 'VP of Creative, Pestie' },
  { id: 'd1-csuite', day: 1, start: '13:30', end: '14:05', room: 'Ignition Room', track: 'AI',
    title: 'AI for the C-Suite', speaker: 'Landon Essig', org: 'CEO, CoDev' },
  { id: 'd1-advisory', day: 1, start: '13:30', end: '14:05', room: 'Accelerator', track: 'Funding',
    title: 'Build an Advisory Board to Strengthen Fundraising', speaker: 'Nicole Toomey Davis', org: 'President & CEO and Co-Founder, Enclavix, LLC' },

  { id: 'd1-leadership1', day: 1, start: '14:15', end: '15:00', room: 'Start Room', track: 'Self Leadership',
    title: 'Leadership', speaker: 'Steve Daly', org: 'CEO, Instructure' },
  { id: 'd1-comp', day: 1, start: '14:15', end: '15:00', room: 'Ignition Room', track: 'Sales',
    title: 'Your Comp Plan Is Killing Your Pipeline', speaker: 'Amy Cook', org: 'CMO, Fullcast' },
  { id: 'd1-bizai', day: 1, start: '14:15', end: '15:00', room: 'Accelerator', track: 'AI',
    title: 'How to Build a Business with AI', speaker: 'Jon Cheney', org: 'CEO, GENAIPI' },

  { id: 'd1-break2', day: 1, start: '15:00', end: '15:15', room: '', track: '', title: 'Break', isBreak: true },

  { id: 'd1-leadership2', day: 1, start: '15:15', end: '16:00', room: 'Start Room', track: 'Self Leadership',
    title: 'Leadership', speaker: 'Steve Arntz', org: 'CEO, Campire' },
  { id: 'd1-hackathon', day: 1, start: '15:15', end: '17:00', room: 'Ignition + Accelerator', track: 'Hackathon',
    title: 'Hackathon', speaker: '', org: '' },

  // ── Day 2 · Wednesday, June 24 ────────────────────────────────────────────
  { id: 'd2-keynote', day: 2, start: '08:45', end: '09:15', room: 'Mainstage', track: 'Mainstage',
    title: 'AI and the Future of Utah', speaker: 'Jeremy Andrus, Clint Betts', org: 'CEO Traegar · CEO Silicon Slopes' },
  { id: 'd2-worldcup', day: 2, start: '09:15', end: '10:50', room: 'Mainstage', track: 'Mainstage',
    title: 'Startup World Cup — 10 Finalists', speaker: '', org: '' },

  { id: 'd2-chaos', day: 2, start: '11:00', end: '11:35', room: 'Start Room', track: 'Operations',
    title: 'From Chaos to Process', speaker: 'Jake Fackrell', org: 'COO, Savvos Health' },
  { id: 'd2-automation', day: 2, start: '11:00', end: '11:35', room: 'Ignition Room', track: 'AI',
    title: 'AI Automation', speaker: 'Gabe Larsen', org: 'Atonom' },
  { id: 'd2-growth', day: 2, start: '11:00', end: '11:35', room: 'Accelerator', track: 'Sales',
    title: 'AI-Powered Growth Marketing', speaker: 'Michael Schmutz', org: 'Founder, DataXGrowth' },

  { id: 'd2-resume', day: 2, start: '11:40', end: '12:15', room: 'Start Room', track: 'Self Leadership',
    title: 'The Room Owes You Nothing: Leading Without a Resume', speaker: 'Kurt Workman, Clint Betts', org: 'CEO Owlet · CEO Silicon Slopes' },
  { id: 'd2-obvious', day: 2, start: '11:40', end: '12:15', room: 'Ignition Room', track: 'Marketing',
    title: 'The Unexpected Obvious of Growth: Conferences, Podcasts & Thought Leadership', speaker: 'Zack Oates', org: 'Founder & CEO, Ovation' },
  { id: 'd2-eventmkt', day: 2, start: '11:40', end: '12:15', room: 'Accelerator', track: 'Marketing',
    title: 'Event Marketing', speaker: 'Catherine Bennett, Hayden Harward, Kolleen Russo', org: 'Utah Business' },

  { id: 'd2-lunch', day: 2, start: '12:30', end: '14:00', room: '', track: '', title: 'Networking Lunch', isBreak: true },

  { id: 'd2-signal', day: 2, start: '14:00', end: '14:35', room: 'Start Room', track: 'Marketing',
    title: 'Stop Producing Noise. Start Building Signal', speaker: 'Krista Parry', org: 'Founder, KP Media' },
  { id: 'd2-pydantic', day: 2, start: '14:00', end: '14:35', room: 'Ignition Room', track: 'AI',
    title: 'Building Reliable AI Workflow Automations with Pydantic & n8n', speaker: 'Jordan Gunderson', org: 'Co-Founder, Izeni' },
  { id: 'd2-datastops', day: 2, start: '14:00', end: '14:35', room: 'Accelerator', track: 'Operations',
    title: 'When Teams Stop Talking, Data Stops Working', speaker: 'Russ Hannig', org: 'COO, SponsorCX' },

  { id: 'd2-datacenters', day: 2, start: '14:40', end: '15:40', room: 'Start Room', track: 'AI',
    title: 'Sustainable AI and the Rise of the Mega Data Centers', speaker: 'Brian Beutler', org: 'CEO Alianza · Panel Discussion' },
  { id: 'd2-officehours', day: 2, start: '14:40', end: '15:15', room: 'Ignition Room', track: 'Resource Room',
    title: 'Open Office Hours', speaker: '', org: 'Resource partners in Marketing, Sales, Legal, Accounting, and Fund Raising' },
  { id: 'd2-community', day: 2, start: '14:40', end: '15:15', room: 'Accelerator', track: 'Marketing',
    title: 'Building Community in the Age of AI', speaker: 'Sindee Savage', org: 'Community Architech, Sindee Savage Consulting' },
  { id: 'd2-videoad', day: 2, start: '15:20', end: '16:00', room: 'Ignition Room', track: 'Marketing',
    title: 'The Million Dollar Video Ad Framework', speaker: 'Jake Larsen', org: 'Founder, Video Power Marketing' },
  { id: 'd2-grinding', day: 2, start: '15:20', end: '16:00', room: 'Accelerator', track: 'Self Leadership',
    title: 'From Grinding to Growing: Architect Your Capacity Wall', speaker: 'Russ Simon', org: 'Founder, Russ Simon Leadership Solutions' },
];

// Demo attendee pool — assigned deterministically per session so lists feel
// organic but stay stable between visits.
const DEMO_ATTENDEES = [
  'Spence R.', 'Tyler M.', 'Avery Chen', 'Jordan Blake', 'Sam Whitaker',
  'Priya Nair', 'Marcus Webb', 'Elena Vasquez', 'Dallin Hart', 'Kate Sorensen',
  'Noah Christiansen', 'Maya Patel', 'Beau Jensen', 'Sloane Murphy', 'Ravi Kapoor',
  'Tess Larsen', 'Cole Bingham', 'Ana Reyes', 'Grant Oakey', 'Lindsey Ho',
];
