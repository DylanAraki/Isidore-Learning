# Generated by Django 4.1.3 on 2022-11-26 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Landmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pathId', models.IntegerField()),
                ('previousLandmark', models.IntegerField()),
                ('numAnimations', models.SmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Map',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=25)),
                ('publicity', models.CharField(choices=[('v', 'Visible'), ('p', 'Personal')], max_length=1)),
                ('description', models.CharField(max_length=500)),
                ('topic', models.CharField(choices=[('und', 'Undeclared'), ('PHY', 'Physics'), ('MAT', 'Mathematics')], max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Path',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mapId', models.IntegerField()),
                ('isMainPath', models.BooleanField()),
            ],
        ),
    ]
