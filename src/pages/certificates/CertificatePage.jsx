import React from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowDownToLine,
    ArrowLeft,
    ArrowUpRight,
    Award,
    Building,
    CalendarDays,
    CheckCircle2,
} from 'lucide-react'

const CertificatePage = ({
    icon: Icon = Award,
    abbreviation,
    title,
    issuer,
    issueDate,
    expirationDate,
    expirationLabel = 'Expires',
    issuerLabel = 'Issued by',
    image,
    images,
    description,
    descriptionHeading,
    skills,
    skillsHeading = 'Skills & competencies',
    extraDetails = [],
}) => {
    const certificateImages = images || [{ src: image, alt: `${abbreviation} certificate`, label: 'Certificate' }]
    const primaryImage = certificateImages[0]?.src

    return (
        <div className="cv-page min-h-screen bg-paper pb-16 pt-24 text-ink sm:pt-28" dir="ltr" lang="en">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <Link
                    to="/cv"
                    className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-ink-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to CV
                </Link>

                <header className="relative overflow-hidden rounded-3xl border border-rule bg-paper shadow-sm shadow-ink/[0.03]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden="true" />
                    <div className="flex items-center gap-4 p-5 sm:gap-6 sm:p-8 lg:p-10">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent sm:h-16 sm:w-16" aria-hidden="true">
                            <Icon className="h-7 w-7" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Certificate · {abbreviation}</p>
                            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
                            <p className="mt-2 text-sm font-medium text-ink-muted sm:text-base">{abbreviation} certification</p>
                        </div>
                    </div>
                </header>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
                    <div className="min-w-0 space-y-6">
                        <section className="rounded-2xl border border-rule bg-paper p-5 shadow-sm shadow-ink/[0.025] sm:p-6" aria-labelledby="certificate-details-heading">
                            <h2 id="certificate-details-heading" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Certificate details</h2>
                            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div className="rounded-xl border border-rule p-4">
                                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                        <Building className="h-4 w-4 text-accent" aria-hidden="true" /> {issuerLabel}
                                    </dt>
                                    <dd className="mt-2 text-sm font-medium leading-6 text-ink">{issuer}</dd>
                                </div>
                                <div className="rounded-xl border border-rule p-4">
                                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                        <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" /> Issue date
                                    </dt>
                                    <dd className="mt-2 text-sm font-medium text-ink">{issueDate}</dd>
                                </div>
                                {expirationDate && (
                                    <div className="rounded-xl border border-rule p-4">
                                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                            <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" /> {expirationLabel}
                                        </dt>
                                        <dd className="mt-2 text-sm font-medium text-ink">{expirationDate}</dd>
                                    </div>
                                )}
                                {extraDetails.map(({ label, value }) => (
                                    <div key={label} className="rounded-xl border border-rule p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
                                        <dd className="mt-2 break-words text-sm font-medium leading-6 text-ink">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        <section className="rounded-2xl border border-rule bg-paper p-5 shadow-sm shadow-ink/[0.025] sm:p-6" aria-labelledby="about-certificate-heading">
                            <h2 id="about-certificate-heading" className="text-xl font-semibold tracking-tight text-ink">{descriptionHeading || `About ${abbreviation}`}</h2>
                            <p className="mt-3 text-sm leading-7 text-ink-muted">{description}</p>
                        </section>

                        {!!skills?.length && (
                            <section className="rounded-2xl border border-rule bg-paper p-5 shadow-sm shadow-ink/[0.025] sm:p-6" aria-labelledby="skills-heading">
                                <h2 id="skills-heading" className="text-xl font-semibold tracking-tight text-ink">{skillsHeading}</h2>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {skills.map((skill) => (
                                        <li key={skill} className="flex items-start gap-2.5 text-sm leading-6 text-ink-muted">
                                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                            <span>{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <a
                                href={primaryImage}
                                download={`${abbreviation.replaceAll(' ', '-')}-certificate.png`}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download certificate
                            </a>
                            <Link
                                to="/cv"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rule px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <ArrowLeft className="h-4 w-4 text-accent" aria-hidden="true" /> Back to CV
                            </Link>
                        </div>
                    </div>

                    <section
                        className={`min-w-0 space-y-4 rounded-2xl border border-rule bg-paper p-3 shadow-sm shadow-ink/[0.025] sm:p-5 ${certificateImages.length === 1 ? 'lg:sticky lg:top-24' : ''}`}
                        aria-label={`${abbreviation} certificate images`}
                    >
                        {certificateImages.map((certificateImage, index) => (
                            <div key={certificateImage.src}>
                                <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:px-0">
                                    <h2 className="text-sm font-semibold text-ink">
                                        {certificateImage.label || (index === 0 ? 'Certificate image' : `Supporting document ${index + 1}`)}
                                    </h2>
                                    <a
                                        href={certificateImage.src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        Open full size <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </a>
                                </div>
                                <div className="overflow-hidden rounded-xl border border-rule bg-white p-2 sm:p-3">
                                    <img
                                        src={certificateImage.src}
                                        alt={certificateImage.alt || `${abbreviation} certificate`}
                                        className="mx-auto h-auto max-h-[78vh] w-full object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CertificatePage
