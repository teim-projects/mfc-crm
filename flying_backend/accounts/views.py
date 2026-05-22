from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer,RoleSerializer
from rest_framework.permissions import IsAuthenticated



from rest_framework import generics
from .models import Role, User
from .serializers import RoleSerializer, UserSerializer


# Create Role
class RoleCreateView(generics.CreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


# List Roles
class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


# Create Staff
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# views.py
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )

            if user:
                refresh = RefreshToken.for_user(user)

                return Response({
                    "access": str(refresh.access_token),
                    "username": user.username,
                    "role": user.role
                })

        return Response({"error": "Invalid credentials"}, status=401)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User


class ToggleStaffStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:

            user = User.objects.get(pk=pk)

            user.is_active = not user.is_active
            user.save()

            return Response({
                "message": "Status updated successfully",
                "is_active": user.is_active
            })

        except User.DoesNotExist:

            return Response({
                "error": "User not found"
            }, status=404)