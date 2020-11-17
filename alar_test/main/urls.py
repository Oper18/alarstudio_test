# coding: utf-8

from django.urls import re_path
from rest_framework_simplejwt import views as jwt_views

from .views import PointView, TrackView, InfoView

urlpatterns = [
    re_path('^api/token/$', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path('^api/token/refresh/$', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    re_path('^api/get_points/$', PointView.as_view()),
    re_path('^api/track/$', TrackView.as_view()),
    re_path('^api/info/$', InfoView.as_view()),
]