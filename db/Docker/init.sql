CREATE SUPER USER dev;

CREATE DATABASE pixold;
GRANT ALL PRIVILEGES ON DATABASE pixold TO dev;
ALTER ROLE dev SUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN;