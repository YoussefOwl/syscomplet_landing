<section class="my-4 container">
    <div class="section-title">
        <h2 class="fw-bold">NOS PARTENAIRES</h2>
        <p class="mb-3">Découvrez nos clients</p>
        @if (count($parenaires) == 0)
            <div class="d-flex justify-content-center mt-4">
                <b>Aucun partenaire.</b>
            </div>
        @else
            <div class="partenaires_carousel swiper">
                <div class="swiper-wrapper">
                    @foreach ($parenaires as $parenaire)
                        <div class="swiper-slide">
                            <div class="box p-2 rounded-2 m-4" style="text-align:center !important;">
                                <div class="img-box">
                                    <img src="{{ $parenaire->logo_partenaire }}" class=" p-3 shadow-sm rounded-2" alt="image de partenaire">
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    </div>
</section>