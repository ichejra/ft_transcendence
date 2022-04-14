FROM node:16

WORKDIR /usr/app/ft_transcendence

# * Client side

WORKDIR /usr/app/ft_transcendence/frontend
COPY frontend/* .
RUN npm install
RUN npx tsc
# * Client side will be run in the background
# * Serer side

WORKDIR /usr/app/ft_transcendence/backend/
COPY backend/* .
RUN npm install
RUN npx tsc

CMD ["npm", " run", "build"]