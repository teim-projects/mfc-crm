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

# 📑 File: views.py (Update the view at the bottom)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from info.models import Student


class StudentsBySchoolView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, school_id):

        students = (
            Student.objects
            .select_related(
                "course",
                "course__course_type",
                "course__level"
            )
            .filter(
                school_id=school_id
            )
            .order_by("student_name")
        )

        data = []

        for student in students:

            data.append({
                "id": student.id,
                "student_name": student.student_name,
                "parent_name": student.parent_name,
                "parent_contact": student.parent_contact,

                "course": (
                    student.course.id
                    if student.course
                    else None
                ),

                "course_name": (
                    student.course.course_type.name
                    if student.course
                    else ""
                ),

                "level": (
                    student.course.level.level_name
                    if student.course
                    else ""
                ),
            })

        return Response(data)