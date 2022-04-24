FROM node:16

WORKDIR /usr/src/app/

# * Client side
WORKDIR /usr/src/app/frontend
COPY srcs/frontend/ .
RUN npm install
RUN npm run build

# * Server side
WORKDIR /usr/src/app/backend/
COPY srcs/backend/ .
RUN npm install
RUN npm run build
RUN npm i concurrently

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "run", "deploy" ]
