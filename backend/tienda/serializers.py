from rest_framework import serializers
from .models import Tienda

class TiendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tienda
        fields = ('pk', 'ciudad', 'direccion', 'cp')