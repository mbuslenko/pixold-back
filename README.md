
# Pixold Backend

A brief description of what this project does and who it's for


##

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![dependencies](https://img.shields.io/librariesio/github/devin-team/pixold-back)

![company](https://img.shields.io/badge/company-devin-blue)

![release](https://img.shields.io/badge/release%20date-2022--01--15-important)

## Authors

- [@mbuslenko](https://www.github.com/mbuslenko)
- [@G0rman](https://www.github.com/G0rman)


## Roadmap

Roadmap can be found on [figma](https://www.figma.com/file/mqwdj7NESNzNyDAVoObQMo/Pixold-roadmap?node-id=0%3A1)


## Run Locally

1. Clone the project

2. Setup docker:
- for MacOS: Install [Docker desktop app](https://www.docker.com/get-started)
- for Windows: [Enable Intel Virtualization Technology](https://www.sony-asia.com/electronics/support/articles/S500016173) and then, install [Docker desktop app](https://www.docker.com/get-started)

3. Create .env file and move all data from .env.sample

4. Run following commands:

Go to the project directory

```bash
  cd pixold-back
```

Install dependencies

```bash
  npm i
```

Start the database

```bash
  docker-compose up
```

Start the server
```bash
  npm run dev
```


## Useful stuff

Swagger: `/swagger`