from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *


# Creating a new router object.
routerProductos = DefaultRouter()
# Registering the viewset to the router.
routerProductos.register(prefix="producto", basename="producto", viewset=ProductoView)
