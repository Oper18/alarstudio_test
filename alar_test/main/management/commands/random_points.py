# coding: utf-8

import random

from django.core.management.base import BaseCommand

from main.models import Point, Track, TrackPoint


class Command(BaseCommand):
    help = 'Create points'

    def handle(self, *args, **options):
        for i in range(1000):
            Point.objects.create(name='point_' + str(i),
                                 x_coord=random.uniform(0.0, 10.0),
                                 y_coord=random.uniform(0.0, 10.0))
