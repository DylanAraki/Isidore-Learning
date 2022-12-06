import base64
import json
from django import forms
from django.http import JsonResponse
from .models import ImageBox, LegendEntry, Map, Path, Landmark, ShapeBox, TextBox
from .serializers import MapSerializer, PathSerializer, LandmarkSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base64 import decodebytes
from datetime import datetime, timezone


#TODO: integrate w/ API Gateway

@api_view(['POST'])
def createMap(request): #Will also create a path and a landmark
    #request.data['lastSaved'] = datetime.now(timezone.utc) #Record the time of creation
    #Create the map
    mapSerializer = MapSerializer(data = request.data) 
    if mapSerializer.is_valid():

        print(mapSerializer.validated_data)

        mapSerializer.save()
        #Create the main path
        pathSerializer = PathSerializer(data = {"mapId": mapSerializer.data["id"], "isMainPath": True})
        

        if pathSerializer.is_valid():

            print(pathSerializer.validated_data)


            #Create the first landmark
            pathSerializer.save()
            landmarkSerializer = LandmarkSerializer(data = {"pathId": pathSerializer.data["id"], "previousLandmark": None, "numAnimations": 1})
            if landmarkSerializer.is_valid():
                landmarkSerializer.save()
                #Return the response of all the unique IDs (default values will be assigned by client)
                responseData = {"id": mapSerializer.data["id"], "owner": mapSerializer.data["owner"], "lastSaved": mapSerializer.data["lastSaved"], "mainPath": pathSerializer.data["id"], "firstLandmark": landmarkSerializer.data["id"]}
                return Response(responseData, status=status.HTTP_201_CREATED)
    
    #If something goes wrong, return an internal server error
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getMap(request, id): #The client requests access to a map by its ID
    try:
        map = Map.objects.get(pk=id)
    except Map.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MapSerializer(map)
        return Response(serializer.data)

@api_view(['GET'])
def getPath(request, id): #The client request access to a path (and its landmarks and their content) by ID
    try:
        path = Path.objects.get(pk=id)
    except path.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    pathSerializer = PathSerializer(path)
    return Response(pathSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def getMainPath(request, id):
    try:
        path = Path.objects.get(mapId=id, isMainPath=True)
    except path.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    pathSerializer = PathSerializer(path)
    print(pathSerializer.data)
    return Response(pathSerializer.data, status=status.HTTP_200_OK)





@api_view(['POST'])
def createImage(request):
    #TODO: Setup properly
    file = request.FILES.get('image')
    with open('images/test.jpg', 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    return Response(status=status.HTTP_201_CREATED)