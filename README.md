# CV Builder

## Pre-requisites
You must have node and npm installed

## Launch
To run this app, execute `npm run dev`

## Production (Docker + Traefik)

Pre-requisites on the server: Docker (with Compose v2), [Task](https://taskfile.dev), and a running Traefik attached to an external Docker network (`traefik` by default).

```sh
task prod HOST=cv.example.com
```

Optional overrides (CLI or `.env` file):

| Variable               | Default       |
|------------------------|---------------|
| `APP_HOST`             | — (or `HOST=`) |
| `TRAEFIK_NETWORK`      | `traefik`     |
| `TRAEFIK_ENTRYPOINT`   | `websecure`   |
| `TRAEFIK_CERTRESOLVER` | `letsencrypt` |

Other commands: `task prod:logs`, `task prod:down`, `task prod:build`.

The image builds for the host's architecture (amd64 or arm64).
