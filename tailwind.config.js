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
                primary: {
                    50: '#FFF9F9',
                    100: '#FEF2F2',
                    200: '#FECACA',
                    300: '#FDA4AF',
                    400: '#FB7185',
                    500: '#F43F5E',
                    600: '#E11D48',
                    700: '#BE123C',
                    800: '#9F1239',
                    900: '#881337',
                },
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
                    50: '#F7FAFC',
                    100: '#EDF2F7',
                    200: '#E2E8F0',
                    300: '#CBD5E0',
                    400: '#A0AEC0',
                    500: '#718096',
                    600: '#4A5568',
                    700: '#2D3748',
                    800: '#1A202C',
                    900: '#171923',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                'heading': ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
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
