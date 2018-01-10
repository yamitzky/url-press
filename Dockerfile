FROM node:8-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY frontend/package.json /usr/src/app
COPY frontend/yarn.lock /usr/src/app
RUN yarn

COPY frontend /usr/src/app
RUN yarn generate

FROM python:3.6-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY api/requirements.txt /usr/src/app
RUN pip install -r requirements.txt

COPY api /usr/src/app

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
VOLUME /usr/share/nginx/html

COPY conf /etc/nginx/conf.d
VOLUME /etc/nginx/conf.d

CMD ["python", "api.py"]
