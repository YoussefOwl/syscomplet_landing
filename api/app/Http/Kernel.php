<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\CorsPolicy::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
        'api' => [
            'throttle:1000,1', // limite à 1000 requêtes par minutes au maximum
            'bindings'
        ],
        'api_user' => [
            'throttle:250,1', // limite à 60 requêtes par minutes au maximum
            'bindings'
        ],
        'api_configurations' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_partenaire' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_newsletter' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_fournisseurs' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_articles' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_contact' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ],
        'api_marques' => [
            'throttle:250,1', // limite à 250 requêtes par minutes au maximum
            'bindings'
        ]
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'jwt.verify' => \App\Http\Middleware\JwtMiddlewareAdmin::class,
        'jwt.role' => \App\Http\Middleware\CheckRole::class,
        'jwt.auth' => \PHPOpenSourceSaver\JWTAuth\Http\Middleware\Authenticate::class,
        'jwt.refresh' => \PHPOpenSourceSaver\JWTAuth\Http\Middleware\RefreshToken::class
    ];

    /**
     * The priority-sorted list of middleware.
     *
     * This forces non-global middleware to always be in the given order.
     *
     * @var array
     */
    protected $middlewarePriority = [
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Auth\Middleware\Authorize::class
    ];
}
