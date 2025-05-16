"""
URL configuration for Zara project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path

# Views
from user import views as userViews
from tienda import views as tiendaViews
from personal import views as personalViews
from producto import views as productoViews
from sede import views as sedeViews

from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView, SpectacularAPIView

from django.urls import path, include


urlpatterns = [
    # API Schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Swagger UI:
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Redoc UI:
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('admin/', admin.site.urls),
    # Usuario
    path(r'user/', userViews.Users_list),
    path(r'user/<int:pk>', userViews.Users_detail),
    # Productos
    path(r'producto/', productoViews.producto_list),
    path(r'producto/<int:pk>', productoViews.producto_detail),
    # Sedes
    path(r'sede/', sedeViews.sede_list),
    path(r'sede/<int:pk>', sedeViews.sede_detail),
    # Tienda
    path(r'tienda/', tiendaViews.tienda_list),
    path(r'tienda/<int:pk>', tiendaViews.tienda_detail),
    # Personal
    path(r'personal/', personalViews.personal_list),
    path(r'personal/<int:pk>/', personalViews.personal_detail),
]