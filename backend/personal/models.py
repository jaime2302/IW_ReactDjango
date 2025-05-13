from django.db import models

# Create your models here.
from tienda.models import Tienda

class Personal(models.Model):
    nombre = models.CharField(max_length=255)
    dni = models.CharField(max_length=255)
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='empleados')

    def __str__(self):
        return f"{self.nombre} ({self.dni})"
