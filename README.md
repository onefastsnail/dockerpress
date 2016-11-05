# Dockerize the web

A Dockerrrrizzzed Wordpress application. This framework provides you with a simple PHP, MariaDB, NGINX stack all preconfigured to work out the box with a few simple steps.

This build has a src/ dist/ nature where we use Gulp to combine dependencies managed with Composer and our `/app/src` code to create a clean disposable `/dist` folder. 

For development ensure gulp is running within `/app` when editing files so they are copied over, and if you need add more files to the watch do so within `/app/gulpfile.js`. I would recommend to add new folders to the custom paths object to ensure the streams remain small and fast.

## New project

1. Stop any existing docker projects and containers
2. Copy and configure `/app/env/.env.example` to `/app/env/.env` (ensure all passwords are strong and filled in)
3. place your theme in `/app/src/wp-content/themes` (you may need to amend the gulp file upon your asset structure)
4. cd into `/app` and run `./build.sh` to run some a simple build script, install dependencies via composer and build with gulp
5. Visit http://localhost or http://yourdomain.io
6. And Enjoy :)

## Build the project

1. Stop any existing docker projects and containers
2. run `docker-compose up -d --build` to bring up the docker stack
3. to develop cd into `/app` and run `docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp sh -c gulp`

### Nginx

Bundled with some basic nginx security for Wordpress. HTTP auth credentials are demo : demo 

### Database

There is a phpMyAdmin container running to give you a database management tool. This can be accessed from http://yourdomain.com:8080

The database is stored in `/data/mariadb`

### Node related commands

To run any Node related commands, run these commands inside the `/app` folder.

`docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp CMD`

* `docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp bower search bootstrap --allow-root`
* `docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp npm install`
* `docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp sh -c gulp`
* `docker run -it --rm -v $(pwd):/app onefastsnail/node-bower-gulp npm run build`

### Composer

To run these Composer related commands, run inside the `/app` folder

`docker run -it --rm -v $(pwd):/app composer/composer CMD`

* `docker run -it --rm -v $(pwd):/app composer/composer install --no-dev`
* `docker run -it --rm -v $(pwd):/app composer/composer update --no-dev`

### WP CLI

To run WPCLI related commands, run these commands inside the `/app` folder.

`docker run --rm -it -v $(pwd):/app --link mysql:mysql onefastsnail/wpcli CMD`

* `docker run --rm -it -v $(pwd):/app --link mysql:mysql onefastsnail/wpcli wp --allow-root user list`
* `docker run --rm -it -v $(pwd):/app --link mysql:mysql onefastsnail/wpcli wp search-replace 'http://old.domain' 'http://new.domain' --allow-root`

### Security

To run some WP Scan security tests, you can use this:

* `docker run --rm wpscanteam/wpscan -u http://yourdomain.io --enumerate u --basic-auth demo:demo`

## Notes

* Refer to the Docker docs for more about commands https://docs.docker.com/engine/reference/commandline/cli/
* For docker-compose commands refer to https://docs.docker.com/compose/reference/
* To install Docker on mac https://docs.docker.com/docker-for-mac/
* To install Docker and/or Docker compose https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-14-04
* The app code is located in `/app`
* The nginx public serving code is `/app/dist` which is created by gulp.

## Credits

Paul Stewart

## License

And Enjoy :)
