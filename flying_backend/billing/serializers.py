from rest_framework import serializers

from .models import (
    StudentReceipt,
    StudentReceiptItem
)

from inventory.models import (
    Stock,
    StockTransaction
)

from info.models import Course, Student  # ADD THIS IMPORT


class StudentReceiptItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    class Meta:

        model = StudentReceiptItem

        exclude = ["receipt"]


class StudentReceiptSerializer(
    serializers.ModelSerializer
):

    items = StudentReceiptItemSerializer(
        many=True
    )

    school_name = serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    student_name = serializers.CharField(
        source="student.student_name",
        read_only=True
    )

    # ADD THESE FIELDS - they are write-only for creating new students
    student_name_input = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True
    )
    
    parent_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True
    )
    
    parent_contact_input = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:

        model = StudentReceipt

        fields = "__all__"
        extra_kwargs = {
            'student': {'required': False, 'allow_null': True}
        }

    def create(
        self,
        validated_data
    ):

        items_data = validated_data.pop("items")
        
        # Get new student data if provided
        student_name_input = validated_data.pop("student_name_input", None)
        parent_name = validated_data.pop("parent_name", None)
        parent_contact_input = validated_data.pop("parent_contact_input", None)

        # Get the student from validated_data
        student = validated_data.get("student")
        
        # If no student selected but new student name provided, create a new student
        if (not student or student is None) and student_name_input:
            school = validated_data.get("school")
            
            # Get first available course as default
            default_course = Course.objects.first()
            if not default_course:
                raise serializers.ValidationError(
                    {"course": "Please create at least one course first."}
                )
            
            # Create new student
            student = Student.objects.create(
                student_name=student_name_input,
                parent_name=parent_name or "",
                parent_contact=parent_contact_input or "",
                school=school,
                course=default_course,
                level="Pending",
                parent_address=""
            )
            
            # Replace the student in validated_data
            validated_data["student"] = student
        elif not student or student is None:
            raise serializers.ValidationError(
                {"student": "Either select an existing student or provide a new student name."}
            )

        receipt = StudentReceipt.objects.create(
            **validated_data
        )

        if (
            receipt.student.school_id
            !=
            receipt.school_id
        ):
            raise serializers.ValidationError(
                "Selected student does not belong to selected school."
            )

        subtotal = 0

        for item_data in items_data:
            
            # Remove amount if present (model calculates it)
            item_data.pop("amount", None)

            receipt_item = (
                StudentReceiptItem.objects.create(
                    receipt=receipt,
                    **item_data
                )
            )

            subtotal += (
                receipt_item.amount
            )

            stock = Stock.objects.get(
                product=receipt_item.product
            )

            if (
                stock.current_stock <
                receipt_item.quantity
            ):
                raise serializers.ValidationError(
                    f"Insufficient stock for "
                    f"{receipt_item.product.product_name}"
                )

            stock.outward_stock += (
                receipt_item.quantity
            )

            stock.current_stock -= (
                receipt_item.quantity
            )

            stock.save()

            StockTransaction.objects.create(
                product=receipt_item.product,
                transaction_type="OUT",
                quantity=receipt_item.quantity,
                reference_type="RECEIPT",
                reference_id=receipt.id,
                remarks=(
                    f"Receipt "
                    f"{receipt.receipt_no}"
                )
            )

        receipt.subtotal = subtotal

        receipt.grand_total = (
            subtotal -
            receipt.discount
        )

        receipt.save()

        return receipt

    def update(
        self,
        instance,
        validated_data
    ):

        items_data = validated_data.pop(
            "items"
        )

        instance.school = validated_data.get(
            "school",
            instance.school
        )

        instance.student = validated_data.get(
            "student",
            instance.student
        )

        instance.receipt_date = validated_data.get(
            "receipt_date",
            instance.receipt_date
        )

        instance.discount = validated_data.get(
            "discount",
            instance.discount
        )

        instance.remarks = validated_data.get(
            "remarks",
            instance.remarks
        )

        instance.save()

        # Reverse old stock

        for old_item in (
            instance.items.all()
        ):

            stock = Stock.objects.get(
                product=old_item.product
            )

            stock.outward_stock -= (
                old_item.quantity
            )

            stock.current_stock += (
                old_item.quantity
            )

            stock.save()

        # Delete old items

        instance.items.all().delete()

        subtotal = 0

        for item_data in items_data:
            
            # Remove amount if present (model calculates it)
            item_data.pop("amount", None)

            receipt_item = (
                StudentReceiptItem.objects.create(
                    receipt=instance,
                    **item_data
                )
            )

            subtotal += (
                receipt_item.amount
            )

            stock = Stock.objects.get(
                product=receipt_item.product
            )

            if (
                stock.current_stock <
                receipt_item.quantity
            ):
                raise serializers.ValidationError(
                    f"Insufficient stock for "
                    f"{receipt_item.product.product_name}"
                )

            stock.outward_stock += (
                receipt_item.quantity
            )

            stock.current_stock -= (
                receipt_item.quantity
            )

            stock.save()

            StockTransaction.objects.create(
                product=receipt_item.product,
                transaction_type="OUT",
                quantity=receipt_item.quantity,
                reference_type="RECEIPT",
                reference_id=instance.id,
                remarks=(
                    f"Receipt "
                    f"{instance.receipt_no}"
                )
            )

        instance.subtotal = subtotal

        instance.grand_total = (
            subtotal -
            instance.discount
        )

        instance.save()

        return instance



from rest_framework import serializers

from .models import (
    InvoiceDocument,
    InvoiceDocumentItem
)


class InvoiceDocumentItemSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = InvoiceDocumentItem

        exclude = ["document"]


class InvoiceDocumentSerializer(
    serializers.ModelSerializer
):

    items = InvoiceDocumentItemSerializer(
        many=True
    )

    school_name = serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    class Meta:

        model = InvoiceDocument

        fields = "__all__"

    def create(
        self,
        validated_data
    ):

        items_data = validated_data.pop(
            "items"
        )

        document = InvoiceDocument.objects.create(
            **validated_data
        )

        subtotal = 0

        for item_data in items_data:

            item = InvoiceDocumentItem.objects.create(
                document=document,
                **item_data
            )

            subtotal += item.amount

        document.subtotal = subtotal

        document.gst_amount = (
            subtotal *
            document.gst_percent
        ) / 100

        document.grand_total = (
            subtotal +
            document.gst_amount
        )

        document.save()

        return document

    def update(
        self,
        instance,
        validated_data
    ):

        items_data = validated_data.pop(
            "items"
        )

        instance.document_type = validated_data.get(
            "document_type",
            instance.document_type
        )

        instance.school = validated_data.get(
            "school",
            instance.school
        )

        instance.invoice_date = validated_data.get(
            "invoice_date",
            instance.invoice_date
        )

        instance.challan_no = validated_data.get(
            "challan_no",
            instance.challan_no
        )

        instance.challan_date = validated_data.get(
            "challan_date",
            instance.challan_date
        )

        instance.gst_percent = validated_data.get(
            "gst_percent",
            instance.gst_percent
        )

        instance.remarks = validated_data.get(
            "remarks",
            instance.remarks
        )


        instance.gst_no = validated_data.get("gst_no", instance.gst_no)
        instance.pan_no = validated_data.get("pan_no", instance.pan_no)
        instance.state = validated_data.get("state", instance.state)
        instance.state_code = validated_data.get("state_code", instance.state_code)
        instance.city = validated_data.get("city", instance.city)        

        instance.save()

        instance.items.all().delete()

        subtotal = 0

        for item_data in items_data:

            item = InvoiceDocumentItem.objects.create(
                document=instance,
                **item_data
            )

            subtotal += item.amount

        instance.subtotal = subtotal

        instance.gst_amount = (
            subtotal *
            instance.gst_percent
        ) / 100

        instance.grand_total = (
            subtotal +
            instance.gst_amount
        )

        instance.save()

        return instance        