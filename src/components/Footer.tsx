import { Link } from 'react-router-dom'
import { Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { CLUB_NAME } from '../data/seedData'
import { ClubLogo } from './Navbar'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/about', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-navy-700/60 bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <ClubLogo />
              <span className="text-lg font-semibold text-white">Nova Club</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              The student-run tech &amp; cultural community of Nova Institute of Technology —
              organizing hackathons, workshops and campus experiences since 2019.
            </p>
            <div className="mt-5 flex gap-2">
              <SocialLink label="Nova Club on Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="Nova Club on LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="Nova Club on GitHub">
                <Github className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="Email Nova Club">
                <Mail className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-slate-400 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>Nova Institute of Technology, Tech Park, Block C</li>
              <li>
                <a href="mailto:hello@novaclub.edu" className="transition hover:text-white">
                  hello@novaclub.edu
                </a>
              </li>
              <li>Mon–Fri · 4–6 PM · Club Room 204</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-700/60 pt-6 text-xs text-slate-500">
          © 2026 {CLUB_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="mailto:hello@novaclub.edu"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-600 bg-navy-800 text-slate-300 transition hover:border-primary-400 hover:text-white"
    >
      {children}
    </a>
  )
}
