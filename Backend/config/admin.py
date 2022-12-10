from django.contrib import admin
from .models import Map, Path, Landmark, ImageBox, ShapeBox


admin.site.register(Map)
admin.site.register(Path)
admin.site.register(Landmark)
admin.site.register(ImageBox)
admin.site.register(ShapeBox)