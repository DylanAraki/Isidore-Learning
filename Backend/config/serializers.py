from rest_framework import serializers
from .models import Map, Path, Landmark, ImageBox


"""
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageBox
        fields = ['id', 'landmarkId', 'x', 'y', 'width', 'height']
"""
class LandmarkSerializer(serializers.ModelSerializer):
    #image = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Landmark
        fields = ['id', 'pathId', 'nextLandmark']

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


class ImageBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageBox
        fields = ['id', 'x', 'y', 'width', 'height']