/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Editorial accent ramp — keeps `primary-*` token names working
                primary: {
                    50: '#E6F8F9',
                    100: '#C1F0F2',
                    200: '#8CE3E7',
                    300: '#57D6DC',
                    400: '#26C4CB',
                    500: '#00ADB5',
                    600: '#00959C',
                    700: '#007A80',
                    800: '#005F63',
                    900: '#003F42',
                },
                // Editorial semantic tokens (drive from CSS variables so dark mode swaps automatically)
                paper: 'rgb(var(--color-paper) / <alpha-value>)',
                ink: 'rgb(var(--color-ink) / <alpha-value>)',
                'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
                rule: 'rgb(var(--color-rule) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                gray: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#EEEEEE',
                    300: '#E0E0E0',
                    400: '#BDBDBD',
                    500: '#9E9E9E',
                    600: '#757575',
                    700: '#616161',
                    800: '#424242',
                    900: '#212121',
                },
                dark: {
                    50: '#EEEEEE',
                    100: '#DDDEDF',
                    200: '#C8C9CC',
                    300: '#A6A8AC',
                    400: '#7A7E85',
                    500: '#5C6169',
                    600: '#4A5059',
                    700: '#393E46',
                    800: '#2D333C',
                    900: '#222831',
                }
            },
            fontFamily: {
                'sans': ['Cairo', 'Tajawal', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                'heading': ['Cairo', 'Tajawal', 'Nunito', 'system-ui', '-apple-system', 'sans-serif'],
                'display': ['Fraunces', 'Amiri', 'Georgia', 'serif'],
                'serif': ['"Source Serif 4"', 'Amiri', 'Georgia', 'serif'],
            },
            fontSize: {
                // Fluid editorial display scale
                'display-2xl': ['clamp(3rem, 6vw + 1rem, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
                'display-xl': ['clamp(2.25rem, 4vw + 1rem, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
                'display-lg': ['clamp(1.75rem, 2.5vw + 1rem, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
                'display-md': ['clamp(1.5rem, 1.5vw + 1rem, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
            },
            letterSpacing: {
                'kicker': '0.14em',
            },
            maxWidth: {
                'prose-editorial': '68ch',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#374151',
                        lineHeight: '1.7',
                        h1: {
                            fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                            fontWeight: '700',
                            fontSize: '2.25rem',
                            lineHeight: '1.2',
                            marginBottom: '1rem',
                        },
                        h2: {
                            fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                            fontWeight: '600',
                            fontSize: '1.875rem',
                            lineHeight: '1.3',
                            marginTop: '2rem',
                            marginBottom: '1rem',
                        },
                        h3: {
                            fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                            fontWeight: '600',
                            fontSize: '1.5rem',
                            lineHeight: '1.4',
                            marginTop: '1.5rem',
                            marginBottom: '0.75rem',
                        },
                        p: {
                            marginBottom: '1.25rem',
                        },
                        a: {
                            color: '#F43F5E',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        blockquote: {
                            borderLeftColor: '#F43F5E',
                            borderLeftWidth: '4px',
                            paddingLeft: '1rem',
                            fontStyle: 'italic',
                            backgroundColor: '#FFF9F9',
                            padding: '1rem',
                            borderRadius: '0.375rem',
                        },
                        code: {
                            backgroundColor: '#F5F5F5',
                            padding: '0.125rem 0.25rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                        },
                        pre: {
                            backgroundColor: '#1A202C',
                            color: '#F7FAFC',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            overflow: 'auto',
                        },
                    },
                },
                dark: {
                    css: {
                        color: '#E2E8F0',
                        h1: { color: '#F7FAFC' },
                        h2: { color: '#F7FAFC' },
                        h3: { color: '#F7FAFC' },
                        h4: { color: '#F7FAFC' },
                        strong: { color: '#F7FAFC' },
                        blockquote: {
                            backgroundColor: '#2D3748',
                            borderLeftColor: '#F43F5E',
                            color: '#E2E8F0',
                        },
                        code: {
                            backgroundColor: '#2D3748',
                            color: '#E2E8F0',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
