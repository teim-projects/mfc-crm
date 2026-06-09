from django.urls import path
from .views import LoginView
from .views import RoleCreateView, RoleListView, UserCreateView,UserListView,ToggleStaffStatusView,UserUpdateView,UserDeleteView


urlpatterns = [
    path('roles/', RoleListView.as_view()),
    path('roles/create/', RoleCreateView.as_view()),
    path('users/create/', UserCreateView.as_view()),
    path('login/', LoginView.as_view()),
    path('users/', UserListView.as_view()),
    path('users/toggle-status/<int:pk>/',ToggleStaffStatusView.as_view()),\
    path("users/update/<int:pk>/",UserUpdateView.as_view()),

    path( "users/delete/<int:pk>/", UserDeleteView.as_view()),
]
