# user/auth_backends.py

from jose import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import User

class Auth0JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get("Authorization", None)
        if not auth:
            return None

        parts = auth.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            raise AuthenticationFailed("Invalid Authorization header")

        token = parts[1]
        try:
            payload = jwt.decode(
                token,
                settings.AUTH0_PUBLIC_KEY,
                algorithms=['RS256'],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/"
            )
        except Exception as e:
            raise AuthenticationFailed(f"Token decoding error: {str(e)}")

        auth0_id = payload.get('sub')
        if not auth0_id:
            raise AuthenticationFailed("Invalid token: missing subject")

        user, _ = User.objects.get_or_create(auth0_id=auth0_id, defaults={
            "username": auth0_id.replace('|', '_')
        })

        return (user, None)
