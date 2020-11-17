# coding: utf-8

from django.contrib import admin

from .models import Point, Track, TrackPoint


class PointAdmin(admin.ModelAdmin):
    pass

admin.site.register(Point, PointAdmin)


class TrackAdmin(admin.ModelAdmin):
    pass

admin.site.register(Track, TrackAdmin)


class TrackPointAdmin(admin.ModelAdmin):
    pass

admin.site.register(TrackPoint, TrackPointAdmin)
