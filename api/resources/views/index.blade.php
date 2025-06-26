<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Syscomplet | @yield('title', "Point of Sale Solutions for Your Business")</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="description"
        content="Explore our POS solutions: advanced point of sale systems, inventory management, and payment processing. Enhance your business operations with reliable and efficient POS systems tailored to your needs.">
    <meta name="keywords"
        content="POS systems, point of sale, inventory management, payment processing, business solutions, retail POS, restaurant POS, efficient POS systems, business operations, sales management">
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.syscomplet.ma/">
    <meta property="twitter:title"
        content="POS Systems | Point of Sale Solutions for Your Business">
    <meta property="twitter:description"
        content="Enhance your business operations with our advanced POS solutions: point of sale systems, inventory management, and payment processing. Reliable and efficient systems tailored to your needs.">
    <meta property="twitter:image" content="{{ asset('favicon.ico') }}">
    <link rel="canonical" href="https://www.syscomplet.ma/">
    <!-- Favicons -->
    <link href="{{ asset('favicon.ico') }}" rel="icon">
    <link href="{{ asset('favicon.ico') }}" rel="apple-touch-icon">
    <!-- Vendor CSS Files -->
    <link href="{{ asset('assets/vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/boxicons/css/boxicons.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/swiper/swiper-bundle.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/animate.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/sweetalert2.min.css') }}" rel="stylesheet">
    <!-- Template Main CSS File -->
    <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    {{-- jquery --}}
    <script src="{{ asset('assets/vendor/jquery.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</head>
<body>
    @include('layout.navbar')
    @yield('content')
    @include('layout.footer')
</body>
@yield('script')
<script src="{{ asset('assets/vendor/bootstrap/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('assets/vendor/swiper/swiper-bundle.min.js') }}"></script>
<script src="{{ asset('assets/vendor/sweetalert2@11.min.js') }}"></script>
<!-- Template Main JS File -->
<script src="{{ asset('assets/js/script_main.js') }}"></script>
</html>
