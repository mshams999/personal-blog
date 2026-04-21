import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, Code2, Target, Dumbbell, Rocket, Sparkles } from 'lucide-react'
import MetaTags from '../components/MetaTags'
import Rule from '../components/editorial/Rule'
import Kicker from '../components/editorial/Kicker'
import SectionHeader from '../components/editorial/SectionHeader'
import StoryblokContent from '../components/StoryblokContent'
import ContactInfoCard from '../components/ContactInfoCard'
import { fetchPage } from '../utils/storyblokDataLoader'

const storySections = [
    {
        title: 'أنا مين؟ 👤',
        icon: Stethoscope,
        body: 'أنا طبيب بمارس مهنتي حالياً في قطاع التعدين كطبيب سلامة مهنية، لكن بعيداً عن السماعة والبالطو الأبيض، أنا شخص مؤمن إن التطور ملوش سقف. بدأت رحلتي من مصر، وحالياً ببنِي مستقبلي خطوة بخطوة في بلدي الثاني السعودية، وعيني دايماً على الحلم الجاي.',
        image: {
            src: '/pictures/me1.jpeg',
            alt: 'صورة محمد شمس',
        },
    },
    {
        title: 'رحلة الـ USMLE (الطريق إلى أمريكا) 🇺🇸',
        icon: Target,
        body: 'دلوقتي، تركيزي الأكبر ومنصبّ على التحضير لمعادلة الطب الأمريكية (USMLE Step 2). الطريق مش سهل، وبحتاج فيه لكل ذرة استمرارية ونفس طويل، عشان كدة هتلاقيني ملتزم بحل الـ Blocks اليومية وبناء "فورمة" ذهنية قوية للوصول لهدفي في يوليو 2026 بإذن الله.',
        image: {
            src: '/pictures/step1.jpg',
            alt: 'صورة محمد شمس',
        },
    },
    {
        title: 'الكود والبرمجة.. شغفي التاني 💻',
        icon: Code2,
        body: 'ليه دكتور مهتم بالبرمجة؟ لأن الكود بالنسبة لي زي الطب؛ فيه منطق، فيه حل للمشكلات، وفيه خلق لشيء من لا شيء. أنا بـهوى بناء المواقع وتجربة لغات جديدة، والموقع اللي إنت فيه دلوقتي هو نتاج تعلمي لـ React و Tailwind CSS. بحب أجمع بين دقة الطب وابتكار التقنية.',
        image: {
            src: '/pictures/programming.jpg',
            alt: 'صورة محمد شمس',
        },
    },
    {
        title: 'بعيداً عن المذاكرة والشغل 🌌🏋️‍♂️',
        icon: Rocket,
        body: 'لو مش براجع حالات طبية أو بكتب كود، فغالباً هتلاقيني في مكان من اتنين:',
        image: {
            src: '/pictures/me2.jpg',
            alt: 'صورة محمد شمس',
        },
    },
]

const beyondWorkItems = [
     {
        title: 'تحت السما',
        icon: Sparkles,
        body: 'بعشق علم الفلك (Astronomy)، والنجوم دايمًا بتفكرني إن العالم ده واسع جداً وإن أحلامنا مهما كبرت فهي ممكنة.',
    },
    {
        title: 'الجيم',
        icon: Dumbbell,
        body: 'بالنسبة لي التمرين مش بس عشان اللياقة، ده "Reset" لعقلي عشان أقدر أكمل يومي بطاقة وشغف.',
    },
   
]

const AboutPage = () => {
    const [storyblokPage, setStoryblokPage] = useState(null)

    useEffect(() => {
        let cancelled = false
        fetchPage('about')
            .then((p) => { if (!cancelled) setStoryblokPage(p) })
            .catch(() => { /* fall through to hardcoded sections */ })
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <MetaTags
                title="عن محمد شمس"
                description="تعرف على رحلة محمد شمس بين الطب، البرمجة، والاستمرارية اليومية نحو أهداف أكبر."
                type="profile"
                url={typeof window !== 'undefined' ? `${window.location.origin}/about` : '/about'}
                image="/pictures/about-me.jpg"
                author="محمد شمس"
            />

            <div className="relative overflow-hidden bg-paper" dir="rtl" lang="ar">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(162,59,46,0.18),transparent_65%),radial-gradient(900px_500px_at_10%_110%,rgba(162,59,46,0.1),transparent_70%)]"
                />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-20 md:pb-24 space-y-14">
                    <header className="reveal-up grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-3 space-y-6 md:space-y-7">
                            <Kicker>About</Kicker>
                            <h1 className="font-display text-display-xl text-ink leading-[1.2] max-w-4xl">
                                عن محمد شمس.. طبيب، مطوّر، وعاشق للنجوم
                            </h1>
                            <p aria-hidden="true" className="text-3xl md:text-4xl leading-none tracking-[0.08em]">
                                🩺💻✨
                            </p>
                            <p className="font-serif text-xl md:text-2xl text-ink-muted max-w-prose-editorial leading-relaxed">
                                أهلاً بيك في مساحتي الخاصة..
                            </p>
                            <p className="font-serif text-lg text-ink-muted max-w-prose-editorial leading-loose">
                                أنا محمد شمس، طبيب مصري أعيش حالياً في المملكة العربية السعودية. رحلتي مش مجرد مسار مهني تقليدي، لكنها مزيج من حاجتين بحبهم جداً: الطب والتكنولوجيا.
                            </p>
                        </div>

                        <figure className="lg:col-span-2 rounded-3xl overflow-hidden border border-rule bg-paper/60 max-w-md lg:max-w-none">
                            <img
                                src="/pictures/about-me.jpg"
                                alt="محمد شمس"
                                loading="lazy"
                                className="w-full h-full object-cover aspect-[4/5]"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </figure>
                    </header>

                    <Rule ornament="✦" />

                    {storyblokPage?.body && (
                        <section className="reveal-up">
                            <StoryblokContent content={storyblokPage.body} />
                        </section>
                    )}

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                        {storySections.map(({ title, body, icon: Icon, image }, index) => (
                            <article
                                key={title}
                                className={`rounded-3xl border border-rule bg-paper/90 p-6 md:p-7 reveal-up delay-${Math.min(index + 1, 4)} ${title.includes('بعيداً') ? 'md:col-span-2' : ''}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent">
                                        <Icon className="w-4.5 h-4.5" />
                                    </span>
                                    <h2 className="font-display text-2xl leading-tight text-ink">{title}</h2>
                                </div>
                                <p className="font-serif text-lg leading-relaxed text-ink-muted">
                                    {body}
                                </p>

                                {image && (
                                    <figure className="mt-6 rounded-2xl overflow-hidden border border-rule bg-paper/70 p-2 sm:p-3 flex items-center justify-center">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            loading="lazy"
                                            className="w-full h-auto object-contain rounded-xl"
                                        />
                                    </figure>
                                )}

                                {title.includes('بعيداً') && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {beyondWorkItems.map(({ title: itemTitle, body: itemBody, icon: ItemIcon }) => (
                                            <div key={itemTitle} className="rounded-2xl border border-rule bg-paper p-5">
                                                <div className="flex items-center gap-2.5 mb-2.5">
                                                    <ItemIcon className="w-4 h-4 text-accent" />
                                                    <h3 className="font-display text-xl text-ink leading-tight">{itemTitle}:</h3>
                                                </div>
                                                <p className="font-serif text-base leading-relaxed text-ink-muted">
                                                    {itemBody}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </section>

                    <Rule ornament="•" />

                    <section className="space-y-8 reveal-up delay-2">
                        <SectionHeader kicker="ليه المدونة دي؟" title="المدونة دي هي Dashboard رحلتي" className="!mb-0" />

                        <p className="font-serif text-lg md:text-xl leading-relaxed text-ink-muted max-w-prose-editorial">
                            المدونة دي هي "الـ Dashboard" الخاصة بيا.. بكتب فيها عن رحلتي في المذاكرة، التقنيات اللي بتعلمها، وأي فكرة بحس إنها ممكن تلهم حد ماشي في طريق مشابه لطريقي.
                        </p>

                        <blockquote className="rounded-2xl border border-rule bg-paper/80 p-6 md:p-8">
                            <p className="font-display text-display-md text-ink leading-tight">
                                شعارى في الحياة: "الاستمرارية بتغلب الموهبة.. ابدأ صغير، بس ابدأ."
                            </p>
                        </blockquote>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 rounded-full bg-accent text-paper px-5 py-2.5 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
                            >
                                <Sparkles className="w-4 h-4" />
                                اطلع على المقالات
                            </Link>
                            <Link
                                to="/reading"
                                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                            >
                                <Dumbbell className="w-4 h-4" />
                                القراءة والمكتبة
                            </Link>
                        </div>
                    </section>

                    <Rule ornament="✦" />

                    <section className="reveal-up w-full">
                        <div dir="ltr" className="text-left">
                            <ContactInfoCard className="w-full p-5 sm:p-6 md:p-8" />
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default AboutPage
