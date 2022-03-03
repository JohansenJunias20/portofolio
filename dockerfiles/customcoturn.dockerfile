FROM ubuntu
RUN apt-get -y update
RUN apt-get install coturn
RUN ls /etc
RUN echo "TURNSERVER_ENABLED=1" > /etc/default/coturn
RUN service coturn stop