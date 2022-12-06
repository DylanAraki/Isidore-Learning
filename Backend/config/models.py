from django.db import models
from django.contrib.postgres.fields import ArrayField


PUBLICITY = {
    ('v', 'Visible'), #Map is visible to all users
    ('p', 'Personal') #Map can only be seen by its creator
}
SUBJECTS = {
    ('MAT', 'Mathematics'),
    ('PHY', 'Physics'),
    ('CSC', 'Computer Science')
}

#TODO: Add default values rather than manually add them on creation
class Map(models.Model):
    owner = models.CharField(max_length=50) #Unique user code
    title = models.CharField(max_length=50, default="Untitled Learning Map") 
    publicity = models.CharField(max_length=1, choices=PUBLICITY, default='p')
    #tags = ArrayField(models.CharField(max_length=30, blank=True), size=5, null=True)
    description = models.CharField(max_length=500, null=True)
    topic = models.CharField(max_length=3, choices=SUBJECTS, null=True)
    #Image will be found through the PK in a file system
    lastSaved = models.DateTimeField(auto_now_add=True, blank=True)

class Path(models.Model):
    mapId = models.ForeignKey(Map, on_delete=models.CASCADE)
    isMainPath = models.BooleanField()

class Landmark(models.Model):
    pathId = models.ForeignKey(Path, on_delete=models.CASCADE, related_name='landmarks')
    nextLandmark = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    numAnimations = models.SmallIntegerField(default=1)

class LegendEntry(models.Model):
    landmarkId = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name='legend')
    nextEntry = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    #symbol = models.CharField(max_length=10)
    #meaning = models.CharField(max_length=15)
    #TODO: Need a way to represent sub and superscript for this
    math = models.BooleanField()

class TextBox(models.Model):
    landmarkId = models.ForeignKey(Landmark, on_delete=models.CASCADE)
    x: models.IntegerField()
    y: models.IntegerField()
    width: models.IntegerField()
    height: models.IntegerField()
    #transformation is an array of size 6 of integers
    animationAppearance: models.SmallIntegerField(default=0)
    #TODO: Text content with its styles should probably just be stored directly as an array with all the styles. Maybe its own table idk

class ShapeBox(models.Model):
    landmarkId = models.ForeignKey(Landmark, on_delete=models.CASCADE)
    #TODO: transformation is an array of size 6 of integers
    animationAppearance: models.SmallIntegerField(default=0)
    #TODO: Here, an array of letters plus up to 4 commands. For now, this can be an array directly

class ImageBox(models.Model):
    landmarkId = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name="image")
    x: models.IntegerField()
    y: models.IntegerField()
    width: models.IntegerField()
    height: models.IntegerField()
    #Image will be named based on primary key. 
    #TODO: transformation is an array of size 6 of integers
    animationAppearance: models.SmallIntegerField(default=0)

class Notifications(models.Model):
    notificationMessage: models.CharField(max_length=500)
    sender: models.CharField(max_length=50)
    receiever: models.CharField(max_length=50)