import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Activity,
    ArrowDownToLine,
    ArrowUpRight,
    Award,
    BookOpen,
    Briefcase,
    CalendarDays,
    CheckCircle2,
    Code2,
    GraduationCap,
    Globe2,
    Heart,
    Languages,
    Mail,
    MapPin,
    Phone,
    Stethoscope,
} from 'lucide-react'
import StoryblokContent from '../components/StoryblokContent'
import { fetchPage } from '../utils/storyblokDataLoader'

const experience = [
    {
        role: 'Emergency Medicine Doctor',
        organization: "Ma'aden wa'ad al-shamaal",
        dates: 'February 2024 – Present',
        image: '/pictures/maaden.jpg',
        imageAlt: "Ma'aden Company",
        highlights: [
            'Assessed potential risks associated with hazardous materials in workplace environments',
            'Provided comprehensive general health services to diverse patient populations',
            'Managed emergency response protocols and safety procedures',
        ],
    },
    {
        role: 'Emergency Medicine Doctor',
        organization: 'Egyptian Drilling Company',
        dates: 'June 2022 – October 2023',
        image: '/pictures/edc.jpg',
        imageAlt: 'Egyptian Drilling Company',
        highlights: [
            'Delivered emergency response and trauma management',
            'Coordinated medical evacuations and safety meetings',
            'Supported health education and infection-control protocols',
            'Managed laboratory operations and clinical documentation',
        ],
    },
    {
        role: 'Emergency Medicine Doctor',
        organization: 'Petrofarah Petroleum Co. · Apex Energy',
        dates: 'July 2023 – August 2023',
        image: '/pictures/petrofarah.png',
        imageAlt: 'Petrofarah Petroleum Company',
        highlights: [
            'Managed multiple projects and supported timely completion',
            'Performed routine checkups and maintenance services',
        ],
    },
    {
        role: 'Emergency Medicine Doctor',
        organization: 'Saad Hospital',
        dates: 'April 2022 – July 2023',
        highlights: [
            'Responded to hospital codes and provided advanced resuscitation',
            'Coordinated care with multidisciplinary healthcare teams',
            'Supported continuity of patient care',
        ],
    },
    {
        role: 'Emergency Medicine Doctor',
        organization: 'Al-Amriah Hospital',
        dates: 'April 2022 – June 2022',
        highlights: [
            'Provided critical care and immediate attention in emergencies',
            'Maintained comprehensive patient documentation and records',
        ],
    },
    {
        role: 'ICU Intern',
        organization: 'Ras Elteen Hospital',
        dates: 'March 2022 – April 2022',
        highlights: ['Cared for critically ill patients in the intensive care unit'],
    },
    {
        role: 'House Officer',
        organization: 'Alexandria School of Medicine',
        dates: 'March 2021 – February 2022',
        highlights: [
            'Completed hands-on rotations across medical specialties',
            'Delivered comprehensive patient care and treatment',
        ],
    },
]

const skills = [
    'Emergency medicine',
    'Trauma management',
    'Critical care',
    'Clinical research',
    'Medical documentation',
    'Patient communication',
]

const certifications = [
    { title: 'Saudi Medical License Examination', detail: 'Saudi Commission for Health Specialties · October 2023 · ID 23554578' },
    { title: 'Advanced Trauma Life Support (ATLS)', detail: 'American College of Surgeons · 2024', to: '/certificates/atls' },
    { title: 'Advanced Cardiac Life Support (ACLS)', detail: 'American Heart Association · Issued August 29, 2025 · Renew by August 2027', to: '/certificates/acls' },
    { title: 'Basic Life Support (BLS)', detail: 'American Heart Association · Issued August 28, 2025 · Renew by August 2027', to: '/certificates/bls' },
    { title: 'Prehospital Trauma Life Support (PHTLS), 10th Edition Provider', detail: 'NAEMT · Canadian Medical Center · September 2025 · Expires September 2029', to: '/certificates/phtls' },
    { title: 'Bloodborne Pathogens Certificate', detail: 'NHCPS · 2021' },
    { title: 'Mechanical Ventilation for COVID-19', detail: 'Certificate' },
]

const courses = [
    'Introduction to the Principles and Practice of Clinical Research · NIH · 2024–2025',
    'Python for Data Science and Machine Learning Bootcamp',
    'R Programming A-Z: R for Data Science with Real Exercises',
]

const languages = [
    ['Arabic', 'Native'],
    ['English', 'Fluent'],
    ['French', 'Conversational'],
]

const SectionHeading = ({ icon: Icon, children, id, note }) => (
    <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent" aria-hidden="true">
            <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
            <h2 id={id} className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{children}</h2>
            {note && <p className="mt-1 text-sm text-ink-muted">{note}</p>}
        </div>
    </div>
)

const Card = ({ children, className = '' }) => (
    <section className={`rounded-2xl border border-rule bg-paper p-5 shadow-sm shadow-ink/[0.025] sm:p-6 ${className}`}>
        {children}
    </section>
)

const CVPage = () => {
    const [storyblokPage, setStoryblokPage] = useState(null)

    useEffect(() => {
        let cancelled = false
        fetchPage('cv')
            .then((page) => { if (!cancelled) setStoryblokPage(page) })
            .catch(() => { /* Keep the local CV available when Storyblok is unavailable. */ })
        return () => { cancelled = true }
    }, [])

    return (
        <div className="cv-page min-h-screen bg-paper pb-16 pt-24 text-ink sm:pt-28" dir="ltr" lang="en">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {storyblokPage?.body && (
                    <Card className="mb-6 sm:p-8">
                        <StoryblokContent content={storyblokPage.body} />
                    </Card>
                )}

                <header className="relative overflow-hidden rounded-3xl border border-rule bg-paper shadow-sm shadow-ink/[0.03]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden="true" />
                    <div className="grid gap-7 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 lg:p-10">
                        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                            <img
                                src="/pictures/mohamed-profile.jpg"
                                alt="Dr. Mohamed Shams"
                                className="h-20 w-20 shrink-0 rounded-2xl object-cover object-center sm:h-28 sm:w-28"
                            />
                            <div className="min-w-0">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Curriculum vitae</p>
                                <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.65rem]">
                                    Mohamed Shams Abdelaziz
                                </h1>
                                <p className="mt-2 text-sm font-medium text-ink-muted sm:text-base">MBBCh · Emergency Medicine Doctor</p>
                                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                                    <MapPin className="h-4 w-4 text-accent" aria-hidden="true" /> Saudi Arabia
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
                            <a
                                href="https://www.mediafire.com/file/iprsuzqsl3qe1ti/MOHAMED+SHAMS+CV.pdf/file"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download CV
                            </a>
                            <a
                                href="mailto:shamsmohamed155@gmail.com"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rule px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <Mail className="h-4 w-4 text-accent" aria-hidden="true" /> Contact
                            </a>
                        </div>
                    </div>
                    <nav aria-label="On this page" className="border-t border-rule px-4 py-3 sm:px-8 lg:px-10">
                        <div className="flex gap-2 overflow-x-auto pb-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {[
                                ['experience', 'Experience'],
                                ['education', 'Education'],
                                ['certifications', 'Certifications'],
                                ['courses', 'Courses'],
                            ].map(([id, label]) => (
                                <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-rule px-3.5 py-2 text-ink-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                                    {label}
                                </a>
                            ))}
                        </div>
                    </nav>
                </header>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)] lg:gap-8">
                    <div className="min-w-0 space-y-6">
                        <Card>
                            <SectionHeading icon={Stethoscope} note="Emergency care · Occupational health · Patient-centred practice">Professional profile</SectionHeading>
                            <p className="max-w-3xl text-[0.95rem] leading-7 text-ink-muted">
                                Highly skilled and compassionate medical professional with experience in emergency medicine and patient care. Focused on acute care management, trauma response, and delivering thoughtful clinical care across diverse healthcare environments.
                            </p>
                        </Card>

                        <Card>
                            <SectionHeading icon={Briefcase} id="experience" note="Clinical and occupational health roles">Professional experience</SectionHeading>
                            <ol className="ml-1 border-l border-rule">
                                {experience.map((job, index) => (
                                    <li key={`${job.organization}-${job.dates}`} className="relative pb-7 pl-5 last:pb-0 sm:pl-7">
                                        <span className="absolute -left-[0.4rem] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-accent ring-1 ring-accent/30" aria-hidden="true" />
                                        <article>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    {job.image && (
                                                        <img src={job.image} alt={job.imageAlt} loading="lazy" className="hidden h-11 w-11 shrink-0 rounded-xl object-cover sm:block" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold leading-snug text-ink">{job.role}</h3>
                                                        <p className="mt-1 text-sm font-medium text-accent">{job.organization}</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-accent/8 px-3 py-1.5 text-xs font-medium text-ink-muted">
                                                    <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> {job.dates}
                                                </span>
                                            </div>
                                            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink-muted">
                                                {job.highlights.map((highlight) => (
                                                    <li key={highlight} className="flex gap-2.5">
                                                        <span className="mt-[0.62rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {index < experience.length - 1 && <div className="mt-6 border-b border-rule/70" aria-hidden="true" />}
                                        </article>
                                    </li>
                                ))}
                            </ol>
                        </Card>

                        <Card>
                            <SectionHeading icon={GraduationCap} id="education" note="Medical education and licensing examinations">Education & examinations</SectionHeading>
                            <div className="space-y-3">
                                <div className="flex gap-3 rounded-xl border border-rule p-4">
                                    <span className="mt-0.5 text-accent"><Activity className="h-5 w-5" aria-hidden="true" /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                            <h3 className="font-semibold text-ink">USMLE Step 2</h3>
                                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">In progress</span>
                                        </div>
                                        <p className="mt-1 text-sm text-ink-muted">United States Medical Licensing Examination</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 rounded-xl border border-rule p-4">
                                    <span className="mt-0.5 text-accent"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                            <h3 className="font-semibold text-ink">USMLE Step 1</h3>
                                            <span className="text-xs font-medium text-ink-muted">Passed · February 2025</span>
                                        </div>
                                        <p className="mt-1 text-sm text-ink-muted">United States Medical Licensing Examination</p>
                                        <Link to="/certificates/usmle-step1" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                                            View certificate <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex gap-3 rounded-xl border border-rule p-4">
                                    <span className="mt-0.5 text-accent"><Briefcase className="h-5 w-5" aria-hidden="true" /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                            <h3 className="font-semibold text-ink">House Officer</h3>
                                            <span className="text-xs text-ink-muted">February 2021</span>
                                        </div>
                                        <p className="mt-1 text-sm text-ink-muted">Alexandria University</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 rounded-xl border border-rule p-4">
                                    <span className="mt-0.5 text-accent"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                            <h3 className="font-semibold text-ink">MBBCh</h3>
                                            <span className="text-xs text-ink-muted">October 2020</span>
                                        </div>
                                        <p className="mt-1 text-sm text-ink-muted">Alexandria University</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <SectionHeading icon={Award} id="certifications" note="Professional credentials and clinical training">Certifications</SectionHeading>
                            <ul className="divide-y divide-rule">
                                {certifications.map((item) => (
                                    <li key={item.title}>
                                        {item.to ? (
                                            <Link to={item.to} className="group flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                                                <Credential item={item} />
                                                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                                            </Link>
                                        ) : <div className="py-4 first:pt-0 last:pb-0"><Credential item={item} /></div>}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <SectionHeading icon={BookOpen} id="courses" note="Continuing education and additional study">Courses</SectionHeading>
                            <ul className="space-y-3">
                                {courses.map((course) => (
                                    <li key={course} className="flex gap-3 text-sm leading-6 text-ink-muted">
                                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                        <span>{course}</span>
                                    </li>
                                ))}
                                <li className="flex gap-3 text-sm leading-6 text-ink-muted">
                                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                    <span>EUS Interventional Procedures MasterClass · EAMBS</span>
                                </li>
                                <li className="flex gap-3 text-sm leading-6 text-ink-muted">
                                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                    <span>Liver Regeneration: Current and Future Trends</span>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    <aside className="min-w-0 space-y-6" aria-label="Additional professional information">
                        <Card>
                            <SectionHeading icon={Mail}>Contact</SectionHeading>
                            <address className="not-italic">
                                <ul className="space-y-4 text-sm">
                                    <li className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                        <a href="tel:+966053489204" className="break-all text-ink-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">+966 053 489 204</a>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                        <a href="mailto:shamsmohamed155@gmail.com" className="break-all text-ink-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">shamsmohamed155@gmail.com</a>
                                    </li>
                                    <li className="flex items-start gap-3 text-ink-muted">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> Saudi Arabia
                                    </li>
                                    <li className="flex items-start gap-3 text-ink-muted">
                                        <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> Egyptian
                                    </li>
                                    <li className="flex items-start gap-3 text-ink-muted">
                                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> 17 June 1996
                                    </li>
                                </ul>
                            </address>
                        </Card>

                        <Card>
                            <SectionHeading icon={Code2}>Core skills</SectionHeading>
                            <ul className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <li key={skill} className="rounded-full border border-rule bg-paper px-3 py-1.5 text-xs font-medium text-ink-muted">{skill}</li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <SectionHeading icon={Languages}>Languages</SectionHeading>
                            <ul className="space-y-3">
                                {languages.map(([language, level]) => (
                                    <li key={language} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="font-medium text-ink">{language}</span>
                                        <span className="text-ink-muted">{level}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <SectionHeading icon={Award}>Recognition</SectionHeading>
                            <Link to="/certificates/maaden" className="group block rounded-xl border border-rule p-4 transition-colors hover:border-accent/40 hover:bg-accent/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                                <span className="flex items-start justify-between gap-3">
                                    <span>
                                        <span className="block font-semibold text-ink group-hover:text-accent">Certificate of Excellence</span>
                                        <span className="mt-1 block text-sm text-ink-muted">Ma'aden · 2024–2025</span>
                                    </span>
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted group-hover:text-accent" aria-hidden="true" />
                                </span>
                                <span className="mt-3 block text-sm leading-6 text-ink-muted">Recognized for dedication and leadership in medical services.</span>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">View certificate <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                            </Link>
                        </Card>

                        <Card>
                            <SectionHeading icon={Heart}>Interests</SectionHeading>
                            <ul className="space-y-2.5 text-sm text-ink-muted">
                                <li><Link to="/reading" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Reading</Link></li>
                                <li>Freelancing</li>
                                <li>Continuing medical education</li>
                            </ul>
                        </Card>
                    </aside>
                </div>

                <div className="mt-8 rounded-2xl border border-rule bg-paper px-5 py-4 text-center text-sm text-ink-muted sm:flex sm:items-center sm:justify-between sm:text-left">
                    <span>For a complete printable version, download the PDF CV.</span>
                    <a href="https://www.mediafire.com/file/iprsuzqsl3qe1ti/MOHAMED+SHAMS+CV.pdf/file" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:mt-0">
                        <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download PDF
                    </a>
                </div>
            </div>
        </div>
    )
}

const Credential = ({ item }) => (
    <span>
        <span className="block font-semibold text-ink">{item.title}</span>
        <span className="mt-1 block text-sm leading-6 text-ink-muted">{item.detail}</span>
    </span>
)

export default CVPage
