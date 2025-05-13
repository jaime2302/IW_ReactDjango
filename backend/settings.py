AUTH_USER_MODEL = 'user.User'
AUTH0_DOMAIN = 'dev-qqy3li4raskiurkt.us.auth0.com'
AUTH0_AUDIENCE = 'https://dev-qqy3li4raskiurkt.us.auth0.com/api/v2/'
AUTH0_PUBLIC_KEY = """-----BEGIN CERTIFICATE-----
TU_CERTIFICADO_PUBLICO
-----END CERTIFICATE-----"""
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'user.auth_backends.Auth0JWTAuthentication',
    ),
}

