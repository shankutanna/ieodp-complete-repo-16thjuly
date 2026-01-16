# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker images
docker ps
git clone https://github.com/venkatsait33/IEODP-Jan-8-Hackathon.git
mv src/modules/tickets/forms/LeaderShipCommentForm.jsx    src/modules/tickets/forms/LeadershipCommentForm.jsx
ls
cd IEODP-Jan-8-Hackathon
ls
mv src/modules/tickets/forms/LeaderShipCommentForm.jsx    src/modules/tickets/forms/LeadershipCommentForm.jsx
docker build -t react-frontend:latest .
docker images
docker run -d --name=react-frontend -p 3000:80 react-frontend:latest 
docker ps
docker images
docker ps -a
docker start 9388a8ddaf8e
docker ps
ls
mkdir python-backend
cd python-backend
ls
git clone https://github.com/Vamshikrishna-01-a11y/ENTERPRISE_PROJECT.git
ls
cd ENTERPRISE_PROJECT
ls
vi Dockerfile
docker build -t pthon-backend:latest .
docker images
docker run -d --name=python-backend -p 8000:8000 pthon-backend:latest 
docker ps
docker logs -f 384752a0968a 
ls
vi Dockerfile
ls
docker ps -a
mkdir springboot-backend 
cd springboot-backend
ls
git clone https://github.com/shankutanna/ieodp-springboot-backend.git
ls
cd ieodp-springboot-backend
ls
vi Dockerfile
ls
docker build -t docker build -t ieodp-springboot-backend:1.0 .
docker build -t ieodp-springboot-backend:1.0 .
ls
vi Dockerfile
docker build -t ieodp-springboot-backend:1.0 .
docker images
docker run -d --name spring-backend -p 8080:8080 ieodp-springboot-backend:1.0
docker ps
docker ps -a
docker logs -f dafc8b672ae1
docker ps -a
docker stop dafc8b672ae1
docker rm -f dafc8b672ae1
docker ps 
docker ps -a
docker run -d   --name spring-backend   -p 8080:8080   -e DB_URL=jdbc:h2:mem:testdb   -e DB_USERNAME=sa   -e DB_PASSWORD=   -e PYTHON_SERVICE_URL=http://localhost:8000   -e JWT_SECRET=mysecret   ieodp-springboot-backend:1.0
docker ps 
docker ps -a
docker logs -f 75516e271705
docker run -d   --name mysql-db   -e MYSQL_ROOT_PASSWORD=root   -e MYSQL_DATABASE=ieodp   -e MYSQL_USER=ieodp_user   -e MYSQL_PASSWORD=ieodp_pass   -p 3306:3306   mysql:8.0
docker ps
dokcer logs  mysql-db
dokcer logs -f  mysql-db
docker logs -f  mysql-db
docker rm -f spring-backend
docker ps -a
docker network create ieodp-net
docker run -d   --name mysql-db   --network ieodp-net   -e MYSQL_ROOT_PASSWORD=root   -e MYSQL_DATABASE=ieodp   -e MYSQL_USER=ieodp_user   -e MYSQL_PASSWORD=ieodp_pass   mysql:8.0
docker ps -a
docker stop 0754c2a35d30
docker rm -f 0754c2a35d30
docker ps 
docker network 
docker network ls
docker run -d   --name mysql-db   --network ieodp-net   -e MYSQL_ROOT_PASSWORD=root   -e MYSQL_DATABASE=ieodp   -e MYSQL_USER=ieodp_user   -e MYSQL_PASSWORD=ieodp_pass   mysql:8.0
docker run -d   --name spring-backend   --network ieodp-net   -p 8080:8080   -e DB_URL=jdbc:mysql://mysql-db:3306/ieodp   -e DB_USERNAME=ieodp_user   -e DB_PASSWORD=ieodp_pass   -e PYTHON_SERVICE_URL=http://python-backend:8000   -e JWT_SECRET=mysecret   ieodp-springboot-backend:1.0
docker ps
docker ps -a
docker logs -f 5ccdabef6643
docker ps -a
docker rm -f spring-backend mysql-db
docker ps
docker network ls
docker run -d   --name mysql-db   --network ieodp-net   -e MYSQL_ROOT_PASSWORD=root   -e MYSQL_DATABASE=ieodp   -e MYSQL_USER=ieodp_user   -e MYSQL_PASSWORD=ieodp_pass   mysql:8.0
docker logs mysql-db | tail
docker run -d   --name spring-backend   --network ieodp-net   -p 8080:8080   -e DB_URL=jdbc:mysql://mysql-db:3306/ieodp   -e DB_USERNAME=ieodp_user   -e DB_PASSWORD=ieodp_pass   -e JWT_SECRET=mysecret   ieodp-springboot-backend:1.0
docker ps
docker ps -a
ls
cd IEODP-Jan-8-Hackathon
ls
vi Dockerfile
cd ..
ls
cd  python-backend
ls
cd ENTERPRISE_PROJECT
ls
vi Dockerfile
cd ..
ls
cd springboot-backend
ls
cd ieodp-springboot-backend
ls
vi Dockerfile
cd ..
ls
ieodp-springboot-backend
cd ieodp-springboot-backend
ls
cd ..
docker ps -a
docker start e292f719c3b5
docker ps
docker start 448f0d2a7866
docker ps
docker logs -f 448f0d2a7866
docker ps 
docker ps -a
docker rm -f 448f0d2a7866
docker ps -a
docker images 
docker rmi -f ieodp-springboot-backend:1.0 
docker images 
ls
rm rf springboot-backend
rm -rf springboot-backend
ls
git clone https://github.com/shankutanna/ieodp-springboot-backend-14thjan.git
ls
cd ieodp-springboot-backend-14thjan
ls
vi Dockerfile 
docker build -t springboot-backend:latest .
docker images 
docker run -d --name=springboot-java -p 8080:8080 springboot-backend:latest
docker ps 
docker ps -a
docker logs -f 3f907ec1dd92
docker ps -a
docker rm -f 3f907ec1dd92
docker ps -a
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/ieodp   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   -e PYTHON_API_BASE_URL=http://python-backend:8000   -e JWT_SECRET=IEODP_SECRET_KEY_CHANGE_IN_PRODUCTION_123456   springboot-backend:latest
docker ps 
docker ps -a
docker logs -f 84ec3c1dbb00
docker ps -a
docker start e292f719c3b5
docker ps -a
docker rm -f 84ec3c1dbb00
docker ps -a
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/ieodp   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   -e PYTHON_API_BASE_URL=http://python-backend:8000   -e JWT_SECRET=IEODP_SECRET_KEY_CHANGE_IN_PRODUCTION_123456   springboot-backend:latest
docker ps 
docker ps -a
docker logs fa2aff8074ae
docker ps -a
docker rm -f fa2aff8074ae
docker images
docker rmi -f springboot-backend:latest
docker images
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
ls
cd ..
docker images
docker rmi -f springboot-backend:latest
ls
rm ieodp-springboot-backend-14thjan
rm -f ieodp-springboot-backend-14thjan
rm -rf ieodp-springboot-backend-14thjan
ls
git clone https://github.com/shankutanna/ieodp-springboot-backend-14thjan.git
ls
cd ieodp-springboot-backend-14thjan
ls
cd src
ls
cd main
ls
cd java
ls
cd com
ls
cd enterprisesystemengineering
ls
cd Entity
ls
vi UserRepository.java
cd ..
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
vi Dockerfile
ls
docker build -t springboot-backend:latest .
ls
vi UserRepository.java
ls
rm -rf  UserRepository.java
ls
cd src
ls
cd main
ls
cd java
ls
cd com
ls
cd enterprisesystemengineering
ls
cd Entity
ls
vi  UserRepository.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
ls
cd ieodp-springboot-backend-14thjan
ls
cd src
ls
cd main
ls
cd java 
ls
cd com
ls
cd enterprisesystemengineering
ls
cd  Entity
ls
vi UserRepository.java
mvn clean compile 
ls
vi User.java
cat User.java
ls
cat UserRepository.java
ls
cat UserService.java
ls
vi  User.java
ls
vi UserRepository.java
vi UserService.java
vi Role.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
cd ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity/
cd ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
cd /ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
ls
cat UserController.java
vi UserRepository.java
ls
rm -rf User.java
vi User.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
docker images 
doker network ls
docker network ls
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/ieodp   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   springboot-backend:latest
docker ps
docker ps | grep mysql
docker ps 
docker ps
ls
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
ls
vi Securityconfig.java
ls
docker ps
docker rm -rf ed9f238c93b7
docker rm -f ed9f238c93b7
docker images 
docker rm springboot-backend:latest
docker rmi -f springboot-backend:latest
docker images 
cd
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-java:latest .
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
ls
mv Securityconfig.java SecurityConfig.java
ls
cd ieodp-springboot-backend-14thjan
cd ..
cd 
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-java:latest .
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-db:3306/ieodp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   springboot-backend:latest
docker images 
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-db:3306/ieodp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   springboot-java:latest
docker ps
docker ps -a
docker logs -f 8378322d2db4
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-db:3306/ieodp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   springboot-java:latest
8378322d2db4f487878f63c7b76bbcd14a91797774d65ff2db7ad71e86137673
root@ip-172-31-20-151:~/ieodp-springboot-backend-14thjan# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED      STATUS       PORTS                 NAMES
e292f719c3b5   mysql:8.0   "docker-entrypoint.s…"   2 days ago   Up 4 hours   3306/tcp, 33060/tcp   mysql-db
root@ip-172-31-20-151:~/ieodp-springboot-backend-14thjan# docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS                      PORTS                 NAMES
8378322d2db4   springboot-java:latest   "java -jar app.jar"      21 seconds ago   Exited (1) 19 seconds ago                         springboot-java
e292f719c3b5   mysql:8.0                "docker-entrypoint.s…"   2 days ago       Up 4 hours                  3306/tcp, 33060/tcp   mysql-db
384752a0968a   pthon-backend:latest     "uvicorn app.main:ap…"   3 days ago       Exited (0) 3 days ago                             python-backend
9388a8ddaf8e   react-frontend:latest    "/docker-entrypoint.…"   4 days ago       Exited (0) 3 days ago                             react-frontend
root@ip-172-31-20-151:~/ieodp-springboot-backend-14thjan# docker logs -f 8378322d2db4
docker logs -f 8378322d2db4
docker images 
exit
docker images 
docker ps -a 
docker start 8378322d2db4
docker ps -a 
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
ls
rm -f SecurityConfig.java
ls
cd ..
ls
cd config
ls
vi SecurityConfig.java
ls
cat SecurityConfig.java
docker images
docker ps -a 
docker rm -f 8378322d2db4 
docker rmi springboot-java:latest
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-db:3306/ieodp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   springboot-backend:latest
docker ps 
docker ps -a
docker start e292f719c3b5
docker start e603330fff5a
docker ps -a
docker logs -f e603330fff5a
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering/Entity
cd ..
ls
cd config
ls
vi SecurityConfig.java
docker images 
docker ps -a
docker rm -f e603330fff5a
docker rmi springboot-backend:latest
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
docker run -d   --name springboot-java   --network ieodp-net   -p 8080:8080   -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql-db:3306/ieodp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"   -e SPRING_DATASOURCE_USERNAME=ieodp_user   -e SPRING_DATASOURCE_PASSWORD=ieodp_pass   -e SPRING_JPA_HIBERNATE_DDL_AUTO=update   springboot-backend:latest
docker ps -a
docker ps 
docker logs -f 89d5749add20
docker ps 
cd ..
ls
mkdir ieodp-deploy
cd ieodp-deploy
vi docker-compose.yml
docker ps
docker ps -a
docker start 9388a8ddaf8e
docker start 384752a0968a
docker ps -a
docker ps 
ls
docker-compose up -d
apt  install docker-compose
systectl status docker-compose 
systemctl status docker-compose 
apt update 
docker-compose up -d
docker images 
docker ps 
ls
vi docker-compose.yml
docker-compose up -d
docker stop springboot-java mysql-db pthon-backend react-frontend
docker rm springboot-java mysql-db pthon-backend react-frontend
docker ps
docker rm -f 384752a0968a
docker ps
docker images 
docker-compose up -d
docker-compose ps
docker logs -f mysql-db
date
docker logs -f mysql-db
docker-compose logs springboot | grep insert
ls
cd ieodp-deploy
ls
docker-compose logs springboot | grep insert
ls
cd ieodp-deploy
ls
docker-compose ps
cd 
ls
cd IEODP-Jan-8-Hackathon
ls
cd src
ls
cd api
ls
vi baseApi.js
cd ..
ls
vi .env
ls -la
ls
cd 
ls
cd ieodp-deploy
ls
docker-compose stop react
docker-compose rm -f react
docker-compose build react
docker images 
docker rmi react-frontend:latest
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
docker build -t react-frontend:latest .
docker images 
docker-compose up -d react
cd
ls
cd ieodp-deploy
ls
vi docker-compose.yml
docker-compose up -d react
docker-compose ps
ls
cd IEODP-Jan-8-Hackathon
ls
vi nginx.conf
ls
vi Dockerfile
cd ..
ls
cd ieodp-deploy
ls
docker-compose stop react
docker-compose rm -f react
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
docker build -t react-frontend:latest .
cd ..
ls
cd ieodp-deploy
docker images
docker-compose up -d react
docker-compose ps
docker-compose logs springboot | grep select
docker logs pthon-backend
docker-compose logs springboot
ls
cd IEODP-Jan-8-Hackathon
ls
vi .env
cd 
ls
cd ieodp-deploy
ls
docker images
docker-compose ps
docker-compose up -d
docker-compose stop react
docker-compose rm -f react
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
docker rmi react-frontend:latest
docker build -t react-frontend:latest .
docker-compose up -d react
cd ..
ls
cd ieodp-deploy
ls
docker-compose up -d react
docker-compose ls
docker-compose ps
docker-compose logs springboot | grep insert
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
vi .env
cd src
ls
cd api
ls
vi baseApi.js
cd ..
ls
cd ieodp-deploy
ls
docker-compose down
docker-compose build react
docker images 
docker rmi react-frontend:latest
docker-compose build react
docker images 
docker-compose rm -f react
cd 
ls
cd IEODP-Jan-8-Hackathon
ls
docker build -t react-frontend:latest .
cd
ls
cd ieodp-deploy
ls
docker-compose build react
docker-compose up -d
docker-compose ps
cd..
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
vi nginx.conf
ls
cd IEODP-Jan-8-Hackathon
ls
vi Dockerfile
ls
cd ieodp-deploy
ls
cd ..
cd IEODP-Jan-8-Hackathon
ls
vi  nginx.conf
cd src
ls
cd api
ls
vi baseApi.js
cd ..
ls
vi Dockerfile
docker-compose ps
cd ..
ls
cd ieodp-deploy
docker-compose ps
docker-compose stop react
docker-compose rm -f react
docker images 
docker rmi react-frontend:latest 
docker images 
cd ..
ls
cd IEODP-Jan-8-Hackathon
ls
docker build -t react-frontend:latest .
ls
vi Dockerfile
vi .env
vi Dockerfile
docker build -t react-frontend:latest .
cd ..
ls
cd ieodp-deploy
ls
vi docker-compose.yml
docker-compose build react
docker-compose up react -d
docker-compose up -d react
docker-compose ps
docker run --rm react-frontend ls /usr/share/nginx/html
cd ..
ls
cd ieodp-springboot-backend-14thjan
ls
cd src
ls
cd main
ls
cd java 
ls
cd com
ls
cd enterprisesystemengineering
ls
cd  config
ls
vi  SecurityConfig.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker-compose stop springboot
cd 
ls
cd ieodp-deploy
ls
docker-compose stop springboot
docker-compose rm springboot
docker images 
docker rmi springboot-backend:latest
cd ..
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
ls
cd ~ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering
cd ~/ieodp-springboot-backend-14thjan/src/main/java/com/enterprisesystemengineering
ls
cd config
ls
vi SecurityConfig.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
docker build -t springboot-backend:latest .
cd 
ls 
cd ieodp-deploy
ls
docker-compose up -d spring
docker-compose up -d springboot
docker-compose ps 
docker-compose down 
docker-compose up -d
docker-compose ps
docker-compose logs -f react-frontend
docker-compose config --services
docker-compose logs -f react
ls
vi docker-compose.yml
cd 
ls
cd IEODP-Jan-8-Hackathon
ls
cd nginx.conf
vi nginx.conf
cd ..
ls
cd ieodp-deploy
ls
vi docker-compose.yml
cat docker-compose.yml
vi docker-compose.yml
docker-compose down -v
docker-compose up -d
docker-compose ps
cd 
ls
cd IEODP-Jan-8-Hackathon
ls
vi nginx.conf
cd ..
ls
cd ieodp-springboot-backend-14thjan
ls
cd src
ls
cd main
ls
cd java
ls
cd com
ls
cd enterprisesystemengineering
ls
cd config
ls
vi SecurityConfig.java
cd 
ls
cd ieodp-springboot-backend-14thjan
ls
cd 
ls
cd ieodp-deploy
ls
docker-compose logs -f springboot
ls
cd ieodp-deploy
ls
docker-compose down
docker rmi springboot-backend:latest
docker-compose build springboot
docker-compose up -d
ls
vi docker-compose.yml
docker-compose down -v
docker-compose build --no-cache springboot
docker-compose up -d
ls
vi docker-compose.yml
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
vi docker-compose.yml
docker-compose down
docker-compose up -d
ls
cd ieodp-deploy
