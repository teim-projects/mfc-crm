from rest_framework import serializers

from .models import (
    Vendor,
    PurchaseOrder,
    PurchaseOrderItem,
    Product,Stock,
    StockTransaction,
    VendorDamagedStock
)


# =====================================
# PRODUCT
# =====================================

class ProductSerializer(serializers.ModelSerializer):

    course_type_name = serializers.CharField(
        source="course_type.name",
        read_only=True
    )

    course_level_name = serializers.CharField(
        source="course_level.level_name",
        read_only=True
    )

    class Meta:

        model = Product

        fields = "__all__"

    def to_representation(self, instance):
    
        data = super().to_representation(instance)
    
        if instance.product_type == "instrument":
            data["course_level_display"] = "All Levels"
    
        elif instance.product_type == "bag":
            data["course_level_display"] = "Common"
    
        else:
            data["course_level_display"] = (
                instance.course_level.level_name
                if instance.course_level
                else ""
            )
    
        return data

    def get_course_type_name(self, obj):
    
        if obj.product_type == "bag":
            return "Common"
    
        return (
            obj.course_type.name
            if obj.course_type
            else ""
        )

        


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

            if item.replacement_qty > 0:
            
                try:
            
                    vendor_damage = (
                        VendorDamagedStock.objects.get(
                            vendor=po.vendor,
                            product=item.product
                        )
                    )
            
                    vendor_damage.settled_qty += (
                        item.replacement_qty
                    )
            
                    vendor_damage.save()
            
                except VendorDamagedStock.DoesNotExist:
                    pass            

            base_amount = (
                item.billable_qty * item.rate
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


        for old_item in instance.items.all():
        
            if old_item.replacement_qty > 0:
        
                try:
        
                    vendor_damage = (
                        VendorDamagedStock.objects.get(
                            vendor=instance.vendor,
                            product=old_item.product
                        )
                    )
        
                    vendor_damage.settled_qty -= (
                        old_item.replacement_qty
                    )
        
                    if vendor_damage.settled_qty < 0:
                        vendor_damage.settled_qty = 0
        
                    vendor_damage.save()
        
                except VendorDamagedStock.DoesNotExist:
                    pass


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


            if item.replacement_qty > 0:
            
                try:
            
                    vendor_damage = (
                        VendorDamagedStock.objects.get(
                            vendor=instance.vendor,
                            product=item.product
                        )
                    )
            
                    vendor_damage.settled_qty += (
                        item.replacement_qty
                    )
            
                    vendor_damage.save()
            
                except VendorDamagedStock.DoesNotExist:
                    pass  


            base_amount = (
                item.billable_qty * item.rate
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
    GRNItem,
    Stock,
    StockTransaction
)

from rest_framework import serializers


# =====================================
# GRN ITEM
# =====================================

class GRNItemSerializer(serializers.ModelSerializer):

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

class GRNSerializer(serializers.ModelSerializer):

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

        items_data = validated_data.pop("items")

        grn = GRN.objects.create(
            **validated_data
        )

        for item_data in items_data:

            grn_item = GRNItem.objects.create(
                grn=grn,
                **item_data
            )

            stock, created = Stock.objects.get_or_create(
                product=grn_item.product,
                defaults={
                    "opening_stock": 0,
                    "inward_stock": 0,
                    "outward_stock": 0,
                    "damaged_stock": 0,
                    "current_stock": 0,
                }
            )

            # ==========================
            # STOCK UPDATE
            # ==========================

            stock.inward_stock += grn_item.received_qty

            stock.damaged_stock += grn_item.damaged_qty


            if grn_item.damaged_qty > 0:
            
                vendor_damage, created = (
                    VendorDamagedStock.objects.get_or_create(
                        vendor=grn.vendor,
                        product=grn_item.product,
                        defaults={
                            "total_damaged_qty": 0,
                            "settled_qty": 0,
                        }
                    )
                )
            
                vendor_damage.total_damaged_qty += (
                    grn_item.damaged_qty
                )
            
                vendor_damage.save()            

            stock.current_stock += (
                grn_item.received_qty -
                grn_item.damaged_qty
            )

            settled_qty = min(
                stock.damaged_stock,
                grn_item.replacement_qty or 0
            )
            
            stock.damaged_stock -= settled_qty
            
            stock.save()

            # ==========================
            # STOCK TRANSACTION - IN
            # ==========================

            StockTransaction.objects.create(
                product=grn_item.product,
                transaction_type="IN",
                quantity=grn_item.received_qty,
                reference_type="GRN",
                reference_id=grn.id,
                remarks=f"GRN {grn.grn_number}"
            )

            # ==========================
            # STOCK TRANSACTION - DAMAGED
            # ==========================

            if grn_item.damaged_qty > 0:

                StockTransaction.objects.create(
                    product=grn_item.product,
                    transaction_type="DAMAGED",
                    quantity=grn_item.damaged_qty,
                    reference_type="GRN",
                    reference_id=grn.id,
                    remarks=f"Damaged Qty in {grn.grn_number}"
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

        items_data = validated_data.pop("items")

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

        # delete old items
        for old_item in instance.items.all():
        
            stock = Stock.objects.get(
                product=old_item.product
            )
        
            stock.inward_stock -= (
                old_item.received_qty
            )
        
            stock.current_stock -= (
                old_item.received_qty -
                old_item.damaged_qty
            )
        
            stock.damaged_stock -= (
                old_item.damaged_qty
            )
        
            stock.save()


        for old_item in instance.items.all():
        
            vendor_damage = (
                VendorDamagedStock.objects.filter(
                    vendor=instance.vendor,
                    product=old_item.product
                ).first()
            )
        
            if vendor_damage:
        
                vendor_damage.total_damaged_qty -= (
                    old_item.damaged_qty
                )
        
                if vendor_damage.total_damaged_qty < 0:
                    vendor_damage.total_damaged_qty = 0
        
                vendor_damage.save()            
        instance.items.all().delete()

        # create new items

        for item_data in items_data:

            grn_item = GRNItem.objects.create(
                grn=instance,
                **item_data
            )

            stock, created = Stock.objects.get_or_create(
                product=grn_item.product,
                defaults={
                    "opening_stock": 0,
                    "inward_stock": 0,
                    "outward_stock": 0,
                    "damaged_stock": 0,
                    "current_stock": 0,
                }
            )

            # ==========================
            # STOCK UPDATE
            # ==========================

            stock.inward_stock += grn_item.received_qty

            stock.damaged_stock += grn_item.damaged_qty

            if grn_item.damaged_qty > 0:
            
                vendor_damage, created = (
                    VendorDamagedStock.objects.get_or_create(
                        vendor=instance.vendor,
                        product=grn_item.product,
                        defaults={
                            "total_damaged_qty": 0,
                            "settled_qty": 0,
                        }
                    )
                )
            
                vendor_damage.total_damaged_qty += (
                    grn_item.damaged_qty
                )
            
                vendor_damage.save()


            stock.current_stock += (
                grn_item.received_qty -
                grn_item.damaged_qty
            )


            settled_qty = min(
                stock.damaged_stock,
                grn_item.replacement_qty or 0
            )
            
            stock.damaged_stock -= settled_qty            

            stock.save()

            # ==========================
            # STOCK TRANSACTION - IN
            # ==========================

            StockTransaction.objects.create(
                product=grn_item.product,
                transaction_type="IN",
                quantity=grn_item.received_qty,
                reference_type="GRN",
                reference_id=instance.id,
                remarks=f"GRN {instance.grn_number}"
            )

            # ==========================
            # STOCK TRANSACTION - DAMAGED
            # ==========================

            if grn_item.damaged_qty > 0:

                StockTransaction.objects.create(
                    product=grn_item.product,
                    transaction_type="DAMAGED",
                    quantity=grn_item.damaged_qty,
                    reference_type="GRN",
                    reference_id=instance.id,
                    remarks=f"Damaged Qty in {instance.grn_number}"
                )

        return instance
from .models import Stock

class StockSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    product_code = serializers.CharField(
        source="product.product_code",
        read_only=True
    )

    product_type = serializers.CharField(
        source="product.product_type",
        read_only=True
    )

    course_type = serializers.CharField(
        source="product.course_type",
        read_only=True
    )

    course_level = serializers.SerializerMethodField()

    class Meta:

        model = Stock

        fields = "__all__"

    def get_course_level(
        self,
        obj
    ):

        if (
            obj.product.course
        ):

            return (
                obj.product.course.level
            )

        return "Common"  




class StockTransactionSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    class Meta:

        model = StockTransaction

        fields = "__all__"
