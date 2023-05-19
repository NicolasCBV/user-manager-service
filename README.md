# USER SERVICE BOILERPLATE
## ABOUT
This system is a user manager service, dedicated to handle with some core operations of user management. If you wish to turn your development more fast, this system is a good option if your system is more simple and requires only one instance to handle with logins, more than this for now is unsupported.

## TECHNOLOGIES
Nestjs: as a backend framework
Firebase Storage: to handle with the storage of images
Nginx: as a reverse proxy (optional)
MySQL: unique instance
Redis: unique instance
Docker & Docker Compose: to turn your development more easily and modularized

## QUICK-START
To start usage, clone the repo of the master branch and run "yarn up", if your docker need's to be executed with sudo, then run "sudo yarn up". It will setup all services needed. After that, create your migration and enter on bash mode and run "yarn start:dev".

To get the production system, you could choose by getting the docker image using "docker image pull nicolascbv/user-manager-service:latest" or clone the /example and running "docker compose up".

Follow the .env.example to set all variables that you need. To more information about the system and your usage, check my documentation in postman:

Docs: <a src="https://documenter.getpostman.com/view/25622444/2s93XsXm9b" target="_blank">https://documenter.getpostman.com/view/25622444/2s93XsXm9b</a>
