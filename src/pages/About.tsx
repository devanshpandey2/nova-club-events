import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { CLUB_STATS } from '../data/seedData'
import { ClubLogo } from '../components/Navbar'

const VALUES = [
  {
    title: 'Learn by building',
    text: 'Every workshop ends with something shipped — a project, a prototype or a certificate.',
  },
  {
    title: 'Open to everyone',
    text: 'From first-years writing their first line of code to final-years shipping startups.',
  },
  {
    title: 'Community first',
    text: 'We measure success in friendships formed, teams assembled and skills shared.',
  },
]

const TEAM = [
  { name: 'Aarav Sharma', role: 'President', emoji: '🧑‍💻' },
  { name: 'Diya Patel', role: 'Vice President', emoji: '🎨' },
  { name: 'Rohan Mehta', role: 'Tech Lead', emoji: '⚙️' },
  { name: 'Sneha Iyer', role: 'Events Lead', emoji: '📅' },
]

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
              About us
            </p>
            <h1 className="mt-2 text-4xl text-white sm:text-5xl">More Than Just Events</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Nova Tech &amp; Cultural Club is a student-run community at Nova Institute of
              Technology. Since 2019 we've organized {CLUB_STATS.totalEvents}+ events that turn
              classroom curiosity into real skills — and real friendships.
            </p>
          </div>
        </div>
      </section>

      {/* Story + values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Our story</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              The club started as a small group of first-year students who wanted a place to build
              things outside the curriculum. What began as weekend coding sessions in a borrowed
              lab is now one of the most active communities on campus — running hackathons with
              200+ participants, workshops that fill in minutes, and cultural nights that pack the
              open-air theatre.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Today we run five verticals — technology, design, cultural, community and sports —
              each led by students, for students.
            </p>
          </div>
          <div className="space-y-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <h3 className="text-lg">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [CLUB_STATS.totalEvents, '+', 'Events organized'],
              [CLUB_STATS.totalStudents, '+', 'Students engaged'],
              [CLUB_STATS.workshops, '+', 'Workshops hosted'],
              [CLUB_STATS.partners, '+', 'Club partners'],
            ].map(([value, suffix, label]) => (
              <div key={label} className="card p-6 text-center">
                <dd className="text-3xl font-bold text-slate-900">
                  {value}
                  <span className="text-primary-600">{suffix}</span>
                </dd>
                <dt className="mt-1 text-sm font-medium text-slate-500">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl">The team</h2>
        <p className="mt-2 text-slate-600">Students leading the community forward.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="card flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl" aria-hidden>
                {m.emoji}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{m.name}</p>
                <p className="text-sm text-slate-500">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="card flex flex-col items-start gap-6 bg-navy-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl text-white">Want to collaborate?</h2>
            <p className="mt-2 text-slate-300">
              Partners, sponsors and speakers are always welcome. Reach out — we reply fast.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-300" aria-hidden /> hello@novaclub.edu
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-300" aria-hidden /> +91 98765 00000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-300" aria-hidden /> Club Room 204, Tech Park
              </li>
            </ul>
          </div>
          <Link to="/events" className="btn-primary shrink-0">
            Explore our events <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  )
}
