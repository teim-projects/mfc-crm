from django.urls import path
from .views import *
from .views import *

urlpatterns = [

    path(   "receipts/create/",   StudentReceiptCreateView.as_view()  ),

    path(     "receipts/",     StudentReceiptListView.as_view() ),

    path(   "receipts/<int:pk>/",   StudentReceiptDetailView.as_view() ),

    path(   "receipts/update/<int:pk>/",   StudentReceiptUpdateView.as_view() ),

    path(    "receipts/delete/<int:pk>/",    StudentReceiptDeleteView.as_view() ),


    path( "students-by-school/<int:school_id>/", StudentsBySchoolView.as_view()),


    path(  "invoice-documents/create/",  InvoiceDocumentCreateView.as_view()),

    path( "invoice-documents/",   InvoiceDocumentListView.as_view()  ),

    path(    "invoice-documents/<int:pk>/",      InvoiceDocumentDetailView.as_view()  ),

    path( "invoice-documents/update/<int:pk>/", InvoiceDocumentUpdateView.as_view()),

    path("invoice-documents/delete/<int:pk>/",InvoiceDocumentDeleteView.as_view()),

    path('invoice-pdf/<int:pk>/', generate_invoice_pdf, name='invoice-pdf'),
    path('invoice-download/<int:pk>/', download_invoice_pdf, name='invoice-download'),

]