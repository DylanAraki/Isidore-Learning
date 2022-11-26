from django.db import models
from django.contrib.postgres.fields import ArrayField


PUBLICITY = {
    ('v', 'Visible'), #Map is visible to all users
    ('p', 'Personal') #Map can only be seen by its creator
}
SUBJECTS = {
    ('MAT', 'Mathematics'),
    ('PHY', 'Physics')
}


class Map(models.Model):
    owner = models.CharField(max_length=50)
    title = models.CharField(max_length=25)
    publicity = models.CharField(max_length=1, choices=PUBLICITY)
    #tags = ArrayField(models.CharField(max_length=30, blank=True), size=5)
    description = models.CharField(max_length=500, null=True)
    topic = models.CharField(max_length=3, choices=SUBJECTS, null=True)
    #TODO: Image

class Path(models.Model):
    mapId = models.ForeignKey(Map, on_delete=models.CASCADE)
    isMainPath = models.BooleanField()

class Landmark(models.Model):
    pathId = models.ForeignKey(Path, on_delete=models.CASCADE)
    previousLandmark = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    numAnimations = models.SmallIntegerField()