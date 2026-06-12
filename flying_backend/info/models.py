from django.db import models

# Create your models here.


from django.db import models


class School(models.Model):
    school_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    contact_person= models.CharField(max_length=255)
    coordinator_name = models.CharField(max_length=255, blank=True, null=True)
    coordinator_number = models.CharField(max_length=15, blank=True, null=True)
    landline_number = models.CharField(max_length=15, blank=True, null=True)
    mobile_number = models.CharField(max_length=15)
    contact_person_no = models.CharField(max_length=15)
    FEES_CHOICES = (
    ('parents', 'Parents'),
    ('school', 'School'),
    )
    
    fees_taken_from = models.CharField(
        max_length=20,
        choices=FEES_CHOICES,
        default='parents'
    )

    


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.school_name



from django.db import models


class CourseType(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class CourseLevel(models.Model):
    course_type = models.ForeignKey(
        CourseType,
        on_delete=models.CASCADE,
        related_name="levels"
    )
    level_name = models.CharField(max_length=100)
    order_no = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.course_type.name} - {self.level_name}"        

class Course(models.Model):

    

    course_type = models.ForeignKey(
        CourseType,
        on_delete=models.CASCADE
        
    )

    level = models.ForeignKey(
        CourseLevel,
        on_delete=models.CASCADE
    )

    tuition_fees = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    duration = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # def clean(self):

    #     # 🚀 VEDIC MATHS ONLY 3 LEVELS
    #     if self.course_type == "vedic_maths":

    #         allowed_levels = [
    #             "Level 1",
    #             "Level 2",
    #             "Level 3"
    #         ]

    #         if self.level not in allowed_levels:

    #             raise ValidationError({
    #                 "level":
    #                 "Vedic Maths only supports Level 1 to Level 3"
    #             })

    def __str__(self):
        return f"{self.course_type.name} - {self.level.level_name}"


class Student(models.Model):
    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )


    student_name = models.CharField(
        max_length=255
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        null=True,
        blank=True
    )

    standard = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    section = models.CharField(
        max_length=10,
        null=True,
        blank=True
    )


    # 🏫 LINK SCHOOL
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        related_name="students"
    )

    # 📘 LINK COURSE
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="students"
    )

   

    # 👨 PARENT INFO
    parent_name = models.CharField(
        max_length=255
    )

    parent_contact = models.CharField(
        max_length=15
    )

    parent_email = models.EmailField(
        blank=True,
        null=True
    )

    parent_address = models.TextField()
    rte = models.BooleanField(default=False)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.student_name



class StudentEnrollment(models.Model):

    STATUS_CHOICES = (

        ("active", "Active"),

        ("completed", "Completed"),

        ("promoted", "Promoted"),

        ("dropped", "Dropped"),
    )

    student = models.ForeignKey(

        Student,

        on_delete=models.CASCADE,

        related_name="enrollments"
    )

    school = models.ForeignKey(

        School,

        on_delete=models.CASCADE
    )

    course = models.ForeignKey(

        Course,

        on_delete=models.CASCADE
    )

    enrolled_date = models.DateField(
        auto_now_add=True
    )

    completed_date = models.DateField(

        null=True,

        blank=True
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="active"
    )

    remarks = models.TextField(

        blank=True,

        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.student.student_name}"
            f" - "
            f"{self.course}"
        )
