
from django.urls import path
from .views import (
    SchoolCreateView,SchoolListView,SchoolUpdateView,SchoolDeleteView,SchoolDetailView,StudentCreateView,StudentListView,
    StudentDetailView,StudentUpdateView,StudentDeleteView,)


from .views import (
    CourseCreateView,
    CourseListView,
    CourseDetailView,
    CourseUpdateView,
    CourseDeleteView,
)

urlpatterns = [

    # CREATE
    path('schools/create/', SchoolCreateView.as_view()),

    # VIEW ALL
    path('schools/', SchoolListView.as_view()),

    # VIEW SINGLE
    path('schools/<int:pk>/', SchoolDetailView.as_view()),

    # UPDATE
    path('schools/update/<int:pk>/', SchoolUpdateView.as_view()),

    # DELETE
    path('schools/delete/<int:pk>/', SchoolDeleteView.as_view()),



    # COURSES
    
    path('courses/create/', CourseCreateView.as_view()),
    
    path('courses/', CourseListView.as_view()),
    
    path('courses/<int:pk>/', CourseDetailView.as_view()),
    
    path('courses/update/<int:pk>/', CourseUpdateView.as_view()),
    
    path('courses/delete/<int:pk>/', CourseDeleteView.as_view()),



    # STUDENTS

    path('students/create/',StudentCreateView.as_view()),
    
    path('students/',StudentListView.as_view()),
    
    path('students/<int:pk>/',StudentDetailView.as_view()),
    
    path('students/update/<int:pk>/',StudentUpdateView.as_view()),
    
    path('students/delete/<int:pk>/',StudentDeleteView.as_view()),
    
]