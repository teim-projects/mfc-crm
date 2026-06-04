from rest_framework import serializers
from .models import School , Student, StudentEnrollment


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'




from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = "__all__"

    def validate(self, data):

        course_type = data.get("course_type")
        level = data.get("level")

        # 🚀 VEDIC MATHS VALIDATION
        if course_type == "vedic_maths":

            allowed_levels = [
                "Level 1",
                "Level 2",
                "Level 3"
            ]

            if level not in allowed_levels:

                raise serializers.ValidationError({
                    "level":
                    "Vedic Maths only supports Level 1 to Level 3"
                })

        return data


class StudentSerializer(serializers.ModelSerializer):

    school_name = serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    course_name = serializers.CharField(
        source="course.course_type",
        read_only=True
    )

    class Meta:
        model = Student

        fields = "__all__"





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

    course_name =serializers.CharField(
        source="course.course_type",
        read_only=True
    )

    level =serializers.CharField(
        source="course.level",
        read_only=True
    )

    class Meta:

        model = StudentEnrollment

        fields = "__all__"