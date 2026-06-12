from rest_framework import serializers
from .models import School , Student, StudentEnrollment
from .models import CourseType, CourseLevel


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'




from rest_framework import serializers
from .models import Course

class CourseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseType
        fields = "__all__"


class CourseLevelSerializer(serializers.ModelSerializer):

    course_type_name = serializers.CharField(
        source="course_type.name",
        read_only=True
    )

    class Meta:
        model = CourseLevel
        fields = "__all__"        



class CourseSerializer(serializers.ModelSerializer):

    
    course_type_name = serializers.CharField(
            source="course_type.name",
            read_only=True
        )
    
    level_name = serializers.CharField(
        source="level.level_name",
        read_only=True
    )    
    
    class Meta:
        model = Course
        fields = "__all__"

    def validate(self, data):
        return data

class StudentSerializer(serializers.ModelSerializer):

    school_name = serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    course_type_name = serializers.CharField(
        source="course.course_type.name",
        read_only=True
    )

    level_name = serializers.CharField(
        source="course.level.level_name",
        read_only=True
    )

    course_display = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"

    def get_course_display(self, obj):
        return (
            f"{obj.course.course_type.name}"
            f" - "
            f"{obj.course.level.level_name}"
        )


class StudentEnrollmentSerializer(
    serializers.ModelSerializer
):

    student_name =serializers.CharField(
        source="student.student_name",
        read_only=True
    )

    school_name =serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    course_type_name = serializers.CharField(
    source="course.course_type.name",
    read_only=True
)

    level_name = serializers.CharField(
        source="course.level.level_name",
        read_only=True
    )

    class Meta:

        model = StudentEnrollment

        fields = "__all__"