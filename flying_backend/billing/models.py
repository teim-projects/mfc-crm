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