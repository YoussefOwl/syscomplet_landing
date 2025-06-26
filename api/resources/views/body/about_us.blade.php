@section('title', 'À PROPOS DE NOUS')
@extends("index")
@section('content')
    <main id="main" class="main_div mt-5 p-2">
        <!-- ======= Details Section ======= -->
        <section id="details" class="details ">
            <div class="container p-2 rounded-2">
                <div class="section-title">
                    <h1 class="fw-bold" style="color: #5894fb" >À PROPOS DE NOUS</h1>
                    <p id="contenu_nos_services_desc">
                        {!!$body?->contenu_nos_services_desc!!}
                    </p>
                </div>
                <div class="row content">
                    <div class="col-md-4">
                        <img src="assets/img/1.svg" class="img-fluid" alt="image domotique">
                    </div>
                    <div class="col-md-8 pt-4">
                        <h3 id="title_notre_histoire" style="color: #5894fb" class="center_it">NOTRE HISTOIRE</h3>
                        <p id="contenu_notre_histoire" class="center_it">
                            {!!$body?->contenu_notre_histoire!!}
                        </p>
                        <ul class="center_it">
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="detail_1_notre_histoire" style="font-size: 14.5px;">
                                    {!!$body?->detail_1_notre_histoire!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="detail_2_notre_histoire" style="font-size: 14.5px;">
                                    {!!$body?->detail_2_notre_histoire!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="detail_3_notre_histoire" style="font-size: 14.5px;">
                                    {!!$body?->detail_3_notre_histoire!!}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row content">
                    <div class="col-md-4 order-1 order-md-2">
                        <img src="assets/img/2.svg" class="img-fluid" alt="image sécurité maison">
                    </div>
                    <div class="col-md-8 pt-5 order-2 order-md-1">
                        <h3 style="color: #5894fb;" class="center_it">ENGAGEMENT ENVERS LA QUALITÉ</h3>
                        <p id="engagement_qte_1" class="center_it">
                            {!!$body?->engagement_qte_1!!}
                        </p>
                        <ul class="center_it">
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="engagement_qte_2">
                                    {!!$body?->engagement_qte_2!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="engagement_qte_3">
                                    {!!$body?->engagement_qte_3!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="engagement_qte_4">
                                    {!!$body?->engagement_qte_4!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="engagement_qte_5">
                                    {!!$body?->engagement_qte_5!!}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row content">
                    <div class="col-md-4">
                        <img src="assets/img/3.svg" class="img-fluid" alt="image solutions domotiques">
                    </div>
                    <div class="col-md-8 pt-5 center_it">
                        <h3 style="color: #5894fb;margin-bottom: 20px;">L'ÉQUIPE DERRIÈRE NOS SOLUTIONS</h3>
                        <ul class="center_it">
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_equipe_1">
                                    {!!$body?->text_equipe_1!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_equipe_2">
                                    {!!$body?->text_equipe_2!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_equipe_3">
                                    {!!$body?->text_equipe_3!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_equipe_4">
                                    {!!$body?->text_equipe_4!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_equipe_5">
                                    {!!$body?->text_equipe_5!!}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row content">
                    <div class="col-md-4 order-1 order-md-2">
                        <img src="assets/img/4.svg" class="img-fluid" alt="image sécurité maison">
                    </div>
                    <div class="col-md-8 pt-5 order-2 order-md-1 center_it">
                        <h3 style="color: #5894fb;">RESPONSABILITÉ SOCIALE</h3>
                        <p id="text_resp_soc_1" class="center_it">
                            {!!$body?->text_resp_soc_1!!}
                        </p>
                        <p id="text_resp_soc_2" class="center_it">
                            {!!$body?->text_resp_soc_2!!}
                        </p>
                        <ul class="center_it">
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_resp_soc_3">
                                    {!!$body?->text_resp_soc_3!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_resp_soc_4">
                                    {!!$body?->text_resp_soc_4!!}
                                </span>
                            </li>
                            <li class="mb-4">
                                <i class='bx bxs-badge-check'></i>
                                <span id="text_resp_soc_5">
                                    {!!$body?->text_resp_soc_5!!}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <!-- End Details Section -->
    </main>
@endsection