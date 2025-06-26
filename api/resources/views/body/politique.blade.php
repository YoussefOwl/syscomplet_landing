@section('title', 'POLITIQUE DE CONFIDENTIALITÉ')
@extends('index')
@section('content')
    <main id="main" class="main_div mt-5 p-2">
        <section id="details" class="details">
            <div class="container">
                <div class="row">
                    <div
                        class="col d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0 order-2 order-lg-1">
                        <h1 class="fw-bold mb-4 text-center" style="color: #5894fb">NOTRE POLITIQUE CONFIDENTIALITÉ</h1>
                        {!! $contenu !!}
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection
