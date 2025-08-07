from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Manage.urls')),  # Ensure 'Manage.urls' is included correctly

    
]