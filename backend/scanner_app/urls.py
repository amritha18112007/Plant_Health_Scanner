# backend/scanner_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # User & Authentication APIs
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),

    # Scan & History APIs
    path('scan/upload/', views.handle_scan_upload, name='upload_scan'), 
    path('user/history/', views.get_scan_history, name='scan_history'), 

    # Admin & Monitoring APIs
    path('admin/metrics/', views.get_admin_metrics, name='admin_metrics'),
    path('login/', views.login_user, name='login'),       # Final URL: /api/login/
    path('register/', views.register_user, name='register'), # Final URL: /api/register/
]