from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import models
from django.db.models import Sum, Count, Avg, F, Q, DecimalField, FloatField
from django.db.models.functions import TruncMonth, Coalesce
from django.utils import timezone
import datetime
from decimal import Decimal

from info.models import School, Student, Course, CourseType, CourseLevel, StudentEnrollment
from accounts.models import User, Role
from inventory.models import Product, Vendor, PurchaseOrder, GRN, Stock
from billing.models import StudentReceipt, StudentReceiptItem, InvoiceDocument
from daycare.models import Company, DaycareStudent, DaycareService

class ReportsSummaryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # ----------------------------------------------------
        # DATE RANGE FILTERING
        # ----------------------------------------------------
        date_range_param = request.GET.get('range', 'all')
        now = timezone.now()
        today = now.date()

        date_filter_q = Q()
        receipt_date_q = Q()
        po_date_q = Q()
        invoice_date_q = Q()

        if date_range_param == 'month':
            start_date = today.replace(day=1)
            date_filter_q = Q(created_at__gte=start_date)
            receipt_date_q = Q(receipt_date__gte=start_date)
            po_date_q = Q(po_date__gte=start_date)
            invoice_date_q = Q(invoice_date__gte=start_date)
        elif date_range_param == 'quarter':
            start_date = today - datetime.timedelta(days=90)
            date_filter_q = Q(created_at__gte=start_date)
            receipt_date_q = Q(receipt_date__gte=start_date)
            po_date_q = Q(po_date__gte=start_date)
            invoice_date_q = Q(invoice_date__gte=start_date)
        elif date_range_param == 'year':
            start_date = today - datetime.timedelta(days=365)
            date_filter_q = Q(created_at__gte=start_date)
            receipt_date_q = Q(receipt_date__gte=start_date)
            po_date_q = Q(po_date__gte=start_date)
            invoice_date_q = Q(invoice_date__gte=start_date)

        # ----------------------------------------------------
        # 1. OVERVIEW & EXECUTIVE METRICS (DYNAMIC DB QUERIES)
        # ----------------------------------------------------
        total_schools = School.objects.count()
        total_students = Student.objects.filter(date_filter_q).count()
        total_staff = User.objects.exclude(username='admin').count()
        total_products = Product.objects.count()
        
        # Financial Totals dynamically aggregated from DB with explicit output_field
        total_receipts_revenue = StudentReceipt.objects.filter(receipt_date_q).aggregate(
            total=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField())
        )['total']
        
        total_invoiced_revenue = InvoiceDocument.objects.filter(invoice_date_q).aggregate(
            total=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField())
        )['total']

        total_po_expenditure = PurchaseOrder.objects.filter(po_date_q).aggregate(
            total=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField())
        )['total']

        total_daycare_companies = Company.objects.count()
        total_daycare_students = DaycareStudent.objects.filter(active=True).filter(date_filter_q).count()
        total_daycare_revenue = DaycareStudent.objects.filter(active=True).filter(date_filter_q).aggregate(
            total=Coalesce(Sum('total_amount'), Decimal('0.00'), output_field=DecimalField())
        )['total']

        salary_metrics = User.objects.aggregate(
            total_salary=Coalesce(Sum('salary'), Decimal('0.00'), output_field=DecimalField()),
            avg_salary=Coalesce(Avg('salary'), Decimal('0.00'), output_field=DecimalField())
        )

        # ----------------------------------------------------
        # 2. STUDENTS & SCHOOLS MODULE ANALYTICS
        # ----------------------------------------------------
        students_by_school_qs = School.objects.annotate(
            student_count=Count('students', filter=date_filter_q)
        ).values('school_name', 'student_count').order_by('-student_count')
        
        students_by_school = [
            {"school": item["school_name"], "count": item["student_count"]}
            for item in students_by_school_qs
        ]

        gender_qs = Student.objects.filter(date_filter_q).values('gender').annotate(count=Count('id'))
        students_by_gender = [
            {"gender": item["gender"] or "Unspecified", "count": item["count"]}
            for item in gender_qs
        ]

        # Monthly Admissions Dynamic Trend
        six_months_ago = today - datetime.timedelta(days=180)
        admissions_qs = Student.objects.filter(created_at__gte=six_months_ago)\
            .annotate(month=TruncMonth('created_at'))\
            .values('month')\
            .annotate(count=Count('id'))\
            .order_by('month')
            
        admissions_trend = [
            {"month": item["month"].strftime("%b %Y") if item["month"] else "N/A", "admissions": item["count"]}
            for item in admissions_qs if item["month"]
        ]

        # ----------------------------------------------------
        # 3. STAFF & HR MODULE ANALYTICS
        # ----------------------------------------------------
        staff_by_role_qs = User.objects.exclude(username='admin')\
            .values('role__name')\
            .annotate(staff_count=Count('id'))\
            .order_by('-staff_count')
            
        staff_by_role = [
            {"role": item["role__name"] or "General Staff", "count": item["staff_count"]}
            for item in staff_by_role_qs
        ]

        # ----------------------------------------------------
        # 4. COURSES & CURRICULUM MODULE ANALYTICS
        # ----------------------------------------------------
        courses_qs = Course.objects.annotate(
            student_count=Count('students')
        ).select_related('course_type', 'level')
        
        courses_analytics = [
            {
                "course_name": f"{c.course_type.name} ({c.level.level_name})",
                "tuition_fees": float(c.tuition_fees),
                "enrolled_students": c.student_count
            }
            for c in courses_qs
        ]

        # ----------------------------------------------------
        # 5. INVENTORY & PRODUCTS DYNAMIC ANALYTICS
        # ----------------------------------------------------
        all_products = Product.objects.all()
        stock_map = {s.product_id: s for s in Stock.objects.all()}
        
        stock_analytics = []
        for p in all_products:
            stk = stock_map.get(p.id)
            curr_qty = stk.current_stock if stk else 0
            dmg_qty = stk.damaged_stock if stk else 0
            stock_analytics.append({
                "product_name": p.product_name,
                "product_type": p.product_type,
                "unit_price": float(p.unit_price),
                "current_stock": curr_qty,
                "damaged_stock": dmg_qty,
                "total_val": float(p.unit_price * curr_qty)
            })

        # PO Status breakdown
        po_status_qs = PurchaseOrder.objects.values('status').annotate(
            count=Count('id'),
            amount=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField())
        )
        po_status_breakdown = [
            {"status": item["status"].capitalize(), "count": item["count"], "amount": float(item["amount"])}
            for item in po_status_qs
        ]

        # ----------------------------------------------------
        # 6. BILLING & FINANCIAL DYNAMIC ANALYTICS
        # ----------------------------------------------------
        monthly_receipts_qs = StudentReceipt.objects.filter(receipt_date__gte=six_months_ago)\
            .annotate(month=TruncMonth('receipt_date'))\
            .values('month')\
            .annotate(total=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField()))\
            .order_by('month')
            
        monthly_revenue_trend = [
            {"month": item["month"].strftime("%b %Y") if item["month"] else "N/A", "revenue": float(item["total"])}
            for item in monthly_receipts_qs if item["month"]
        ]

        revenue_by_school_qs = StudentReceipt.objects.values('school__school_name')\
            .annotate(total=Coalesce(Sum('grand_total'), Decimal('0.00'), output_field=DecimalField()))\
            .order_by('-total')
            
        revenue_by_school = [
            {"school": item["school__school_name"] or "Direct Purchase", "revenue": float(item["total"])}
            for item in revenue_by_school_qs
        ]

        # ----------------------------------------------------
        # 7. DAYCARE MODULE DYNAMIC ANALYTICS
        # ----------------------------------------------------
        daycare_by_company_qs = Company.objects.annotate(
            student_count=Count('students')
        ).values('company_name', 'student_count').order_by('-student_count')
        
        daycare_by_company = [
            {"company": item["company_name"], "count": item["student_count"]}
            for item in daycare_by_company_qs
        ]

        daycare_services_count = DaycareService.objects.filter(active=True).count()

        # Build Dynamic Response Payload
        response_data = {
            "range": date_range_param,
            "summary": {
                "total_schools": total_schools,
                "total_students": total_students,
                "total_staff": total_staff,
                "total_products": total_products,
                "total_receipts_revenue": float(total_receipts_revenue),
                "total_invoiced_revenue": float(total_invoiced_revenue),
                "total_po_expenditure": float(total_po_expenditure),
                "total_daycare_companies": total_daycare_companies,
                "total_daycare_students": total_daycare_students,
                "total_daycare_revenue": float(total_daycare_revenue),
                "total_payroll_commitment": float(salary_metrics["total_salary"]),
            },
            "students_module": {
                "students_by_school": students_by_school,
                "students_by_gender": students_by_gender,
                "admissions_trend": admissions_trend
            },
            "staff_module": {
                "staff_by_role": staff_by_role,
                "salary_metrics": {
                    "total": float(salary_metrics["total_salary"]),
                    "average": float(salary_metrics["avg_salary"])
                }
            },
            "courses_module": courses_analytics,
            "inventory_module": {
                "stock": stock_analytics,
                "po_status": po_status_breakdown
            },
            "billing_module": {
                "monthly_revenue": monthly_revenue_trend,
                "revenue_by_school": revenue_by_school
            },
            "daycare_module": {
                "daycare_by_company": daycare_by_company,
                "services_count": daycare_services_count
            }
        }

        return Response(response_data)
