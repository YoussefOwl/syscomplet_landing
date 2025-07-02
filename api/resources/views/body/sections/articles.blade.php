<section class="mt-5">
    <div class="section-title mt-4 rounded-b-5 p-3 bg-white shadow-lg">
        <h2 class="fw-bold">SOLUTIONS</h2>
        <p class="mb-3">Découvrez les différents modules que notre système vous offre</p>
    </div>
    @if (count($articles) == 0)
        <div class="d-flex justify-content-center mt-4">
            <b>Aucun article.</b>
        </div>
    @else
        <div class="tw-grid tw-grid-cols-1 tw-sm:grid-cols-2 tw-md:grid-cols-2 tw-lg:grid-cols-2 tw-gap-4 text-center p-2">
            @foreach ($articles as $index=>$item)
                @if(($index+1) % 2 != 0)
                    <div class="scroll-fide tw-box rounded-2 d-flex align-items-center" style="height: 100%;">
                        <div class="p-4 bg-white rounded-start-5 rounded-bottom-5 shadow-lg" style="text-align: justify !important; line-height: 2 !important; color: #4c4c4c !important;">
                            <h2 class="mb-2" style="color: #5894fb; text-align: unset !important;">{{$item->libelle_article}}</h2>
                            <div>
                                <b>
                                    {{$item->description}}
                                </b>
                            </div>
                        </div>
                    </div>
                @endif
                <div class="tw-box">
                    <div class="scroll-fide d-flex flex-column align-items-center">
                        <img src="{{ $item->image_article }}" class="rounded-2"
                            style="color: rgb(173, 173, 173) !important; height: 100% !important; width: 100% !important">
                    </div>
                </div>
                @if(($index+1) % 2 == 0)
                    <div class="scroll-fide tw-box rounded-2 d-flex align-items-center" style="height: 100%;">
                        <div class="p-4 bg-white rounded-end-5 rounded-bottom-5 shadow-lg" style="text-align: justify !important; line-height: 2 !important; color: #4c4c4c !important; background-color: rgb(243, 243, 243) !important;">
                            <h2 class="mb-2" style="color: #5894fb; text-align: unset !important;">{{$item->libelle_article}}</h2>
                            <div>
                                <b>
                                    {{$item->description}}
                                </b>
                            </div>
                        </div>
                    </div>
                @endif
            @endforeach
        </div>
    @endif
    <div class="section-title mt-4 rounded-b-5 p-3 bg-white">
        <h2 class="fw-bold">DÉVELOPPEMENT SPÉCIFIQUE</h2>
        <div class="scroll-fide tw-box rounded-2 d-flex justify-content-end align-items-center">
            <div class="p-4 bg-white rounded-start-5 rounded-top-5 shadow-lg col-lg-6 col-md-12 col-sm-12">
                <b>
                    {!!$contenusPage->where('html_id',"desc_block_developpement_specifique")->value('description_fr')!!}
                </b>
            </div>
        </div>
    </div>
</section>
