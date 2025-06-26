@section('title', 'TERMES ET CONDITIONS')
@extends('index')
@section('content')
    <main id="main" class="main_div">
        <section id="main_div" class="d-flex align-items-center main_div_pad">
            <div class="container">
                <div class="row">
                    <div
                        class="col d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0 order-2 order-lg-1">
                        <h1 class="fw-bold mb-4 text-center" style="color: #5894fb">TERMES ET CONDITIONS</h1>
                        <div>
                            {!!$contenu!!}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection
