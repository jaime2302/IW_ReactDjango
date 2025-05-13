from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Tienda
from .serializers import TiendaSerializer

@api_view(['GET', 'POST'])
def tienda_list(request):
    if request.method == 'GET':
        data = Tienda.objects.all()
        serializer = TiendaSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TiendaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def tienda_detail(request, pk):
    try:
        tienda = Tienda.objects.get(pk=pk)
    except Tienda.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TiendaSerializer(tienda)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TiendaSerializer(tienda, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)  # Mejor devolver los datos actualizados
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        tienda.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


