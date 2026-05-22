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


class Course(models.Model):

    COURSE_CHOICES = (
        ('vedic_maths', 'Vedic Maths'),
        ('abacus', 'Abacus'),
    )

    LEVEL_CHOICES = (
        ('Level 1', 'Level 1'),
        ('Level 2', 'Level 2'),
        ('Level 3', 'Level 3'),
        ('Level 4', 'Level 4'),
        ('Level 5', 'Level 5'),
        ('Level 6', 'Level 6'),
        ('Level 7', 'Level 7'),
        ('Level 8', 'Level 8'),
        ('Level 9', 'Level 9'),
        ('Level 10', 'Level 10'),
        ('Level 11', 'Level 11'),
        ('Level 12', 'Level 12'),
    )

    course_type = models.CharField(
        max_length=50,
        choices=COURSE_CHOICES
    )

    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES
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

    def clean(self):

        # 🚀 VEDIC MATHS ONLY 3 LEVELS
        if self.course_type == "vedic_maths":

            allowed_levels = [
                "Level 1",
                "Level 2",
                "Level 3"
            ]

            if self.level not in allowed_levels:

                raise ValidationError({
                    "level":
                    "Vedic Maths only supports Level 1 to Level 3"
                })

    def __str__(self):
        return f"{self.get_course_type_display()} - {self.level}"


class Student(models.Model):

    student_name = models.CharField(
        max_length=255
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

    # 🎚️ COURSE LEVEL
    level = models.CharField(
        max_length=20
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