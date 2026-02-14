import pymysql
import os
from pathlib import Path
from datetime import timedelta 

# 1. DATABASE BRIDGE
pymysql.install_as_MySQLdb()
pymysql.version_info = (2, 2, 1, "final", 0) 

# 2. MariaDB 10.4 COMPATIBILITY HACKS
from django.db.backends.base.base import BaseDatabaseWrapper
BaseDatabaseWrapper.check_database_version_supported = lambda self: None

from django.db.backends.mysql.base import DatabaseWrapper
DatabaseWrapper.features_class.can_return_columns_from_insert = property(lambda self: False)

# --- PATHS ---
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-o&=i+l$z+*@w*%bou5b@&i$%la!jbd3-!#r5)p@i&s16*@&fv5'
DEBUG = True
ALLOWED_HOSTS = ['*']

# --- APPS ---
INSTALLED_APPS = [
    'django.contrib.admin', # This requires the TEMPLATES block below!
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'scanner_app.apps.ScannerAppConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core_project.urls'

# --- THE FIX: ADDING THE MISSING TEMPLATES BLOCK ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [], # Add any global template folders here if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core_project.wsgi.application'

# --- DATABASE (XAMPP MySQL) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'planthealthdb',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# --- SECURITY & JWT ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# --- REGIONAL SETTINGS ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata' # Locked to Sankarnagar time
USE_I18N = True
USE_TZ = True

# --- STATIC & MEDIA ---
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True