from django.db import models
from user.models import User

# Create your models here.
class Sede(models.Model):
    name = models.CharField(blank=False, null=False, max_length=240)
    description = models.CharField(blank=True, null=True, max_length=240)

    def __str__(self):
        return self.name