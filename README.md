Repository Name: xrwvm-fullstack_developer_capstone
Project Name: Cars Dealerships — IBM Full Stack Capstone

# Cars Dealerships — IBM Full Stack Capstone

A full stack dealership directory and customer review application built from the [IBM Skills Network capstone template](https://github.com/ibm-developer-skills-network/xrwvm-fullstack_developer_capstone).

## Project

The application combines a Django web/API server, a React user interface, an Express and MongoDB dealership/reviews service, and a Flask sentiment analyzer. Users can browse dealerships, filter by state, read reviews, register, sign in, and submit a review. Django Admin manages the car make and model catalogue.

## Main folders

- `server/djangoapp/` — Django endpoints, authentication, admin, and car models.
- `server/frontend/` — React pages and the static About and Contact pages.
- `server/database/` — Express API, MongoDB seed data, and Docker Compose services.
- `server/djangoapp/microservices/` — Flask sentiment analysis service.
- `deployment.yml` — Kubernetes deployment and service examples.
- `.github/workflows/ci.yml` — GitHub Actions workflow for Django checks and React builds.
- `submission/` — Arabic setup and assessment evidence guide.

## Run locally

Requirements: Python 3.10+, Node.js 18+, and Docker Desktop.

1. In `server/database`, run `docker compose up --build -d`. This starts MongoDB, Express, Flask sentiment analysis, and Mongo Express (`http://localhost:8081`).
2. In `server`, install dependencies with `python -m pip install -r requirements.txt`, apply the database migration with `python manage.py migrate`, create an admin account with `python manage.py createsuperuser`, and start Django with `python manage.py runserver`.
3. In `server/frontend`, run `npm install` and `npm start`.
4. Open the React application at `http://localhost:3000`. Django Admin is at `http://localhost:8000/admin/`.

Stop the Docker services from `server/database` with `docker compose down`.

## Deployment notes

Set `backend_url`, `sentiment_analyzer_url`, `DJANGO_SECRET_KEY`, and `DJANGO_ALLOWED_HOSTS` for the target environment. Replace the sample image names in `deployment.yml` with images in your registry. Do not commit real credentials, cookies, or `.env` files.

The people and contact details shown in the static About and Contact pages are sample content. Replace them with accurate project details before publishing.
