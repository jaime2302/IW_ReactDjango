from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.decorators import authentication_classes
from rest_framework.decorators import api_view
from rest_framework import status

from user.auth_backends import Auth0JWTAuthentication

from .models import User
from .serializers import *

@api_view(['GET'])
@authentication_classes([Auth0JWTAuthentication])
@permission_classes([IsAuthenticated])
def Users_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def Users_detail(request, pk):
    user_obj = get_object_or_404(User, pk=pk)
    
    # Solo el propio usuario o un admin puede modificar/eliminar
    if request.user != user_obj and not request.user.is_staff:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = UserSerializer(user_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)