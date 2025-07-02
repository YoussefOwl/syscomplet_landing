@extends('index')
@section('content')
    @include('body.sections.header')
    <main id="main">
        @include('body.sections.servises')
        {{-- @include('body.sections.partenaires') --}}
        <div style="background: rgb(238, 238, 238)">
            @include('body.sections.modules')
        </div>
        <div class="text-center b-wayvy p-4" style="background: rgb(238, 238, 238); height: 40vh;">
            <a href="{{route('articles')}}" class="btn  rounded-5" style="background: #5894fb !important;">
                <b class="text-white">Voir tous les modules</b>
            </a>
        </div>
        @include('body.sections.avantages')
        @include('body.sections.materierls')
    </main>
@endsection