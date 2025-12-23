from django.contrib import admin
from .models import EnergyGeneration


@admin.register(EnergyGeneration)
class EnergyGenerationAdmin(admin.ModelAdmin):
    list_display = (
        'timestamp',
        'country_code',
        'resource_type',
        'actual_generation_mw',
        'forecast_generation_mw'
    )

    list_filter = ('country_code', 'resource_type', 'timestamp')

    search_fields = ('country_code', 'resource_type')

    date_hierarchy = 'timestamp'

    ordering = ('-timestamp',)

    readonly_fields = ('timestamp',)
