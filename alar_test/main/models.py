# coding: utf-8

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Point(models.Model):
    name = models.CharField(verbose_name='point name', max_length=255)
    x_coord = models.FloatField(verbose_name='point X coordinate', default=0.0, blank=True)
    y_coord = models.FloatField(verbose_name='point Y coordinate', default=0.0, blank=True)

    def __str__(self):
        return self.name


class Track(models.Model):
    name = models.CharField(verbose_name='track name', max_length=255)
    points = models.ManyToManyField(Point, through='TrackPoint')
    owner = models.ForeignKey(User, verbose_name='track owner', on_delete=models.CASCADE, related_name='tracks')

    def __str__(self):
        return self.name


class TrackPoint(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    point = models.ForeignKey(Point, on_delete=models.CASCADE)
    num = models.IntegerField(verbose_name='position in way')

    def __str__(self):
        return str(self.num)
