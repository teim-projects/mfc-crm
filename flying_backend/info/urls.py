
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
    StudentEnrollmentListView,
    PromoteStudentView
)

from .views import (
    CourseTypeCreateView,
    CourseTypeListView,
    CourseTypeDetailView,
    CourseTypeUpdateView,
    CourseTypeDeleteView,

    CourseLevelCreateView,
    CourseLevelListView,
    CourseLevelDetailView,
    CourseLevelUpdateView,
    CourseLevelDeleteView,
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
    path("enrollments/",StudentEnrollmentListView.as_view()),

    path( "students/promote/<int:pk>/", PromoteStudentView.as_view()),

    # COURSE TYPE

    path("course-types/",CourseTypeListView.as_view()),
    
    path(  "course-types/create/",  CourseTypeCreateView.as_view()),
    
    path(   "course-types/<int:pk>/",   CourseTypeDetailView.as_view()),
    
    path( "course-types/update/<int:pk>/", CourseTypeUpdateView.as_view()),
    
    path(   "course-types/delete/<int:pk>/",   CourseTypeDeleteView.as_view()),

    # COURSE LEVEL

    path(   "course-levels/",   CourseLevelListView.as_view()),
    
    path(  "course-levels/create/",  CourseLevelCreateView.as_view()),
    
    path(  "course-levels/<int:pk>/",  CourseLevelDetailView.as_view()),
    
    path(  "course-levels/update/<int:pk>/",  CourseLevelUpdateView.as_view()),
    
    path(  "course-levels/delete/<int:pk>/",  CourseLevelDeleteView.as_view()),
]