FROM nginx:1.13.3-alpine
MAINTAINER Nick 'MorpheusXAUT' Mueller <nick@morpheusxaut.net>

COPY dist /usr/share/nginx/html
