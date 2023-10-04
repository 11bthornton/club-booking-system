import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
export default withMT(
    {
        content: [
            './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
            './storage/framework/views/*.php',
            './resources/views/**/*.blade.php',
            './resources/js/**/*.jsx',
            './node_modules/react-tailwindcss-datetimepicker/dist/react-tailwindcss-datetimepicker.js',
        ],
    
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                },
                backdropFilter: {
                    'none': 'none',
                    'blur': 'blur(20px)',
                },
            },
        },
    
        plugins: [forms],
    }
);
