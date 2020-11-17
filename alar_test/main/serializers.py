# coding: utf-8

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Point, Track, TrackPoint

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']


class UserGlobalSerializer(serializers.ModelSerializer):
    tracks = serializers.SerializerMethodField('get_tracks')
    sum_length = serializers.SerializerMethodField('get_sum_length')

    class Meta:
        model = User
        fields = ['id', 'username', 'tracks', 'sum_length']

    def get_tracks(self, obj):
        return obj.tracks.all().count()

    def get_sum_length(self, obj):
        length = 0
        for t in obj.tracks.all():
            length += t.points.all().count()
        return length


class PointSerializer(serializers.ModelSerializer):

    class Meta:
        model = Point
        fields = ['id', 'name', 'x_coord', 'y_coord']


class TrackSerializer(serializers.ModelSerializer):
    points = serializers.SerializerMethodField('get_points')
    owner = UserSerializer()

    class Meta:
        model = Track
        fields = ['id', 'name', 'points', 'owner']

    def get_points(self, obj):
        points = []
        for p in TrackPoint.objects.filter(point__in=obj.points.all()):
            p_dict = dict(PointSerializer(p.point).data)
            p_dict.update({'num': p.num})
            points.append(p_dict)
        points.sort(key=lambda s: s['num'])
        return points
