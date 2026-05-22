from django.urls import path
from .views import LoginView
from .views import RoleCreateView, RoleListView, UserCreateView,UserListView,ToggleStaffStatusView


urlpatterns = [
    path('roles/', RoleListView.as_view()),
    path('roles/create/', RoleCreateView.as_view()),
    path('users/create/', UserCreateView.as_view()),
    path('login/', LoginView.as_view()),
    path('users/', UserListView.as_view()),
    path('users/toggle-status/<int:pk>/',ToggleStaffStatusView.as_view()
),
]
