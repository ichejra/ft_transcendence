#!/bin/bash

cd /usr/src/app/frontend/
npm run start &
cd /usr/src/app/backend/
npm run start:prod