from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    BODY_TYPES = [(x, x) for x in ('Sedan', 'SUV', 'Wagon', 'Coupe', 'Truck', 'Van', 'Other')]
    make = models.ForeignKey(CarMake, related_name='models', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=BODY_TYPES, default='Sedan')
    year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2026)])

    class Meta:
        unique_together = ('make', 'name', 'year')

    def __str__(self):
        return f'{self.make} {self.name} ({self.year})'
