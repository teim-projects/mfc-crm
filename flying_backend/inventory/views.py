from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Product 
from .serializers import ProductSerializer



from .models import (
    Vendor,
    PurchaseOrder
)

from .serializers import (
    VendorSerializer,
    PurchaseOrderSerializer
)

# ✅ CREATE PRODUCT
class ProductCreateView(generics.CreateAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]


# ✅ ALL PRODUCTS
class ProductListView(generics.ListAPIView):

    queryset = Product.objects.all().order_by("-id")

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]


# ✅ SINGLE PRODUCT
class ProductDetailView(generics.RetrieveAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]


# ✅ UPDATE PRODUCT
class ProductUpdateView(generics.UpdateAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]


# ✅ DELETE PRODUCT
class ProductDeleteView(generics.DestroyAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]








# =====================================
# VENDOR
# =====================================

class VendorCreateView(generics.CreateAPIView):

    queryset = Vendor.objects.all()

    serializer_class = VendorSerializer

    permission_classes = [IsAuthenticated]


class VendorListView(generics.ListAPIView):

    queryset = Vendor.objects.all().order_by("-id")

    serializer_class = VendorSerializer

    permission_classes = [IsAuthenticated]


class VendorDetailView(generics.RetrieveAPIView):

    queryset = Vendor.objects.all()

    serializer_class = VendorSerializer

    permission_classes = [IsAuthenticated]


class VendorUpdateView(generics.UpdateAPIView):

    queryset = Vendor.objects.all()

    serializer_class = VendorSerializer

    permission_classes = [IsAuthenticated]


class VendorDeleteView(generics.DestroyAPIView):

    queryset = Vendor.objects.all()

    serializer_class = VendorSerializer

    permission_classes = [IsAuthenticated]


# =====================================
# PURCHASE ORDER
# =====================================

class PurchaseOrderCreateView(
    generics.CreateAPIView
):

    queryset = PurchaseOrder.objects.all()

    serializer_class = PurchaseOrderSerializer

    permission_classes = [IsAuthenticated]


class PurchaseOrderListView(
    generics.ListAPIView
):

    queryset = PurchaseOrder.objects.all().order_by("-id")

    serializer_class = PurchaseOrderSerializer

    permission_classes = [IsAuthenticated]


class PurchaseOrderDetailView(
    generics.RetrieveAPIView
):

    queryset = PurchaseOrder.objects.all()

    serializer_class = PurchaseOrderSerializer

    permission_classes = [IsAuthenticated]


class PurchaseOrderUpdateView(
    generics.UpdateAPIView
):

    queryset = PurchaseOrder.objects.all()

    serializer_class = PurchaseOrderSerializer

    permission_classes = [IsAuthenticated]


class PurchaseOrderDeleteView(
    generics.DestroyAPIView
):

    queryset = PurchaseOrder.objects.all()

    serializer_class = PurchaseOrderSerializer

    permission_classes = [IsAuthenticated]    







from .models import (
    GRN
)

from .serializers import (
    GRNSerializer
)

# =====================================
# CREATE GRN
# =====================================

class GRNCreateView(
    generics.CreateAPIView
):

    queryset = GRN.objects.all()

    serializer_class = GRNSerializer

    permission_classes = [IsAuthenticated]


# =====================================
# ALL GRN
# =====================================

class GRNListView(
    generics.ListAPIView
):

    queryset = GRN.objects.all().order_by("-id")

    serializer_class = GRNSerializer

    permission_classes = [IsAuthenticated]


# =====================================
# SINGLE GRN
# =====================================

class GRNDetailView(
    generics.RetrieveAPIView
):

    queryset = GRN.objects.all()

    serializer_class = GRNSerializer

    permission_classes = [IsAuthenticated]


# =====================================
# UPDATE GRN
# =====================================

class GRNUpdateView(
    generics.UpdateAPIView
):

    queryset = GRN.objects.all()

    serializer_class = GRNSerializer

    permission_classes = [IsAuthenticated]


# =====================================
# DELETE GRN
# =====================================

class GRNDeleteView(
    generics.DestroyAPIView
):

    queryset = GRN.objects.all()

    serializer_class = GRNSerializer

    permission_classes = [IsAuthenticated]
