@section('title', 'DEMANDE DE DEMO')
@extends('index')
@section('content')
    <div style="background: rgb(238, 238, 238)">
        <section class="mt-5">
            <div class="section-title mt-4 rounded-b-5 p-3 bg-white shadow-sm">
                <h2 class="fw-bold">DEMANDE DE DEMO</h2>
                <p class="mb-3">Remplissez ce formulaire et laissez votre demande pour obtenir un accès au système.</p>
            </div>
            <div class="mt-5 container shadow-sm rounded-lg p-4 bg-white">
                @if (session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form action="{{ route('demande_demo_store') }}" method="POST">
                    @csrf
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="nom_demandeur" class="form-label">Nom *</label>
                            <input type="text" class="form-control" id="nom_demandeur" name="nom_demandeur" required>
                        </div>
                        <div class="col-md-6">
                            <label for="email_demandeur" class="form-label">Email *</label>
                            <input type="email" class="form-control" id="email_demandeur" name="email_demandeur" required>
                        </div>
                        <div class="col-md-6">
                            <label for="phone_demandeur" class="form-label">Téléphone *</label>
                            <input type="tel" class="form-control" id="phone_demandeur" name="phone_demandeur" required>
                        </div>
                        <div class="col-md-6">
                            <label for="entreprise_demandeur" class="form-label">Entreprise</label>
                            <input type="text" class="form-control" id="entreprise_demandeur" name="entreprise_demandeur">
                        </div>
                        <div class="col-12">
                            <label for="message_demandeur" class="form-label">Message</label>
                            <textarea class="form-control" id="message_demandeur" name="message_demandeur"></textarea>
                        </div>
                    </div>
                    <div class="w-full text-center mt-4">
                        <button type="submit" class="btn rounded-5" style="color: white; background: #5894fb">Envoyer la demande</button>
                    </div>
                </form>
            </div>
        </section>
    </div>
@endsection
