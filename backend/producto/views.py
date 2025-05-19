from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Producto
from .serializers import ProductoSerializer


@api_view(["GET", "POST"])
def producto_list(request):
    if request.method == "GET":
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda el producto en la base de datos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def producto_detail(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ProductoSerializer(producto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def marketplace_list(request):
    productos = Producto.objects.filter(stock__gt=0)  # Solo productos con stock
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)


# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


@api_view(["POST"])
def reservar_stock(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(
            {"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    cantidad = request.data.get("cantidad", 1)

    if not isinstance(cantidad, int) or cantidad <= 0:
        return Response(
            {"error": "Cantidad inválida"}, status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        # Bloquea el registro para evitar condiciones de carrera
        producto = Producto.objects.select_for_update().get(pk=pk)

        if producto.stock < cantidad:
            return Response(
                {"error": f"Stock insuficiente. Disponible: {producto.stock}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        producto.stock -= cantidad
        producto.save()

        # Aquí podrías crear un registro de reserva si lo necesitas
        # Reserva.objects.create(...)

        return Response(
            {
                "success": True,
                "nuevo_stock": producto.stock,
                "producto": ProductoSerializer(producto).data,
            }
        )


@api_view(["POST"])
def liberar_stock(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(
            {"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    cantidad = request.data.get("cantidad", 1)

    if not isinstance(cantidad, int) or cantidad <= 0:
        return Response(
            {"error": "Cantidad inválida"}, status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        producto = Producto.objects.select_for_update().get(pk=pk)
        producto.stock += cantidad
        producto.save()

        return Response(
            {
                "success": True,
                "nuevo_stock": producto.stock,
                "producto": ProductoSerializer(producto).data,
            }
        )


@api_view(["POST"])
def confirmar_compra(request):
    productos_data = request.data.get("productos", [])
    if not isinstance(productos_data, list):
        return Response(
            {"error": "Formato de datos inválido"}, status=status.HTTP_400_BAD_REQUEST
        )

    productos_actualizados = []

    try:
        with transaction.atomic():
            for item in productos_data:
                pk = item.get("pk")
                cantidad = item.get("stock", 1)

                if not pk or not isinstance(cantidad, int) or cantidad <= 0:
                    return Response(
                        {"error": "Datos inválidos en la lista de productos"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                producto = Producto.objects.select_for_update().get(pk=pk)

                if producto.stock < cantidad:
                    return Response(
                        {
                            "error": f"Stock insuficiente para {producto.name}. Disponible: {producto.stock}"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                producto.stock -= cantidad
                producto.save()
                productos_actualizados.append(ProductoSerializer(producto).data)

        return Response(
            {
                "success": True,
                "productosActualizados": [
                    ProductoSerializer(producto).data
                    for producto in Producto.objects.all()
                ],
            }
        )

    except Producto.DoesNotExist:
        return Response(
            {"error": "Uno de los productos no fue encontrado"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
