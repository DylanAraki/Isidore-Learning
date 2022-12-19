import base64
import json
from django import forms
from django.http import JsonResponse
from .models import ImageBox, Map, Path, Landmark, ShapeBox
from .serializers import ImageBoxSerializer, MapSerializer, PathSerializer, LandmarkSerializer, ShapeBoxSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from base64 import decodebytes
from datetime import datetime, timezone
import re


import uuid



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
            landmarkSerializer = LandmarkSerializer(data = {"pathId": pathSerializer.data["id"], "order": 0, "numAnimations": 1})
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
    return Response(pathSerializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def createLandmark(request):
    print(request.data)
    serializer = LandmarkSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def createShape(request):
    print(request.data['d'])
    serializer = ShapeBoxSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def createImage(request):
    imageFile = request.FILES.get('image')
    #TODO: Add file type verification

    imageFile.name = str(uuid.uuid4()) #Virtually zero chance of a collision
    
    serializer = ImageBoxSerializer(data={'landmarkId': int(request.POST.get('landmarkId')), 'x': int(request.POST.get('x')), 'y': int(request.POST.get('y')), 'width': int(request.POST.get('width')), 'height': int(request.POST.get('height')), 'image': imageFile})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['PUT'])
def updateImage(request, id):
    #TODO: Add error checking
    ImageBox.objects.filter(id = id).update(x = request.data['x'], y = request.data['y'], width = request.data['width'], height = request.data['height'], transformation = request.data['transformation'])
    return Response(status=status.HTTP_200_OK)
@api_view(['PUT'])
def updateShape(request, id):
    ShapeBox.objects.filter(id = id).update(d = request.data['d'], transformation = request.data['transformation'])
    return Response(status=status.HTTP_200_OK)

@api_view(['PUT'])
def updateLandmarkOrder(request, id):
    landmarkObj = Landmark.objects.get(pk=id)
    if landmarkObj:
        landmarkObj.order= request.data['order']
        landmarkObj.save(update_fields=['order'])
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    """ updateSuccessful = Landmark.objects.get(pk=id).update(order=request.data['order']).exists()
    if updateSuccessful:
        
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST) """



@api_view(['DELETE'])
def landmark(request, id):
    obj = get_object_or_404(Landmark, pk=id)
    obj.delete()
    return Response(status=status.HTTP_200_OK)