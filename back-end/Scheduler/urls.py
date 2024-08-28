from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from Scheduler import views

router_usuarios = routers.DefaultRouter()
router_usuarios.register(r'usuario', views.UsuarioView)

urlpatterns = [
    path("docs/", include_docs_urls(title="ScheduleTask Api")),
    path("api/v1/", include(router_usuarios.urls)),
    re_path('api/v1/iniciarSesion', views.iniciarSesion),
    re_path('api/v1/registro', views.registro),
    re_path('api/v1/perfil', views.perfil),
]
