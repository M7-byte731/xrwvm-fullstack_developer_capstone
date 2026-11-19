from .models import CarMake, CarModel


def initiate():
    """Add a small starter catalogue without duplicating existing rows."""
    catalogue = {
        'Toyota': [('Camry', 'Sedan'), ('RAV4', 'SUV')],
        'Honda': [('Civic', 'Sedan'), ('CR-V', 'SUV')],
        'Ford': [('F-150', 'Truck'), ('Escape', 'SUV')],
    }
    for make_name, models in catalogue.items():
        make, _ = CarMake.objects.get_or_create(name=make_name, defaults={'description': f'{make_name} vehicles'})
        for model_name, body_type in models:
            CarModel.objects.get_or_create(make=make, name=model_name, year=2022, defaults={'type': body_type})
