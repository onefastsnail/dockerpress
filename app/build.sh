#!/bin/bash

#bring up the docker stack
docker-compose up -d --build

#install WP and our dependencies via Composer
docker run -it --rm -v $(pwd):/app composer/composer install --no-dev

#due to our src/ dist/ build nature, lets build the project for the first time using the npm build script (npm install, gulp build)
docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp npm run build