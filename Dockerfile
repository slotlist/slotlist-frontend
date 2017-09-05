FROM nginx:1.13.3-alpine
MAINTAINER Nick 'MorpheusXAUT' Mueller <nick@morpheusxaut.net>

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.vh.default.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
