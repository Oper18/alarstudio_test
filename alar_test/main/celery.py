# coding: utf-8

from __future__ import absolute_import, unicode_literals

import os
import random
import string

from celery import Celery

from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alar_test.settings')

app = Celery('main')

app.config_from_object('django.conf:settings')

app.autodiscover_tasks()


@app.task
def make_track(start_point, end_point, user):
    from .models import Point, Track, TrackPoint
    User = get_user_model()
    start_point = Point.objects.filter(pk=start_point).first()
    end_point = Point.objects.filter(pk=end_point).first()
    mid_points = [start_point]
    for i in [random.randint(0, 999), random.randint(0, 999)]:
        mid_points.append(Point.objects.filter(name='point_' + str(i)).first())
    mid_points.append(end_point)
    track = Track.objects.create(name=''.join(random.choices(string.ascii_lowercase, k=5)),
                                 owner=User.objects.get(pk=user))
    for i, p in enumerate(mid_points):
        TrackPoint.objects.create(track=track,
                                  point=p,
                                  num=i)
