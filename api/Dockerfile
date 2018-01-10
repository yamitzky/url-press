FROM python:3.6-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app
RUN pip install -r requirements.txt

COPY api.py /usr/src/app

EXPOSE 8080

CMD ["python", "api.py"]
