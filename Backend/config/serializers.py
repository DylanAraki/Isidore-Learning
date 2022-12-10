from rest_framework import serializers
from .models import Map, Path, Landmark, ImageBox, ShapeBox
import re

class ShapeBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShapeBox 
        fields = ['id', 'landmarkId', 'd', 'transformation']
    
class ImageBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageBox
        fields = ['id', 'landmarkId', 'x', 'y', 'width', 'height', 'transformation', 'image']
class LandmarkSerializer(serializers.ModelSerializer):
    images = ImageBoxSerializer(many=True, read_only=True)
    shapes = ShapeBoxSerializer(many=True, read_only=True)
    class Meta:
        model = Landmark
        fields = ['id', 'pathId', 'order', 'images', 'shapes']

class PathSerializer(serializers.ModelSerializer):
    landmarks = LandmarkSerializer(many=True, read_only=True)
    class Meta:
        model = Path 
        fields = ['id', 'mapId', 'isMainPath', 'landmarks']

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        #fields = ['id', 'owner', 'title', 'publicity', 'description', 'topic']
        fields = ['id', 'owner', 'lastSaved']
        #TODO: Depth?