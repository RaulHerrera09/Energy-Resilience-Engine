from rest_framework import serializers
from .models import EnergyGeneration


class EnergyGenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyGeneration
        # include everything needed for the charts
        fields = ['timestamp', 'country_code', 'resource_type',
                  'actual_generation_mw', 'forecast_generation_mw']
