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
        
            'address',
            'mobile_number',
            'spouse_number',
            'email_id',
            'joining_date',
            'salary',
        
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
    
            role=validated_data.get('role'),
    
            address=validated_data.get(
                'address'
            ),
    
            mobile_number=validated_data.get(
                'mobile_number'
            ),
    
            spouse_number=validated_data.get(
                'spouse_number'
            ),
    
            email_id=validated_data.get(
                'email_id'
            ),
    
            joining_date=validated_data.get(
                'joining_date'
            ),
    
            salary=validated_data.get(
                'salary'
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


    def update(
        self,
        instance,
        validated_data
    ):
    
        password = validated_data.pop(
            "password",
            None
        )
    
        for attr, value in (
            validated_data.items()
        ):
            setattr(
                instance,
                attr,
                value
            )
    
        if password:
            instance.set_password(
                password
            )
    
        instance.save()
    
        return instance


# ✅ LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)