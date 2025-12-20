/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'energy-blue': '#1e3a8a',
                'grid-green': '#10b981',
            },
        },
    },
    plugins: [],
}