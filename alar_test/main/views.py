# coding: utf-8

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView

from django.contrib.auth import get_user_model

from .models import Point, Track
from .serializers import PointSerializer, TrackSerializer, UserSerializer, UserGlobalSerializer
from .celery import make_track

User = get_user_model()


class InfoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({'me': UserSerializer(request.user).data,
                         'info': UserGlobalSerializer(User.objects.all(), many=True).data}, status=status.HTTP_200_OK)


class PointView(ListAPIView):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class TrackView(ListAPIView,
                CreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        make_track.delay(request.data.get('first_point'), request.data.get('end_point'), request.user.pk)
        return Response(status=status.HTTP_200_OK)
