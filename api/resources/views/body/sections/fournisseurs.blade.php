<section class="my-4 container" id="partenaires">
    <div class="section-title my-4">
        <h2 class="fw-bold">NOS FOURNISSEURS</h2>
        <p class="mb-3">Découvrez nos fournisseurs de confiance qui nous aident à vous offrir les meilleurs produits et services.</p>
        @if (count($fournisseurs) == 0)
            <div class="d-flex justify-content-center mt-4">
                <b>Aucun fournisseur.</b>
            </div>
        @else
            <div class="partenaires_carousel swiper">
                <div class="swiper-wrapper">
                    @foreach ($fournisseurs as $fournisseur)
                        <div class="swiper-slide">
                            <div class="box p-2 rounded-2 m-4" style="text-align:center !important;">
                                <div class="img-box">
                                    <img src="{{ $fournisseur->image_fournisseur }}" class="p-3 shadow-sm rounded-2" alt="image de fournisseur">
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    </div>
</section>