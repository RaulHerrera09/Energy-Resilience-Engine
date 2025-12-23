from django.urls import path
from .views import EnergyDataListView

urlpatterns = [
    path('energy-data/', EnergyDataListView.as_view(),
         name='energy-list'),
]
