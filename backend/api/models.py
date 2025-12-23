from django.db import models


class EnergyGeneration(models.Model):
    timestamp = models.DateTimeField(
        help_text="UTC date and time of the record")
    country_code = models.CharField(
        max_length=50, help_text="ISO Country Code (e.g., GB)")
    resource_type = models.CharField(
        max_length=100, help_text="Energy source (e.g., Wind)")
    actual_generation_mw = models.FloatField(null=True, blank=True)
    forecast_generation_mw = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Energy Generation Records"

    def __str__(self):
        return f"{self.country_code} | {self.resource_type} | {self.timestamp}"
