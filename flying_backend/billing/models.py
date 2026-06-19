from django.db import models

# Create your models here.

from django.db import models
from info.models import School
from info.models import Student
from inventory.models import Product
import time


class StudentReceipt(models.Model):

    receipt_no = models.CharField(
        max_length=100,
        unique=True,
        blank=True
    )

    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )

    receipt_date = models.DateField()

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):

        if not self.receipt_no:
            self.receipt_no = (
                f"REC-{int(time.time()*1000)}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.receipt_no


class StudentReceiptItem(models.Model):

    receipt = models.ForeignKey(
        StudentReceipt,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField()

    unit = models.CharField(
        max_length=50,
        default="PCS"
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):

        self.amount = (
            self.quantity *
            self.rate
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.product.product_name}"
        )




class InvoiceDocument(models.Model):

    DOC_TYPES = (
        ("PROFORMA", "Proforma Invoice"),
        ("INVOICE", "Invoice"),
    )

    document_type = models.CharField(
        max_length=20,
        choices=DOC_TYPES
    )

    document_no = models.CharField(
        max_length=100,
        unique=True,
        blank=True
    )

    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE
    )

    invoice_date = models.DateField()

    challan_no = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    challan_date = models.DateField(
        blank=True,
        null=True
    )

    # NEW FIELDS - Add these
    gst_no = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="GST Number"
    )

    pan_no = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="PAN Number"
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default="MAHARASHTRA"
    )

    state_code = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        default="27"
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default="PUNE"
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    gst_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    gst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):

        if not self.document_no:

            prefix = (
                "PI"
                if self.document_type == "PROFORMA"
                else "INV"
            )

            last_id = (
                InvoiceDocument.objects.count() + 1
            )

            self.document_no = (
                f"{prefix}-{last_id:04d}"
            )

        super().save(*args, **kwargs)


class InvoiceDocumentItem(models.Model):

    document = models.ForeignKey(
        InvoiceDocument,
        related_name="items",
        on_delete=models.CASCADE
    )

    description = models.CharField(
        max_length=500
    )

    qty = models.IntegerField()

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

