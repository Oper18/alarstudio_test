# Start porject

From project directory:
 - build container `alar:latest`: `docker build -f alar_test/Dockerfile -t alar:latest alar_test/`
 - build container `alar_front:latest`: `docker build -f alar_front/Dockerfile -t alar_front:latest alar_test/`
 - create `.env` from `.env.example` in `alar_test` directory
 - change directory to alar_test and run project: `docker-compose up -d`
 - wait until migration completed and create test users `docker exec alar_site python manage.py create_users` and test points `docker exec ares_site python manage.py random_points`
 - open `http://localhost` in browser