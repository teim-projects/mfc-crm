from django.shortcuts import render

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

class StudentsBySchoolView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, school_id):

        receipt_student_ids = (
            StudentReceipt.objects
            .filter(
                school_id=school_id
            )
            .values_list(
                "student_id",
                flat=True
            )
            .distinct()
        )

        students = Student.objects.filter(
            id__in=receipt_student_ids
        )

        data = []

        for student in students:

            data.append({

                "id": student.id,

                "student_name":
                student.student_name,

                "parent_name":
                student.parent_name,

                "parent_contact":
                student.parent_contact,

                "course":
                student.course.id,

                "course_name":
                student.course.course_type,

                "level":
                student.level,

            })

        return Response(data)
