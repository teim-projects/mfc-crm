from rest_framework import generics
from .models import MembershipPlan
from .serializers import MembershipPlanSerializer


class MembershipPlanListCreateView(
    generics.ListCreateAPIView
):
    queryset = MembershipPlan.objects.all().order_by("-id")
    serializer_class = MembershipPlanSerializer


class MembershipPlanRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Company
from .serializers import CompanySerializer


class CompanyCreateView(
    generics.CreateAPIView
):

    queryset = (
        Company.objects.all()
    )

    serializer_class = (
        CompanySerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class CompanyListView(
    generics.ListAPIView
):

    queryset = (
        Company.objects
        .all()
        .order_by("-id")
    )

    serializer_class = (
        CompanySerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class CompanyDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        Company.objects.all()
    )

    serializer_class = (
        CompanySerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class CompanyUpdateView(
    generics.UpdateAPIView
):

    queryset = (
        Company.objects.all()
    )

    serializer_class = (
        CompanySerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


class CompanyDeleteView(
    generics.DestroyAPIView
):

    queryset = (
        Company.objects.all()
    )

    serializer_class = (
        CompanySerializer
    )

    permission_classes = [
        IsAuthenticated
    ]



from rest_framework import generics

from .models import (
    DaycareService
)

from .serializers import (
    DaycareServiceSerializer
)


class DaycareServiceListView(
    generics.ListAPIView
):

    queryset = (
        DaycareService.objects
        .all()
        .order_by("-id")
    )

    serializer_class = (
        DaycareServiceSerializer
    )


class DaycareServiceCreateView(
    generics.CreateAPIView
):

    queryset = (
        DaycareService.objects.all()
    )

    serializer_class = (
        DaycareServiceSerializer
    )


class DaycareServiceDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        DaycareService.objects.all()
    )

    serializer_class = (
        DaycareServiceSerializer
    )


class DaycareServiceUpdateView(
    generics.UpdateAPIView
):

    queryset = (
        DaycareService.objects.all()
    )

    serializer_class = (
        DaycareServiceSerializer
    )


class DaycareServiceDeleteView(
    generics.DestroyAPIView
):

    queryset = (
        DaycareService.objects.all()
    )

    serializer_class = (
        DaycareServiceSerializer
    )




from .models import (
    DaycareStudent
)

from .serializers import (
    DaycareStudentSerializer
)


class DaycareStudentListView(
    generics.ListAPIView
):

    queryset = (
        DaycareStudent.objects
        .select_related(
            "company"
        )
        .order_by("-id")
    )

    serializer_class = (
        DaycareStudentSerializer
    )


class DaycareStudentCreateView(
    generics.CreateAPIView
):

    queryset = (
        DaycareStudent.objects.all()
    )

    serializer_class = (
        DaycareStudentSerializer
    )


class DaycareStudentDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        DaycareStudent.objects.all()
    )

    serializer_class = (
        DaycareStudentSerializer
    )


class DaycareStudentUpdateView(
    generics.UpdateAPIView
):

    queryset = (
        DaycareStudent.objects.all()
    )

    serializer_class = (
        DaycareStudentSerializer
    )


class DaycareStudentDeleteView(
    generics.DestroyAPIView
):

    queryset = (
        DaycareStudent.objects.all()
    )

    serializer_class = (
        DaycareStudentSerializer
    )
