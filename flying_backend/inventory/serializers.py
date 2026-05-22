from rest_framework import serializers

from .models import (
    Vendor,
    PurchaseOrder,
    PurchaseOrderItem,
    Product
)


# =====================================
# PRODUCT
# =====================================

class ProductSerializer(serializers.ModelSerializer):

    course_level = serializers.SerializerMethodField()

    course_type_name = serializers.SerializerMethodField()

    class Meta:

        model = Product

        fields = "__all__"

    def get_course_level(self, obj):

        if obj.product_type == "book" and obj.course:

            return obj.course.level

        elif obj.product_type == "instrument":

            return "All Levels"

        elif obj.product_type == "bag":

            return "Common"

        return None

    def get_course_type_name(self, obj):

        if obj.product_type == "book" and obj.course:

            return obj.course.course_type

        elif obj.product_type == "instrument":

            return obj.course_type

        elif obj.product_type == "bag":

            return "Common"

        return None


# =====================================
# VENDOR
# =====================================

class VendorSerializer(serializers.ModelSerializer):

    class Meta:

        model = Vendor

        fields = "__all__"


# =====================================
# PO ITEM
# =====================================

class PurchaseOrderItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    class Meta:

        model = PurchaseOrderItem

        exclude = ["purchase_order"]





# =====================================
# PURCHASE ORDER
# =====================================

class PurchaseOrderSerializer(
    serializers.ModelSerializer
):

    items = PurchaseOrderItemSerializer(
        many=True
    )

    vendor_name = serializers.CharField(
        source="vendor.vendor_name",
        read_only=True
    )

    class Meta:

        model = PurchaseOrder

        fields = "__all__"

    # =====================================
    # CREATE
    # =====================================

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        po = PurchaseOrder.objects.create(
            **validated_data
        )

        subtotal = 0
        gst_total = 0

        for item_data in items_data:

            item = PurchaseOrderItem.objects.create(
                purchase_order=po,
                **item_data
            )

            base_amount = (
                item.quantity * item.rate
            )

            gst_amount = (
                base_amount * item.gst_percent
            ) / 100

            subtotal += base_amount

            gst_total += gst_amount

        po.subtotal = subtotal

        po.gst_total = gst_total

        po.grand_total = (
            subtotal + gst_total
        )

        po.save()

        return po

    # =====================================
    # UPDATE
    # =====================================

    def update(self, instance, validated_data):

        items_data = validated_data.pop(
            "items"
        )

        instance.vendor = validated_data.get(
            "vendor",
            instance.vendor
        )

        instance.po_date = validated_data.get(
            "po_date",
            instance.po_date
        )

        instance.delivery_date = validated_data.get(
            "delivery_date",
            instance.delivery_date
        )

        instance.payment_terms = validated_data.get(
            "payment_terms",
            instance.payment_terms
        )

        instance.remarks = validated_data.get(
            "remarks",
            instance.remarks
        )

        instance.save()

        # DELETE OLD ITEMS
        instance.items.all().delete()

        subtotal = 0
        gst_total = 0

        # CREATE NEW ITEMS
        for item_data in items_data:

            item = PurchaseOrderItem.objects.create(
                purchase_order=instance,
                **item_data
            )

            base_amount = (
                item.quantity * item.rate
            )

            gst_amount = (
                base_amount * item.gst_percent
            ) / 100

            subtotal += base_amount

            gst_total += gst_amount

        instance.subtotal = subtotal

        instance.gst_total = gst_total

        instance.grand_total = (
            subtotal + gst_total
        )

        instance.save()

        return instance



from .models import (
    GRN,
    GRNItem
)

# =====================================
# GRN ITEM
# =====================================

class GRNItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    class Meta:

        model = GRNItem

        exclude = ["grn"]


# =====================================
# GRN
# =====================================

class GRNSerializer(
    serializers.ModelSerializer
):

    items = GRNItemSerializer(
        many=True
    )

    vendor_name = serializers.CharField(
        source="vendor.vendor_name",
        read_only=True
    )

    po_number = serializers.CharField(
        source="purchase_order.po_number",
        read_only=True
    )

    class Meta:

        model = GRN

        fields = "__all__"

    # =====================================
    # CREATE
    # =====================================

    def create(self, validated_data):

        items_data = validated_data.pop(
            "items"
        )

        grn = GRN.objects.create(
            **validated_data
        )

        for item_data in items_data:

            GRNItem.objects.create(
                grn=grn,
                **item_data
            )

        return grn

    # =====================================
    # UPDATE
    # =====================================

    def update(
        self,
        instance,
        validated_data
    ):

        items_data = validated_data.pop(
            "items"
        )

        instance.purchase_order = validated_data.get(
            "purchase_order",
            instance.purchase_order
        )

        instance.vendor = validated_data.get(
            "vendor",
            instance.vendor
        )

        instance.grn_date = validated_data.get(
            "grn_date",
            instance.grn_date
        )

        instance.status = validated_data.get(
            "status",
            instance.status
        )

        instance.remarks = validated_data.get(
            "remarks",
            instance.remarks
        )

        instance.save()

        # DELETE OLD ITEMS
        instance.items.all().delete()

        # CREATE NEW ITEMS
        for item_data in items_data:

            GRNItem.objects.create(
                grn=instance,
                **item_data
            )

        return instance