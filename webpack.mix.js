const mix = require('laravel-mix');

mix.js('api/public/assets/js/script_main.js', 'api/public/assets/js')
   .setPublicPath('api/public/assets');
