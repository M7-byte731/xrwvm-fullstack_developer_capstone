FROM node:20 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV CI=false
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-build /frontend/build /app/frontend/build
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn djangoproj.wsgi:application --bind 0.0.0.0:8000"]
