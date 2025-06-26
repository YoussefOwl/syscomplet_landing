@section('title', 'À PROPOS DE NOUS')
@extends("index")
@section('content')
<div style="background: rgb(238, 238, 238)">
    <section class="mt-5">
        <div class="section-title mt-4 rounded-b-5 p-3 bg-white shadow-sm">
            <h2 class="fw-bold">DEMANDE DE DEMO</h2>
            <p class="mb-3">Remplissez ce formulaire et laissez votre demande pour obtenir un accès au système.</p>
        </div>
        <div class="mt-5 container shadow-sm rounded-lg p-4 bg-white">
            <form action="{{ route('demande_demo_store') }}" method="POST" >
                @csrf
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="name" class="form-label">Nom *</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="col-md-6">
                        <label for="phone" class="form-label">Téléphone *</label>
                        <input type="tel" class="form-control" id="phone" name="phone" required>
                    </div>
                    <div class="col-md-6">
                        <label for="company" class="form-label">Entreprise</label>
                        <input type="text" class="form-control" id="company" name="company">
                    </div>
                    <div class="col-12">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" id="message" name="message"></textarea>
                    </div>
                </div>
                <div class="w-full text-center mt-4">
                    <button type="submit" class="btn btn-primary">Envoyer la demande</button>
                </div>
            </form>

        </div>
    </section>
</div>
@endsection