FROM mysql:latest as builder

ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_DATABASE db

COPY ./init.sql /docker-entrypoint-initdb.d

RUN sed -i 's/exec "$@"//g' /usr/local/bin/docker-entrypoint.sh
RUN mkdir -p /var/lib/mysql_tmp
RUN docker-entrypoint.sh mysqld --datadir /var/lib/mysql_tmp

FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_DATABASE db

COPY --from=builder /var/lib/mysql_tmp /var/lib/mysql
