FROM ubuntu:18.04

RUN mkdir /home/work

WORKDIR /home/work

RUN apt-get update -y && apt-get install -y sudo && apt-get install -y vim && apt-get install -y curl && apt-get install -y git

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

RUN apt-get install -y nodejs

RUN git clone https://github.com/arvincsh/zMEC-stream-server-v2.git

WORKDIR /home/work/zMEC-stream-server-v2/server

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y tzdata && apt-get install -y libopencv-dev

RUN sudo npm install forever -g

RUN sudo npm install 

CMD [ "forever", "start", "/home/work/zMEC-stream-server-v2/server.js" ]
