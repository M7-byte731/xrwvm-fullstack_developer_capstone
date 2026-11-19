import json
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import CarMake, CarModel
from .restapis import get_request, post_review, analyze_review_sentiments


def _json(request):
    try:
        return json.loads(request.body or '{}')
    except (ValueError, UnicodeDecodeError):
        return {}


@csrf_exempt
@require_http_methods(['POST'])
def login_user(request):
    data = _json(request)
    user = authenticate(request, username=data.get('userName', ''), password=data.get('password', ''))
    if user:
        login(request, user)
        return JsonResponse({'userName': user.username, 'status': 'Authenticated'})
    return JsonResponse({'status': 'Invalid credentials'}, status=401)


@csrf_exempt
@require_http_methods(['GET'])
def logout_request(request):
    logout(request)
    return JsonResponse({'status': 'Logged out'})


@csrf_exempt
@require_http_methods(['POST'])
def registration(request):
    data = _json(request)
    required = ['userName', 'password', 'firstName', 'lastName', 'email']
    if any(not data.get(key) for key in required):
        return JsonResponse({'status': 'Missing required fields'}, status=400)
    if User.objects.filter(username=data['userName']).exists():
        return JsonResponse({'status': 'Username already exists'}, status=409)
    user = User.objects.create_user(data['userName'], data['email'], data['password'], first_name=data['firstName'], last_name=data['lastName'])
    login(request, user)
    return JsonResponse({'status': 'User registered', 'userName': user.username}, status=201)


def get_dealerships(request, state=None):
    dealers = get_request(f'fetchDealers/{state}' if state else 'fetchDealers')
    return JsonResponse({'status': 200, 'dealers': dealers})


def get_dealer_details(request, dealer_id):
    dealer = get_request(f'fetchDealer/{dealer_id}')
    dealer = [dealer] if isinstance(dealer, dict) else dealer
    return JsonResponse({'status': 200 if dealer else 404, 'dealer': dealer})


def get_dealer_reviews(request, dealer_id):
    reviews = get_request(f'fetchReviews/dealer/{dealer_id}')
    for review in reviews:
        review['sentiment'] = analyze_review_sentiments(review.get('review', '')).get('sentiment', 'neutral')
    return JsonResponse({'status': 200, 'reviews': reviews})


@csrf_exempt
@require_http_methods(['POST'])
def add_review(request):
    data = _json(request)
    result = post_review(data)
    if not result:
        return JsonResponse({'status': 502, 'error': 'Review service unavailable'}, status=502)
    result['sentiment'] = analyze_review_sentiments(data.get('review', '')).get('sentiment', 'neutral')
    return JsonResponse({'status': 200, 'review': result})


def get_cars(request):
    if not CarMake.objects.exists():
        for make_name, models in {'Toyota': ['Camry', 'RAV4'], 'Honda': ['Civic', 'CR-V'], 'Ford': ['F-150', 'Escape']}.items():
            make = CarMake.objects.create(name=make_name, description=f'{make_name} vehicles')
            for model_name in models:
                CarModel.objects.create(make=make, name=model_name, type='SUV' if model_name in ['RAV4', 'CR-V', 'Escape'] else 'Sedan', year=2022)
    cars = [{'CarMake': car.make.name, 'CarModel': car.name, 'Year': car.year} for car in CarModel.objects.select_related('make').all()]
    return JsonResponse({'CarModels': cars})
