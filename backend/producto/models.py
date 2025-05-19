from django.db import models
from tienda.models import Tienda


# Create your models here.
class Producto(models.Model):
    name = models.CharField(blank=False, null=False, max_length=240)
    description = models.CharField(blank=True, null=True, max_length=240)
    price = models.FloatField(blank=False, null=False, default=1)
    stock = models.PositiveIntegerField(default=0)
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='productos', blank=False, null=False)


    def __str__(self):
        return self.name