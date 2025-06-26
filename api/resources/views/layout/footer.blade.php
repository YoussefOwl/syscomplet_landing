<!-- Start Footer -->
<footer id="footer" >
    <div class="footer-newsletter" id="contact">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <h4>REJOIGNEZ NOTRE BULLETIN D'INFORMATION</h4>
                    <p id="desc_newsleter">Abonnez-vous à notre newsletter pour recevoir en exclusivité des offres
                        spéciales</p>
                    <form id="newsletter_from">
                        <input type="email" name="email" id="email-news" style="outline: unset !important;"><input
                            id="send-news" type="submit" value="S'abonner">
                    </form>
                    <div class="my-3" id="newsletter_msg">
                        <div class="error-message" id="error-message-news"></div>
                        <div class="sent-message" id="sent-message-news">Merci d'avoir rejoint notre bulletin
                            d'information</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-top">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 footer-contact">
                    <img src="assets/img/logo.svg" class="logo image_main_logo" width="200" alt="image du logo">
                    <br>
                    <br>
                    <p>
                        <strong style="margin-right: 10px;">ADRESSE :</strong><span id="footer_adresse">{!! $footer->where('html_id', 'footer_adresse')->value('description_fr') !!}</span>
                        <br>
                        <strong style="margin-right: 10px;">TÉLÉPHONE :</strong>
                        <a href="tel:{!! preg_replace('/<[^>]*>/', '',$footer->where('html_id', 'footer_phone')->value('description_fr')) !!}" target="_blank"
                            style="letter-spacing: 2px;">
                            {!! $footer->where('html_id', 'footer_phone')->value('description_fr') !!}
                        </a>
                        <br>
                        <strong style="margin-right: 10px;">WATHSAPP :</strong>
                        <a id="footer_phone" href="https://wa.me/{!! preg_replace('/<[^>]*>/', '',$footer->where('html_id', 'footer_phone')->value('description_fr')) !!}?text={{ urlencode('Bonjour, je souhaite en savoir plus sur vos services.') }}" target="_blank"
                            style="letter-spacing: 2px;">
                            {!! $footer->where('html_id', 'footer_phone')->value('description_fr') !!}
                        </a>
                        <br>
                        <strong style="margin-right: 10px;">EMAIL :</strong>
                        <a style="letter-spacing: 2px;"
                            id="footer_mail" href="mailto:{!! preg_replace('/<[^>]*>/', '', $footer->where('html_id', 'footer_mail')->value('description_fr')) !!}">
                            {!! $footer->where('html_id', 'footer_mail')->value('description_fr') !!}
                        </a>
                    </p>
                </div>
                <div class="col-lg-4 col-md-6 footer-links">
                    <h4>LIENS UTILES</h4>
                    <ul>
                        <li><i class="bx bx-chevron-right"></i> 
                            <a 
                                href="https://wa.me/{!! preg_replace('/<[^>]*>/', '',$footer->where('html_id', 'footer_phone')->value('description_fr')) !!}?text={{ urlencode('Bonjour, je souhaite en savoir plus sur vos services.') }}" 
                                target="_blank">CONTACTEZ-NOUS
                            </a>
                        </li>
                        <li><i class="bx bx-chevron-right"></i> <a href="#services">NOS SERVICES</a></li>
                        <li><i class="bx bx-chevron-right"></i> <a href="{{route('about-us')}}">À PROPOS DE NOUS</a></li>
                        <li><i class="bx bx-chevron-right"></i> <a href="{{route('politiques')}}">POLITIQUE DE
                                CONFIDENTIALITÉ</a></li>
                        <li><i class="bx bx-chevron-right"></i> <a href="{{route('termes')}}">TERMES ET CONDITIONS</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 footer-links">
                    <h4>Nos réseaux socicaux</h4>
                    <p id="desc_reseaux_sociaux">
                        {!! $footer->where('html_id', 'desc_reseaux_sociaux')->value('description_fr') !!}
                    </p>
                    <div class="social-links mt-3">
                        <a href="{!! $footer->where('html_id', 'link_facebook')->value('autre') !!}" id="link_facebook" class="facebook"><i class="bx bxl-facebook"></i></a>
                        <a href="{!! $footer->where('html_id', 'link_instagram')->value('autre') !!}" id="link_instagram" class="instagram"><i class="bx bxl-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container py-4">
        <div class="copyright">
            &copy; <strong><span>SYSCOMPLET.COM</span></strong> .Tous droits réservés
        </div>
    </div>
</footer>