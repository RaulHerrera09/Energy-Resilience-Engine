from django.shortcuts import render
from rest_framework import generics
from .models import EnergyGeneration
from .serializers import EnergyGenerationSerializer


class EnergyDataListView(generics.ListAPIView):
    serializer_class = EnergyGenerationSerializer

    def get_queryset(self):
        # only return the latest 100 records to keep the dashboard fast
        country = self.request.query_params.get('country', 'DE')
        return EnergyGeneration.objects.filter(country_code=country).order_by('-timestamp')[:100]
