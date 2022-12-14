# Generated by Django 4.1.3 on 2022-12-08 19:37

import config.models
import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0002_remove_legendentry_landmarkid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagebox',
            name='transformation',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), default=config.models.defaultTransformation, size=6),
        ),
        migrations.AlterField(
            model_name='map',
            name='topic',
            field=models.CharField(choices=[('PHY', 'Physics'), ('CSC', 'Computer Science'), ('MAT', 'Mathematics')], max_length=3, null=True),
        ),
    ]
