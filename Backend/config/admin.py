from django.contrib import admin
from .models import Map, Path, Landmark, ImageBox


admin.site.register(Map)
admin.site.register(Path)
admin.site.register(Landmark)
admin.site.register(ImageBox)