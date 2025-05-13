from django.db import models

# Create your models here.
class Tienda(models.Model):
    ciudad = models.CharField(max_length=255, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    cp = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.ciudad} - {self.direccion}"
