import json
from django.http import JsonResponse
from .models import Map, Path, Landmark
from .serializers import MapSerializer, PathSerializer, LandmarkSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


#TODO: integrate w/ API Gateway


@api_view(['POST'])
def createMap(request): #Will also create a path and a landmark
    print(type(request.data))

    request.data["title"] = "Untitled Map"
    request.data["publicity"] = "p"

    #Create map
    mapSerializer = MapSerializer(data = request.data)
    if mapSerializer.is_valid():
        mapSerializer.save()
        #Create path
        pathSerializer = PathSerializer(data = {"mapId": mapSerializer.data["id"], "isMainPath": True})
        if pathSerializer.is_valid():
            #Create landmark
            pathSerializer.save()
            landmarkSerializer = LandmarkSerializer(data = {"pathId": pathSerializer.data["id"], "previousLandmark": None, "numAnimations": 1})
            if landmarkSerializer.is_valid():
                landmarkSerializer.save()
        return Response(mapSerializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)