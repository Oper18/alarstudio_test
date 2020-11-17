#!/bin/bash

python manage.py migrate
gunicorn -b 0.0.0.0:8000 --access-logfile - --error-logfile - alar_test.wsgi &
celery -A main worker -l info -B
