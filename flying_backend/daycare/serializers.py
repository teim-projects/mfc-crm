

from rest_framework import serializers
from .models import MembershipPlan


class MembershipPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = MembershipPlan
        fields = "__all__"



from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):

    

    class Meta:
        model = Company
        fields = "__all__"

    


from rest_framework import serializers

from .models import (
    DaycareService,
    DaycareStudent
)


class DaycareServiceSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = DaycareService
        fields = "__all__"


class DaycareStudentSerializer(
    serializers.ModelSerializer
):

    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    class Meta:
        model = DaycareStudent
        fields = "__all__"