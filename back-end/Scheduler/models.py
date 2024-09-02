from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UsuarioSobreescrito(AbstractUser):
    TI = 'TI'
    CC = 'CC'
    CE = 'CE'

    TIPO_DOCUMENTO_CHOICES = [
        (TI, 'TI'),
        (CC, 'CC'),
        (CE, 'CE'),
    ]

    tipoDocumento = models.CharField(max_length=2, null=False, default=CC, choices=TIPO_DOCUMENTO_CHOICES)
    numeroDocumento = models.CharField(max_length=13, blank=True, null=True)
    fechaNacimiento = models.DateField(blank=True, null=True)


    

    