from django.db import models


class MembershipPlan(models.Model):

    plan_name = models.CharField(
        max_length=100,
        unique=True
    )

    monthly_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.plan_name




from django.db import models


class Company(models.Model):
    company_name = models.CharField(max_length=255)
    company_code = models.CharField(max_length=50, unique=True)

    contact_person = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, blank=True, null=True)

    phone = models.CharField(max_length=20)
    email = models.EmailField()

    address = models.TextField(blank=True, null=True)

    membership_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    tie_up_start_date = models.DateField(
        blank=True,
        null=True
    )

    tie_up_end_date = models.DateField(
        blank=True,
        null=True
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name   


class DaycareService(models.Model):

    service_name = models.CharField(
        max_length=100,
        unique=True
    )

    default_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.service_name


from django.db import models


class DaycareStudent(models.Model):

    GENDER_CHOICES = (
        ("MALE", "Male"),
        ("FEMALE", "Female"),
        ("OTHER", "Other")
    )

    child_name = models.CharField(
        max_length=255
    )

    child_photo = models.ImageField(
        upload_to="daycare/child/",
        blank=True,
        null=True
    )

    age = models.IntegerField()

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES
    )

    parent_name = models.CharField(
        max_length=255
    )

    parent_photo = models.ImageField(
        upload_to="daycare/parent/",
        blank=True,
        null=True
    )

    father_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    mother_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    mobile_no = models.CharField(
        max_length=20
    )

    alternate_mobile = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    address = models.TextField()

    emergency_contact_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    emergency_contact_no = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    company = models.ForeignKey(
        "Company",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students"
    )

    hours_per_day = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    days_per_month = models.IntegerField(
        default=30
    )

    monthly_hours = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    monthly_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    selected_services = models.JSONField(
        default=list,
        blank=True
    )

    service_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    allergies = models.TextField(
        blank=True,
        null=True
    )

    medical_notes = models.TextField(
        blank=True,
        null=True
    )

    special_instructions = models.TextField(
        blank=True,
        null=True
    )

    active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        self.monthly_hours = (
            self.hours_per_day *
            self.days_per_month
        )

        self.monthly_amount = (
            self.monthly_hours *
            self.hourly_rate
        )

        self.total_amount = (
            self.monthly_amount +
            self.service_amount
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.child_name