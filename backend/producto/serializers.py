from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Producto 
        fields = ('pk', 'idUser', 'name', 'description', 'price')
        
        def create(self, validated_data):
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user and request.user.is_authenticated:
                validated_data['idUser'] = request.user
                return super().create(validated_data)