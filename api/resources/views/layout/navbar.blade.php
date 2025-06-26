<header id="header" class="fixed-top header-transparent">
    <div class="container d-flex align-items-center justify-content-between">
        <div class="logo">
            <a href="{{route('landing-page')}}"><img src="assets/img/logo.svg" class="logo image_main_logo" alt="image du logo">
            </a>
        </div>
        <nav class="navbar" id="navbar">
            <ul class="navbar-mobile">
                <li>
                    <a class="nav-link scrollto {{ Request::is('/') ? 'active' : '' }}" href="{{route('landing-page')}}">ACCUEIL</a>
                </li>
                <li><a class="nav-link scrollto" href="{{route('landing-page')}}/#services">NOS SERVICES</a></li>
                <li><a class="nav-link scrollto {{ Request::is('articles') ? 'active' : '' }}" href="{{route('articles')}}">NOTRE SOLUTION</a></li>
                <li><a class="nav-link scrollto" href="https://wa.me/{!! preg_replace('/<[^>]*>/', '',$footer->where('html_id', 'footer_phone')->value('description_fr')) !!}?text={{ urlencode('Bonjour, je souhaite en savoir plus sur vos services.') }}" target="_blank">CONTACTEZ-NOUS</a></li>
                @if(!Request::is('demande-demo'))
                    <li><a class="nav-link scrollto rounded-5 p-2 centrelized-bg text-white" href="{{route('demande-demo')}}" target="_blank">Demander votre demo</a></li>
                @endif
            </ul>
        </nav>
        <i class="mobile-nav-toggle bx bx-list-ul"></i>
        <!-- navbar -->
    </div>
</header>