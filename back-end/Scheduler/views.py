from datetime import datetime, timedelta
from django.utils import timezone
from apscheduler.triggers.cron import CronTrigger

from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, filters, status
from django.template.loader import render_to_string
from sistema import settings
from .serializer import UserSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
import threading
from .models import UsuarioSobreescrito
from django.core.mail import EmailMultiAlternatives
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

@api_view(['POST'])
def iniciarSesion(request):
    
    user = get_object_or_404(UsuarioSobreescrito, email=request.data['email'])
    
    if not user.check_password(request.data['password']):
        return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
     #aqui retorna el token
    return Response({"token": token.key}, status=status.HTTP_200_OK)

#registro de usuario
@api_view(['POST'])
def registro(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        print(request.data)
        # Verificar si el usuario ya existe por email
        if UsuarioSobreescrito.objects.filter(email=request.data.get('email')).exists():
            return Response({'error': 'El usuario ya se encuentra registrado'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(serializer.validated_data['password'])
            user.save()
            # Crea el token y lo guarda
            token = Token.objects.create(user=user)
            
            # Definir la función de envío de correo
            def send_email():
                subject = 'Bienvenid@ a Website'
                from_email = settings.EMAIL_HOST_USER
                to = request.data.get('email')
                text_content = 'Gracias por registrarte en Website.'
                html_content = render_to_string('correoRegistro.html', {'subject': subject, 'message': text_content})

                email = EmailMultiAlternatives(subject, text_content, from_email, [to])
                email.attach_alternative(html_content, "text/html")
                email.send()

            # Iniciar el envío del correo en un hilo separado
            email_thread = threading.Thread(target=send_email)
            email_thread.start()
            
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#acceso al perfil
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def perfil(request):
    
    return Response("Usted está iniciando sesión con {}".format(request.user.email), status=status.HTTP_200_OK)

# # Ejemplo básico de como usar el Scheduler:

# def TaskNotificacion():
#     print('Ejectuando tarea')
    
# # Crear una instancia del Scheduler
# scheduler = BackgroundScheduler()
# scheduler.add_job(TaskNotificacion, 'interval', seconds=10)  # Configura el intervalo en segundos
# scheduler.start()


#-------------------------------------------------------------------------------

# Ejercicio (1) ------Mirar que usuarios tienen 18 pero estan registrados con TI

# PASO 1 = Configuramos el Scheduler
scheduler = BackgroundScheduler()

# PASO 2 = Hacemos la función
def verificar_usuarios():
    hoy = datetime.now() #Configuramos el dia de hoy para que haga la operación
    usuarios = UsuarioSobreescrito.objects.all() # Trae todos los datos del model de Usuario

    # Se hace un for para recorrer cada dato de los usuarios registrados
    for usuario in usuarios:

        # Primer IF: Si el tipo de documento es "TI" entonces...
        if usuario.tipoDocumento == 'TI':
            fecha_nacimiento = usuario.fechaNacimiento
        # Segundo IF: Se procede a hacer la resta del año actual con el año de nacimiento 
            if fecha_nacimiento:
                edad = hoy.year - fecha_nacimiento.year - ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
                # Tercer IF: Si la edad es mayor o igual a 18 años y esta registrado con TI entonces
                # se hará uso de la funcion que avisa sobre el cambio que debe hacer
                if edad >= 18:
                    mostrar_notificacion(usuario)

def mostrar_notificacion(usuario):
    # Imprimir el mensaje en la terminal
    print(f"- Actualización de datos: El usuario {usuario.username} con número de documento {usuario.numeroDocumento} debe actualizar sus datos.")

# --------------------------------------------------------------------------------

# Ejercicio (2) ------ Notificación para hacer un cambio de contraseña

# PASO 1 = Hacemos la función
def notificar_cambio_contrasena():
    hoy = datetime.now() # Configuramos el dia de hoy para que haga la operación
    usuarios = UsuarioSobreescrito.objects.all() # Trae todos los datos del model de Usuario 
    
    # Se hace un FOR para recorrer cada dato de los usuarios registrados y decirles que cambien la contraseña
    for usuario in usuarios:
    
        print(f"- Cambio de contraseña: El usuario {usuario.username} debe cambiar su contraseña.")
# --------------------------------------------------------------------------------

#Ejercicio (3) ------Aviso de cuenta bloqueada para aquel usuario que no se conecta desde hace 1 mes

# PASO 1 = Hacemos la función

def verificar_inactividad():
    hoy = timezone.now()  # Usa timezone.now() para obtener la fecha y hora actual
    un_mes_atras = hoy - timedelta(days=30) # Está creando una fecha que representa el punto en el tiempo hace un mes desde ahora
    usuarios = UsuarioSobreescrito.objects.all() # Trae todos los datos del model de Usuario

    # Se hace un FOR para recorrer cada dato de los usuarios registrados
    for usuario in usuarios:
        # Primer IF : Si el ultimo inicio de sesión está en None o es Null (en la base de datos)...
        if usuario.last_login is None:
            continue  # Omite el usuario

        # Segundo IF : Si la ultima vez que inició sesión fue la fecha que establecimos como un limite (Si fue hace mas de 30 dias)...
        if usuario.last_login < un_mes_atras:
            usuario.is_active = False # Se desactiva la cuenta del usuario.
            usuario.save() # Guarda los cambios realizados en el objeto usuario en la base de datos.
            # Se manda un mensaje a la terminal diciendo quienes no se conectan desde hace 30 dias.
            print(f"- Bloqueo de cuenta: {usuario.username} no se conecta desde {usuario.last_login}. Se procederá a bloquear la cuenta.")
            
# Configuramos la ejecución de los Scheduler:

scheduler.add_job(verificar_usuarios, IntervalTrigger(seconds=20)) # EJERCICIO 1 = Cada 20 segundos le va a decir qn esta con TI teniendo 18
scheduler.add_job(notificar_cambio_contrasena, IntervalTrigger(seconds=10)) # EJERCICIO 2 = Cada 10 segundos le va a decir a los usuarios que cambien de contraseña
scheduler.add_job(verificar_inactividad, IntervalTrigger(seconds=55)) # EJERCICIO 3 = Cada 55 segundos va a decir quienes no se conectan desde hace 30 dias
scheduler.start() # Ponemos a correr el scheduler
