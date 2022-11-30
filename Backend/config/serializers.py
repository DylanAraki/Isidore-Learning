from rest_framework import serializers
from .models import Map, Path, Landmark, ImageBox

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        #fields = ['id', 'owner', 'title', 'publicity', 'description', 'topic']
        fields = ['id', 'owner', 'title', 'publicity']
        #TODO: Depth?

class PathSerializer(serializers.ModelSerializer):
    class Meta:
        model = Path 
        fields = ['id', 'mapId', 'isMainPath']

class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['id', 'pathId', 'previousLandmark', 'numAnimations']


class ImageBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageBox
        fields = ['id', 'x', 'y', 'width', 'height']