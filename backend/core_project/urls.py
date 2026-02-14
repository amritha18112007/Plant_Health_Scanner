"""
URL configuration for core_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Prefixing with 'api/' is standard for React-Django projects
    path('api/', include('scanner_app.urls')), 
]

# This single block handles serving both Static files (CSS/JS) 
# and Media files (Heatmaps/Uploads) during development.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)