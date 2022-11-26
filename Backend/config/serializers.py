from rest_framework import serializers
from .models import Map, Path, Landmark

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        #fields = ['id', 'owner', 'title', 'publicity', 'description', 'topic']
        fields = ['id', 'owner', 'title', 'publicity']

class PathSerializer(serializers.ModelSerializer):
    class Meta:
        model = Path 
        fields = ['id', 'mapId', 'isMainPath']

class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['id', 'pathId', 'previousLandmark', 'numAnimations']