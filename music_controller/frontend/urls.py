from django.urls import path, re_path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    # re_path(r'^.*$', index, name='index'),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
]