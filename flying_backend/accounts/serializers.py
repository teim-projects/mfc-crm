from rest_framework import serializers
from .models import Role, User


# ✅ ROLE SERIALIZER (ADD THIS)
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


# ✅ USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):

    role_name = serializers.CharField(
        source="role.name",
        read_only=True
    )

    class Meta:

        model = User

        fields = [
            'id',
            'username',
            'password',
            'role',
            'role_name',
            'is_active',
            'is_superuser'
        ]

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):

        user = User(

            username=validated_data['username'],

            role=validated_data.get(
                'role'
            ),

            is_active=validated_data.get(
                'is_active',
                True
            )
        )

        user.set_password(
            validated_data['password']
        )

        user.save()

        return user

# ✅ LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)