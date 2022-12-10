"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('create-map/', views.createMap),
    path('map/<int:id>/', views.getMap),
    path('main-path/<int:id>/', views.getMainPath),
    path('path/<int:id>/', views.getPath),
    path('create-image/', views.createImage),
    path('image-boxes/<int:id>/', views.updateImage),
    path('shape-boxes/<int:id>/', views.updateShape),
    path('landmark/', views.createLandmark),
    path('landmark-order/<int:id>/', views.updateLandmarkOrder),
    path('create-shape/', views.createShape)
    #path('save/', views.save)
]
