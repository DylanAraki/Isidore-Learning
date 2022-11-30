import base64
import json
from django import forms
from django.http import JsonResponse
from .models import Map, Path, Landmark
from .serializers import MapSerializer, PathSerializer, LandmarkSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base64 import decodebytes


#TODO: integrate w/ API Gateway

@api_view(['POST'])
def createMap(request): #Will also create a path and a landmark
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
        #return Response(mapSerializer.data, status=status.HTTP_201_CREATED)
        
        #Return the response of all the unique IDs (default values will be assigned by client)
        responseData = {"id": mapSerializer.data["id"], "owner": mapSerializer.data["owner"], "mainPath": pathSerializer.data["id"], "firstLandmark": landmarkSerializer.data["id"]}
        return Response(responseData, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def mainPath(request): #Gets the main path of a map with its landmarks and content
    pass


@api_view(['POST'])
def createImage(request):
    #TODO: Setup properly
    file = request.FILES.get('image')
    with open('images/test.jpg', 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    return Response(status=status.HTTP_201_CREATED)