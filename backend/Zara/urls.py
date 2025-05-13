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
    re_path(r'user/$', userViews.Users_list),
    re_path(r'user/([0-9])$', userViews.Users_detail),
    # Productos
    re_path(r'producto/', productoViews.producto_list),
    re_path(r'producto/([0-9])$', productoViews.producto_detail),
    # Sedes
    re_path(r'sede/', sedeViews.sede_list),
    re_path(r'sede/([0-9])$', sedeViews.sede_detail),
    # Tienda
    re_path(r'tienda/', tiendaViews.tienda_list),
    re_path(r'tienda/([0-9])$', tiendaViews.tienda_detail),
    # Personal
    re_path('personal/', personalViews.personal_list),
    re_path('personal/([0-9])$', personalViews.personal_detail),
]