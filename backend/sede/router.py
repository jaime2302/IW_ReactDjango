from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *


# Creating a new router object.
routerSedes = DefaultRouter()
# Registering the viewset to the router.
routerSedes.register(prefix="sede", basename="sede", viewset=SedeView)
