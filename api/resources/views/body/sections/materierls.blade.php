<div class="container mb-4" id="services">
    <div class="section-title my-4">
        <h2 class="fw-bold">COMPATIBLE AVEC VOS APPAREILS ET NAVIGATEURS</h2>
        <p>Compatibles avec tous les appareils utilisant les navigateurs suivants.</p>
    </div>
    <div class="row mt-4 animate__animated animate__fadeIn animate__delay">
        @foreach ($supportedDevises as $item)
            <div class="text-center p-2 col">
                <div class="d-flex flex-column align-items-center">
                    <img src="{{ $item->image_marque }}" alt="{{ $item->description }}"
                        style="color: rgb(173, 173, 173) !important; height: 200px !important; width: 200px !important; object-fit: contain">
                </div>
            </div>
        @endforeach
    </div>
</div>
