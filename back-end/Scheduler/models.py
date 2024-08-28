from django.db import models

# Create your models here.

class Usuario(models.Model):
    
    TI = 'TI'
    CC = 'CC'
    CE = 'CE'
    
    tipo_documento = [
        (TI, 'TI'),
        (CC, 'CC'),
        (CE, 'CE'),
    ]
    
    tipoDocumento = models.CharField(choices=tipo_documento, max_length=20)
    
    
    
    numeroDocumento = models.IntegerField()
    fechaNacimiento = models.DateField()
    contrasena = models.CharField(max_length=13)
    fechaActuaContrasena = models.DateField()
    fechaInicioSesion = models.DateField()
    correo = models.CharField(max_length=150)
    campoNotificar = models.BooleanField(default=False)
    
   
    activo = 'Activo'
    Inactivo = 'Inactivo'
    
    estado_tipoInicioSesion = [
        (activo, 'Activo'),
        (Inactivo, 'Inactivo'),  
    ]
    
    estado_InicioSesion = models.CharField(choices=estado_tipoInicioSesion, max_length=20)
    
    
    
    def __str__(self):
        return self.tipoDocumento


    

    