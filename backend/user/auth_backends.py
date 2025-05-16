from jose import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import User

class Auth0JWTAuthentication(BaseAuthentication):
    
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return None

        try:
            scheme, token = auth_header.split()
        except ValueError:
            raise AuthenticationFailed("Invalid Authorization header. Format: 'Bearer <token>'")

        if scheme.lower() != "bearer":
            raise AuthenticationFailed("Authorization header must start with 'Bearer'")

        try:
            payload = jwt.decode(
                token,
                settings.AUTH0_PUBLIC_KEY,
                algorithms=['RS256'],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/"
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.JWTClaimsError as e:
            raise AuthenticationFailed(f"Invalid claims: {str(e)}")
        except Exception as e:
            raise AuthenticationFailed(f"Token verification failed: {str(e)}")

        auth0_id = payload.get('sub')
        email = payload.get('email', '').lower()
        name = payload.get('name', '')
        
        if not auth0_id:
            raise AuthenticationFailed("Token missing required 'sub' claim")
        if not email:
            raise AuthenticationFailed("Token missing required 'email' claim")

        user, created = User.objects.get_or_create(
            auth0_id=auth0_id,
            defaults={
                'email': email,
                'name': name,
            }
        )
        
        if not created:
            update_fields = []
            if user.email != email:
                user.email = email
                update_fields.append('email')
            if user.name != name and name:
                user.name = name
                update_fields.append('name')
                
            if update_fields:
                user.save(update_fields=update_fields)

        return (user, None)