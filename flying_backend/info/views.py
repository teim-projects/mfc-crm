from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import School, Course ,Student
from .serializers import SchoolSerializer ,CourseSerializer , StudentSerializer
from rest_framework.permissions import IsAuthenticated






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
class StudentCreateView(generics.CreateAPIView):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


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