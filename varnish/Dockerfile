FROM debian:jessie

RUN apt-get update && \
  apt-get install -y apt-transport-https && \
  apt-get install -y curl && \
  curl https://repo.varnish-cache.org/GPG-key.txt | apt-key add - && \
  echo "deb https://repo.varnish-cache.org/debian/ jessie varnish-4.0" >> /etc/apt/sources.list.d/varnish-cache.list && \
  apt-get update && \
  apt-get install -y varnish

ADD default.vcl /etc/varnish/default.vcl

COPY start-varnish.sh /start-varnish.sh
RUN chmod 0755 /start-varnish.sh

ENV VARNISH_MEMORY=128m

CMD ["./start-varnish.sh"]