FROM node:14.18.1

COPY . /src

WORKDIR /src

RUN npm install  -production


EXPOSE 3000 3001

CMD npm start