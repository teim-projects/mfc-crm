from django.db import models

from info.models import Course

from django.core.exceptions import ValidationError



class Product(models.Model):

    PRODUCT_TYPES = (
        ('book', 'Book'),
        ('instrument', 'Instrument'),
        ('bag', 'Bag'),
    )

    COURSE_TYPES = (
        ('vedic_maths', 'Vedic Maths'),
        ('abacus', 'Abacus'),
        ('common', 'Common'),
    )

    product_name = models.CharField(
        max_length=255
    )

    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES
    )

    # 🎯 ALWAYS SELECTED
    course_type = models.CharField(
        max_length=50,
        choices=COURSE_TYPES
    )

    # 🎯 ONLY FOR BOOKS
    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    product_code = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # ✅ VALIDATION
    def clean(self):

        # 📚 BOOK
        if self.product_type == "book":

            if not self.course:

                raise ValidationError({
                    "course":
                    "Book must have course"
                })

            # auto sync course type
            self.course_type = (
                self.course.course_type
            )

        # 🧮 INSTRUMENT
        elif self.product_type == "instrument":

            # no exact course needed
            self.course = None

            if self.course_type == "common":

                raise ValidationError({
                    "course_type":
                    "Instrument cannot be common"
                })

        # 🎒 BAG
        elif self.product_type == "bag":

            self.course = None

            self.course_type = "common"

    # ✅ AUTO PRODUCT CODE
    def save(self, *args, **kwargs):

        if not self.product_code:

            last_id = (
                Product.objects.count() + 1
            )

            # 📚 BOOK
            if (
                self.product_type == "book"
                and self.course
            ):

                course_short = (
                    "AB"
                    if self.course.course_type
                    == "abacus"
                    else "VM"
                )

                level_short = (
                    self.course.level
                    .replace("Level ", "L")
                )

                self.product_code = (
                    f"BOOK-{course_short}-"
                    f"{level_short}-{last_id:03d}"
                )

            # 🧮 INSTRUMENT
            elif self.product_type == "instrument":

                course_short = (
                    "AB"
                    if self.course_type
                    == "abacus"
                    else "VM"
                )

                self.product_code = (
                    f"INST-{course_short}-"
                    f"{last_id:03d}"
                )

            # 🎒 BAG
            elif self.product_type == "bag":

                self.product_code = (
                    f"BAG-{last_id:03d}"
                )

        super().save(*args, **kwargs)

    def __str__(self):

        return self.product_name



# inventory

from django.db import models
from django.utils import timezone

from inventory.models import Product


# =========================================
# VENDOR MASTER
# =========================================
class Vendor(models.Model):

    vendor_name = models.CharField(
        max_length=255
    )

    address = models.TextField()

    contact_person = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    operating_state = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    gst_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    category = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.vendor_name

# =========================================
# PURCHASE ORDER
# =========================================

class PurchaseOrder(models.Model):

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('partial', 'Partial Received'),
        ('completed', 'Completed'),
    )

    po_number = models.CharField(
        max_length=100,
        unique=True
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="purchase_orders"
    )

    po_date = models.DateField(
        default=timezone.now
    )

    delivery_date = models.DateField(
        blank=True,
        null=True
    )

    payment_terms = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    gst_total = models.DecimalField(
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

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.po_number


# =========================================
# PURCHASE ORDER ITEMS
# =========================================

class PurchaseOrderItem(models.Model):

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    # NEW
    replacement_qty = models.PositiveIntegerField(
        default=0
    )

    # NEW
    billable_qty = models.PositiveIntegerField(
        default=0
    )

    unit = models.CharField(
        max_length=50,
        default="PCS"
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    gst_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):

        if self.replacement_qty > self.quantity:
            raise ValidationError(
                "Replacement Qty cannot exceed Quantity"
            )


        self.billable_qty = (
            self.quantity -
            self.replacement_qty
        )

        base_amount = (
            self.billable_qty *
            self.rate
        )

        gst_amount = (
            base_amount *
            self.gst_percent
        ) / 100

        self.amount = (
            base_amount +
            gst_amount
        )

        super().save(*args, **kwargs)

    def __str__(self):

        return (
            f"{self.purchase_order.po_number}"
            f" - "
            f"{self.product.product_name}"
        )




from django.db import models

# =====================================
# GRN
# =====================================

class GRN(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
    )

    grn_number = models.CharField(
        max_length=100,
        unique=True
    )

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="grns"
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE
    )

    grn_date = models.DateField()

    remarks = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="completed"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        

        return self.grn_number


# =====================================
# GRN ITEMS
# =====================================

class GRNItem(models.Model):

    grn = models.ForeignKey(
        GRN,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    ordered_qty = models.IntegerField()

    received_qty = models.IntegerField()
    replacement_qty = models.IntegerField(
    default=0
)

    accepted_qty = models.IntegerField()

    damaged_qty = models.IntegerField(
        default=0
    )

    unit = models.CharField(
        max_length=50,
        default="PCS"
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    gst_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
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

        self.accepted_qty = (
            self.received_qty -
            self.damaged_qty
        )

        self.amount = (
            self.accepted_qty *
            self.rate
        )

        super().save(*args, **kwargs)




class Stock(models.Model):

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE
    )

    opening_stock = models.IntegerField(
        default=0
    )

    inward_stock = models.IntegerField(
        default=0
    )

    outward_stock = models.IntegerField(
        default=0
    )

    damaged_stock = models.IntegerField(
        default=0
    )

    current_stock = models.IntegerField(
        default=0
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.product.product_name}"
        )


class StockTransaction(models.Model):

    TRANSACTION_TYPES = (

        ("IN", "Stock In"),

        ("OUT", "Stock Out"),

        ("DAMAGED", "Damaged"),

        ("ADJUSTMENT", "Adjustment"),
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="stock_transactions"
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    quantity = models.IntegerField()

    reference_type = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    reference_id = models.IntegerField(
        blank=True,
        null=True
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.product.product_name}"
            f" - "
            f"{self.transaction_type}"
        )



class VendorDamagedStock(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="damaged_items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    total_damaged_qty = models.IntegerField(
        default=0
    )

    settled_qty = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    @property
    def pending_qty(self):

        return (
            self.total_damaged_qty -
            self.settled_qty
        )

    def __str__(self):

        return (
            f"{self.vendor.vendor_name} - "
            f"{self.product.product_name}"
        )


    class Meta:
    
            unique_together = (
                "vendor",
                "product"
            )        

