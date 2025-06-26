<div class="shadow-lg py-3">
    <div class="container" id="services">
        <div class="section-title my-5">
            <h2 class="fw-bold">NOS SERVICES</h2>
            <p class="mb-3">Découvrez nos services et explorez les solutions adaptées à vos besoins.</p>
        </div>
        <div class="row mt-4 animate__animated animate__fadeIn animate__delay">
            @foreach ($header->filter(function ($item) {
                return isset($item->html_id) && preg_match('/^bloc_\d+_app_desc$/', $item->html_id);
            }) as $item)
                @if (!$item->description_fr)
                    @continue
                @endif
                <div class="text-center p-2 col col-sm-6 col-md-4 col-lg-3">
                    <div class="d-flex flex-column align-items-center">
                        <img src="{{ $item->image }}"
                            style="color: rgb(173, 173, 173) !important; height: 150px !important; width: 150px !important; object-fit: contain;"
                            class="{{ $item->class }}">
                        <div style="max-width:100%;" class="fw-bold text-center mt-3">
                            {!! $item->description_fr !!}
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
