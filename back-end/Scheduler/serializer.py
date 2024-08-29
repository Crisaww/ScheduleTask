from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UsuarioSobreescrito  


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioSobreescrito
        fields = ['id', 'tipoDocumento', 'numeroDocumento', 'fechaNacimiento', 'username', 'email', 'password']
        
    def create(self, validated_data):
        user = UsuarioSobreescrito.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            tipoDocumento=validated_data.get('tipoDocumento', ''),
            numeroDocumento=validated_data.get('numeroDocumento', ''),
            fechaNacimiento=validated_data.get('fechaNacimiento', None)
        )
        return user

