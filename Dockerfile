FROM node:17

WORKDIR /usr/app/ft_transcendence

# * Client side

WORKDIR /usr/app/ft_transcendence/frontend
COPY frontend/* .
RUN npm install
RUN npx tsc

# * Serer side

WORKDIR /usr/app/ft_transcendence/backend/
COPY backend/* .
RUN npm install
RUN npx tsc

CMD ["npm", " run", "build"]