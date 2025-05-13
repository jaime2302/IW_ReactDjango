from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Sede
from .serializers import SedeSerializer

@api_view(['GET', 'POST'])
def sede_list(request):
    if request.method == 'GET':
        data = Sede.objects.all()
        serializer = SedeSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SedeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def sede_detail(request, pk):
    try:
        sede = Sede.objects.get(pk=pk)
    except Sede.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = SedeSerializer(sede, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        sede.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
