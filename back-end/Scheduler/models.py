from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UsuarioSobreescrito(AbstractUser):

    tipoDocumento = models.CharField(max_length=3, blank=True, null=True)
    numeroDocumento = models.CharField(max_length=13, blank=True, null=True)
    fechaNacimiento = models.DateField(blank=True, null=True)


    

    