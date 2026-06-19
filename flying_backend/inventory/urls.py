from django.urls import path

from .views import *

urlpatterns = [

    # ✅ CREATE
    path( "products/create/", ProductCreateView.as_view()),

    # ✅ ALL PRODUCTS
    path("products/",  ProductListView.as_view()),

    # ✅ SINGLE PRODUCT
    path("products/<int:pk>/",ProductDetailView.as_view()),

    # ✅ UPDATE
    path("products/update/<int:pk>/",  ProductUpdateView.as_view()),

    # ✅ DELETE
    path("products/delete/<int:pk>/",ProductDeleteView.as_view()),


    path("vendors/create/", VendorCreateView.as_view()),
    path("vendors/", VendorListView.as_view()),
    path("vendors/<int:pk>/", VendorDetailView.as_view()),
    path("vendors/update/<int:pk>/", VendorUpdateView.as_view()),
    path("vendors/delete/<int:pk>/", VendorDeleteView.as_view()),
    
    path("po/create/", PurchaseOrderCreateView.as_view()),
    path("po/", PurchaseOrderListView.as_view()),
    path("po/<int:pk>/", PurchaseOrderDetailView.as_view()),
    path("po/update/<int:pk>/", PurchaseOrderUpdateView.as_view()),
    path("po/delete/<int:pk>/", PurchaseOrderDeleteView.as_view()),

    path("grn/create/", GRNCreateView.as_view()),
    path("grn/", GRNListView.as_view()),
    path("grn/<int:pk>/", GRNDetailView.as_view()),
    path("grn/update/<int:pk>/", GRNUpdateView.as_view()),
    path("grn/delete/<int:pk>/", GRNDeleteView.as_view()),
    path("stock/",StockListView.as_view()),
    path( "stock-transactions/", StockTransactionListView.as_view()),
    path("vendor-replacements/",VendorReplacementView.as_view()),
    path('po-pdf/<int:pk>/', generate_po_pdf, name='po-pdf'),
    path('po-download/<int:pk>/', download_po_pdf, name='po-download'),
    
    

    

]