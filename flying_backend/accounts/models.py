from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class User(AbstractUser):

    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    mobile_number = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    spouse_number = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    email_id = models.EmailField(
        blank=True,
        null=True
    )

    joining_date = models.DateField(
        blank=True,
        null=True
    )

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username