# USER SERVICE BOILERPLATE
## ABOUT
This system is a user management service dedicated to handling some of the core operations of user management. If you wish to make your development days more efficient and faster, this system is a good option.

## TECHNOLOGIES
Nestjs: as a backend framework
Firebase Storage: to handle the storage of images
Nginx: as a reverse proxy (optional, just used as an example on /example)
MySQL: unique instance
Redis: unique instance
Docker & Docker Compose: to turn your development more easily and modularized
NCurses: used on dashboard cli tool
CMake & make: to build the dashboard cli tool

## QUICK-START
To start, follow these steps:
- Firstly, be sure to have the ncurses c/c++ lib installed on your system.
- Clone the repo with: ```git clone https://github.com/NicolasCBV/user-manager-service.git```
- Enter on dashboard dir: ``` cd ./user-manager-service/dashboard```
- Create a build dir with CMake: ```cmake -B ./build .```
- Enter in build dir and compile: ```cd ./build && make```
- Now you need to run the executable and point to the project dir located on /user-service, this is important and obligatory, because dashboard cli needs to know where your project is to make some changes if necessary: ```./init ../../user-service```

To get the production system, you could choose to get the Docker image using ```docker image pull nicolascbv/user-manager-service:latest``` or enter in /example dir and run ```docker compose up```.

Follow the /user-service/.env.example to set all the variables that you need. For more information about the system and your usage, check out my documentation in Postman:

Docs: <a src="https://documenter.getpostman.com/view/25622444/2s93XsXm9b" target="_blank">https://documenter.getpostman.com/view/25622444/2s93XsXm9b</a>
