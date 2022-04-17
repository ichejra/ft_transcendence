FROM node:16

WORKDIR /usr/src/app/

# * Client side
WORKDIR /usr/src/app/frontend
COPY srcs/frontend/ .
RUN npm install && npx tsc && npm run build

# * Server side
WORKDIR /usr/src/app/backend/
COPY srcs/backend/ .
RUN npm install && npx tsc && npm run build

WORKDIR /
COPY srcs/run.bash .
RUN chmod +x /run.bash

EXPOSE 3000
EXPOSE 3001

CMD ["/bin/bash", "run.bash"]