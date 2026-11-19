FROM python:3.9.18-slim-bookworm


WORKDIR /python-docker
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5050

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
RUN ls
EXPOSE 5050
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=5050"]
