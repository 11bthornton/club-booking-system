const mix = require('laravel-mix');
require('tailwindcss');

mix.js('resources/js/app.js', 'public/js')
   .postCss('resources/css/app.css', 'public/css', [
      require('tailwindcss'),
   ]);

if (mix.inProduction()) {
    mix.version();
 } else {
    mix.sourceMaps().hot();
 }

 mix.browserSync('127.0.0.1:8000')