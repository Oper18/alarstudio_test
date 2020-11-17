# coding: utf-8

import random

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create points'

    def handle(self, *args, **options):
        User.objects.create_superuser(username='admin',
                                      email='admin@admin.net',
                                      password='admin')
        User.objects.create(username='test1',
                            password='test1')
        User.objects.create(username='test2',
                            password='test2')
