from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Product 
from .serializers import ProductSerializer
from .models import (
    Stock,
    StockTransaction
)

from .serializers import (
    StockSerializer,
    StockTransactionSerializer
)


from .models import (
    Vendor,
    PurchaseOrder,
    VendorDamagedStock
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


from .models import Stock
from .serializers import StockSerializer


class StockListView(
    generics.ListAPIView
):

    queryset = (
        Stock.objects
        .select_related(
            "product",
            "product__course"
        )
        .order_by(
            "product__product_name"
        )
    )

    serializer_class = (
        StockSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class StockTransactionListView(
    generics.ListAPIView
):

    queryset = (
        StockTransaction.objects
        .select_related("product")
        .order_by("-created_at")
    )

    serializer_class = (
        StockTransactionSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


from rest_framework.views import APIView
from rest_framework.response import Response

# class ProductReplacementView(APIView):

#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         data = []

#         stocks = (
#             Stock.objects
#             .select_related("product")
#             .filter(
#                 damaged_stock__gt=0
#             )
#         )

#         for stock in stocks:

#             data.append({
#                 "product_id": stock.product.id,
#                 "product_name": stock.product.product_name,
#                 "damaged_qty": stock.damaged_stock
#             })

#         return Response(data)


class VendorReplacementView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        vendor_id = request.GET.get(
            "vendor_id"
        )

        data = []

        replacements = (
            VendorDamagedStock.objects
            .filter(
                vendor_id=vendor_id
            )
        )

        for row in replacements:

            pending_qty = (
                row.total_damaged_qty -
                row.settled_qty
            )

            if pending_qty > 0:

                data.append({
                    "product_id":
                        row.product.id,

                    "product_name":
                        row.product.product_name,

                    "pending_qty":
                        pending_qty
                })

        return Response(data)

