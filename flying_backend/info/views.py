from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import School, Course ,Student
from .serializers import SchoolSerializer ,CourseSerializer , StudentSerializer,StudentEnrollment,StudentEnrollmentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date






# CREATE SCHOOL
class SchoolCreateView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]


# VIEW ALL SCHOOLS
class SchoolListView(generics.ListAPIView):
    queryset = School.objects.all().order_by('-id')
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]


# UPDATE SCHOOL
class SchoolUpdateView(generics.UpdateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]


# DELETE SCHOOL
class SchoolDeleteView(generics.DestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]


# VIEW SINGLE SCHOOL
class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]




# CREATE COURSE
class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# VIEW ALL COURSES
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all().order_by('course_type', 'level')
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# VIEW SINGLE COURSE
class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# UPDATE COURSE
class CourseUpdateView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# DELETE COURSE
class CourseDeleteView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]




# CREATE STUDENT
class StudentCreateView(
    generics.CreateAPIView
):

    queryset = Student.objects.all()

    serializer_class = (
        StudentSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        student =serializer.save()

        StudentEnrollment.objects.create(

            student=student,

            school=student.school,

            course=student.course,

            status="active"
        )

# VIEW ALL STUDENTS
class StudentListView(generics.ListAPIView):

    def get_queryset(self):
    
        queryset = Student.objects.all().order_by('-id')
    
        school_id = self.request.GET.get('school')
    
        if school_id:
            queryset = queryset.filter(
                school_id=school_id
            )
    
        return queryset
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


# VIEW SINGLE STUDENT
class StudentDetailView(generics.RetrieveAPIView):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


# UPDATE STUDENT
class StudentUpdateView(generics.UpdateAPIView):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


# DELETE STUDENT
class StudentDeleteView(generics.DestroyAPIView):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    

class PromoteStudentView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        pk
    ):

        student =Student.objects.get(pk=pk
        )

        new_course_id =request.data.get(    "course"
        )

        new_course =Course.objects.get(  id=new_course_id
        )

        # COMPLETE OLD

        StudentEnrollment.objects.filter(

            student=student,

            status="active"

        ).update(

            status="completed",

            completed_date=
            date.today()
        )

        # NEW HISTORY

        StudentEnrollment.objects.create(

            student=student,

            school=student.school,

            course=new_course,

            status="active"
        )

        # UPDATE STUDENT

        student.course =new_course

        student.level =new_course.level

        student.save()

        return Response({

            "message":
            "Student promoted successfully"
        })    

class StudentEnrollmentListView(generics.ListAPIView):
    queryset = (StudentEnrollment.objects.select_related(
            "student",
            "school",
            "course"
        )
        .order_by("-id")
    )

    serializer_class = (StudentEnrollmentSerializer
    )

    permission_classes = [ IsAuthenticated
    ]  
