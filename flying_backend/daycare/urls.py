from django.urls import path
from .views import *


urlpatterns = [

    path("membership-plans/",MembershipPlanListCreateView.as_view(),name="membership-plan-list-create" ),

    path( "membership-plans/<int:pk>/", MembershipPlanRetrieveUpdateDestroyView.as_view(), name="membership-plan-detail"),


    path( "companies/create/", CompanyCreateView.as_view()),

    path(  "companies/",  CompanyListView.as_view()),
    
    path(    "companies/<int:pk>/",    CompanyDetailView.as_view()),
    
    path(   "companies/<int:pk>/update/",   CompanyUpdateView.as_view()),
    
    path(   "companies/<int:pk>/delete/",   CompanyDeleteView.as_view()),


    path(  "daycare-services/",  DaycareServiceListView.as_view() ),

    path( "daycare-services/create/", DaycareServiceCreateView.as_view() ),

    path(  "daycare-services/<int:pk>/",  DaycareServiceDetailView.as_view() ),

    path(  "daycare-services/<int:pk>/update/",   DaycareServiceUpdateView.as_view() ),

    path("daycare-services/<int:pk>/delete/",  DaycareServiceDeleteView.as_view() ),


    # ==========================
    # DAYCARE STUDENTS
    # ==========================

    path( "daycare-students/",  DaycareStudentListView.as_view()),

    path(     "daycare-students/create/",DaycareStudentCreateView.as_view() ),

    path( "daycare-students/<int:pk>/", DaycareStudentDetailView.as_view() ),

    path( "daycare-students/<int:pk>/update/",  DaycareStudentUpdateView.as_view()),

    path(  "daycare-students/<int:pk>/delete/",   DaycareStudentDeleteView.as_view() ),

]