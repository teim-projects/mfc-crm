from django.shortcuts import render

from django.shortcuts import render, get_object_or_404  # Add get_object_or_404 here
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from weasyprint import HTML  # Add this import
# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import (
    StudentReceipt
)

from .serializers import (
    StudentReceiptSerializer
)



class StudentReceiptCreateView(
    generics.CreateAPIView
):

    queryset = (
        StudentReceipt.objects.all()
    )

    serializer_class = (
        StudentReceiptSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

class StudentReceiptListView(
    generics.ListAPIView
):

    queryset = (
        StudentReceipt.objects
        .all()
        .order_by("-id")
    )

    serializer_class = (
        StudentReceiptSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]



class StudentReceiptDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        StudentReceipt.objects.all()
    )

    serializer_class = (
        StudentReceiptSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class StudentReceiptUpdateView(
    generics.UpdateAPIView
):

    queryset = (
        StudentReceipt.objects.all()
    )

    serializer_class = (
        StudentReceiptSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class StudentReceiptDeleteView(
    generics.DestroyAPIView
):

    queryset = (
        StudentReceipt.objects.all()
    )

    serializer_class = (
        StudentReceiptSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]    



from info.models import Student
from rest_framework.views import APIView
from rest_framework.response import Response


from billing.models import StudentReceipt
from info.models import Student

# 📑 File: views.py (Update the view at the bottom)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from info.models import Student


class StudentsBySchoolView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, school_id):

        students = (
            Student.objects
            .select_related(
                "course",
                "course__course_type",
                "course__level"
            )
            .filter(
                school_id=school_id
            )
            .order_by("student_name")
        )

        data = []

        for student in students:

            data.append({
                "id": student.id,
                "student_name": student.student_name,
                "parent_name": student.parent_name,
                "parent_contact": student.parent_contact,

                "course": (
                    student.course.id
                    if student.course
                    else None
                ),

                "course_name": (
                    student.course.course_type.name
                    if student.course
                    else ""
                ),

                "level": (
                    student.course.level.level_name
                    if student.course
                    else ""
                ),
            })

        return Response(data)




from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import (
    InvoiceDocument
)

from .serializers import (
    InvoiceDocumentSerializer
)


class InvoiceDocumentCreateView(
    generics.CreateAPIView
):

    queryset = (
        InvoiceDocument.objects.all()
    )

    serializer_class = (
        InvoiceDocumentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class InvoiceDocumentListView(
    generics.ListAPIView
):

    queryset = (
        InvoiceDocument.objects
        .select_related(
            "school"
        )
        .prefetch_related(
            "items"
        )
        .order_by("-id")
    )

    serializer_class = (
        InvoiceDocumentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class InvoiceDocumentDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        InvoiceDocument.objects.all()
    )

    serializer_class = (
        InvoiceDocumentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class InvoiceDocumentUpdateView(
    generics.UpdateAPIView
):

    queryset = (
        InvoiceDocument.objects.all()
    )

    serializer_class = (
        InvoiceDocumentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class InvoiceDocumentDeleteView(
    generics.DestroyAPIView
):

    queryset = (
        InvoiceDocument.objects.all()
    )

    serializer_class = (
        InvoiceDocumentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]






# billing/views.py

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from weasyprint import HTML

from .models import (
    StudentReceipt,
    InvoiceDocument,
    InvoiceDocumentItem
)
from .serializers import (
    StudentReceiptSerializer,
    InvoiceDocumentSerializer
)
from info.models import Student, Course
from inventory.models import Stock, StockTransaction


# =====================================
# HELPER FUNCTIONS
# =====================================

def number_to_words(num):
    """
    Convert number to words (Indian Rupees format)
    """
    if num == 0:
        return "Zero Rupees Only"
    
    ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
            'Seventeen', 'Eighteen', 'Nineteen']
    tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    
    def convert(n):
        if n < 20:
            return ones[n]
        if n < 100:
            return tens[n // 10] + ('' if n % 10 == 0 else ' ' + ones[n % 10])
        if n < 1000:
            return ones[n // 100] + ' Hundred' + ('' if n % 100 == 0 else ' ' + convert(n % 100))
        if n < 100000:
            return convert(n // 1000) + ' Thousand' + ('' if n % 1000 == 0 else ' ' + convert(n % 1000))
        if n < 10000000:
            return convert(n // 100000) + ' Lakh' + ('' if n % 100000 == 0 else ' ' + convert(n % 100000))
        return convert(n // 10000000) + ' Crore' + ('' if n % 10000000 == 0 else ' ' + convert(n % 10000000))
    
    rupees = int(num)
    paise = int(round((num - rupees) * 100))
    
    result = convert(rupees) + ' Rupees'
    if paise > 0:
        result += ' and ' + convert(paise) + ' Paise'
    return result + ' Only'


# =====================================
# STUDENT RECEIPT VIEWS
# =====================================

# ... (your existing StudentReceipt views here) ...


# =====================================
# STUDENTS BY SCHOOL VIEW
# =====================================

# ... (your existing StudentsBySchoolView here) ...


# =====================================
# INVOICE DOCUMENT VIEWS
# =====================================

# ... (your existing InvoiceDocument views here) ...


# =====================================
# PDF GENERATION VIEWS
# =====================================
# billing/views.py - Update the generate_invoice_pdf and download_invoice_pdf functions

def generate_invoice_pdf(request, pk):
    """
    Generate PDF for Invoice/Proforma using WeasyPrint
    """
    document = get_object_or_404(InvoiceDocument, pk=pk)
    
    # Hardcoded company details (YOUR COMPANY - HAVMORE CORP)
    company_details = {
        'name': 'HAVMORE CORP',
        'address': 'B-315, Kalpataru Plaza, Bhawani Peth, Ramoshi Gate, PUNE - 411042',
        'contact': 'Contact No. 7507029290 / 8007244100',
        'email': 'FLYINGCOLORSHQ@GMAIL.COM',
        'gst': '27AAHFH9767Q1Z9',
        'pan': 'AAHFH9767Q',
    }
    
    # Calculate GST (6% under composition scheme)
    gst_percent = 6
    gst_amount = float(document.subtotal) * gst_percent / 100
    grand_total = float(document.subtotal) + gst_amount
    
    # Convert grand total to words
    amount_in_words = number_to_words(grand_total)
    
    # Get place of supply from document (what was entered in the form)
    place_of_supply = {
        'city': document.city or 'PUNE',
        'state': document.state or 'MAHARASHTRA',
        'state_code': document.state_code or '27'
    }
    
    # Prepare context for template
    context = {
        'document': document,
        'company': company_details,
        'place_of_supply': place_of_supply,  # Added this
        'gst_percent': gst_percent,
        'gst_amount': gst_amount,
        'grand_total': grand_total,
        'amount_in_words': amount_in_words,
        'is_proforma': document.document_type == 'PROFORMA',
        'title': 'PROFORMA INVOICE' if document.document_type == 'PROFORMA' else 'TAX INVOICE - UNDER COMPOSITION',
        'copy_type': 'PROFORMA' if document.document_type == 'PROFORMA' else 'ORIGINAL for Recipient',
        'current_date': timezone.now().strftime('%Y-%m-%d'),
    }
    
    # Render HTML template
    html_string = render_to_string('invoice_pdf.html', context)
    
    # Create PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{document.document_type}_{document.document_no}.pdf"'
    
    # Generate PDF
    HTML(string=html_string).write_pdf(response)
    
    return response


def download_invoice_pdf(request, pk):
    """
    Download PDF for Invoice/Proforma
    """
    document = get_object_or_404(InvoiceDocument, pk=pk)
    
    # Hardcoded company details (YOUR COMPANY - HAVMORE CORP)
    company_details = {
        'name': 'HAVMORE CORP',
        'address': 'B-315, Kalpataru Plaza, Bhawani Peth, Ramoshi Gate, PUNE - 411042',
        'contact': 'Contact No. 7507029290 / 8007244100',
        'email': 'FLYINGCOLORSHQ@GMAIL.COM',
        'gst': '27AAHFH9767Q1Z9',
        'pan': 'AAHFH9767Q',
    }
    
    # Calculate GST
    gst_percent = 6
    gst_amount = float(document.subtotal) * gst_percent / 100
    grand_total = float(document.subtotal) + gst_amount
    
    # Convert grand total to words
    amount_in_words = number_to_words(grand_total)
    
    # Get place of supply from document
    place_of_supply = {
        'city': document.city or 'PUNE',
        'state': document.state or 'MAHARASHTRA',
        'state_code': document.state_code or '27'
    }
    
    context = {
        'document': document,
        'company': company_details,
        'place_of_supply': place_of_supply,
        'gst_percent': gst_percent,
        'gst_amount': gst_amount,
        'grand_total': grand_total,
        'amount_in_words': amount_in_words,
        'is_proforma': document.document_type == 'PROFORMA',
        'title': 'PROFORMA INVOICE' if document.document_type == 'PROFORMA' else 'TAX INVOICE - UNDER COMPOSITION',
        'copy_type': 'PROFORMA' if document.document_type == 'PROFORMA' else 'ORIGINAL for Recipient',
        'current_date': timezone.now().strftime('%Y-%m-%d'),
    }
    
    html_string = render_to_string('invoice_pdf.html', context)
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{document.document_type}_{document.document_no}.pdf"'
    
    HTML(string=html_string).write_pdf(response)
    
    return response