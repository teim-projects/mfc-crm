from django.urls import path
from .views import *

urlpatterns = [

    path(
        "receipts/create/",
        StudentReceiptCreateView.as_view()
    ),

    path(
        "receipts/",
        StudentReceiptListView.as_view()
    ),

    path(
        "receipts/<int:pk>/",
        StudentReceiptDetailView.as_view()
    ),

    path(
        "receipts/update/<int:pk>/",
        StudentReceiptUpdateView.as_view()
    ),

    path(
        "receipts/delete/<int:pk>/",
        StudentReceiptDeleteView.as_view()
    ),


    path(
    "students-by-school/<int:school_id>/",
    StudentsBySchoolView.as_view()
),
]