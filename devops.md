# Deployment

## Exo Ape preview

The `exoape` branch has a separate, non-indexed preview at <http://192.168.2.210:19014/zh>. It uses `/root/devops/linksense-website-exoape/docker-compose.yml` on `linksense-dev-server`. Build locally with the pinned Node.js and pnpm versions, then upload only `.output/public` and `.output/server` to a versioned release directory. Verify the artifact checksums and mount the release read-only with the host's cached `node:24-alpine` image. Start only `web` with `docker compose up -d --no-build --pull never --no-deps web` in the preview directory. This branch does not use the main branch's image publishing workflow.

## Main site

The site runs on the `linksense-dev-server` host as a pull-only Docker Compose service.

| | |
| --- | --- |
| URL | <http://192.168.2.210:19010/> |
| Host | `linksense-dev-server` (`root@192.168.2.210`) |
| Compose file | `/root/devops/linksense-website/docker-compose.yml` |
| Compose project / service | `linksense-website` / `web` |
| Port | `19010:3000` |
| Runtime | Nitro node-server, `NITRO_HOST=0.0.0.0`, `NITRO_PORT=3000` |
| Restart / logs | `restart: unless-stopped`; json-file, 10 MB × 3 |
| Image | `ghcr.io/lingx-ai/linksense-website` (public GHCR package) |
| Tags | `latest` and `sha-<full commit>`; linux/amd64 |
| Build | `.github/workflows/publish-image.yml` on every push to `main` |

The compose file pins a `sha-` tag. Do not build on the server and do not deploy `latest` in production-like environments; use the immutable commit tag and keep the previous image for rollback.

## Update

1. Push the commit to `main`. On this Mac GitHub pushes go through the local proxy:

   ```bash
   HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890 ALL_PROXY=http://127.0.0.1:7890 git push origin main
   ```

   Add `-c http.version=HTTP/1.1` if the push fails over HTTP/2.

2. Wait for the image job to succeed (it pushes `:sha-<full commit>` and `:latest`):

   ```bash
   gh run list --workflow publish-image.yml --limit 1
   gh run watch <run-id> --exit-status
   ```

3. Deploy that tag on the server. Back up the current compose first, then replace the image tag:

   ```bash
   ssh root@192.168.2.210
   cd /root/devops/linksense-website
   cp -n docker-compose.yml docker-compose.yml.bak-<previous-sha>
   sed -i 's|ghcr.io/lingx-ai/linksense-website:sha-[0-9a-f]*|ghcr.io/lingx-ai/linksense-website:sha-<full commit>|' docker-compose.yml
   docker compose pull web
   docker compose up -d web
   docker compose ps
   ```

4. Verify the new build rather than only the container status:

   ```bash
   curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:19010/
   curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:19010/zh
   curl -fsS http://127.0.0.1:19010/ | grep -o 'linksense-lockup-light.svg' | head -1
   curl -s -o /dev/null -w '%{http_code}\n' -H 'Range: bytes=0-255' http://127.0.0.1:19010/media/product-demo.mp4
   docker compose logs --tail=20 web
   ```

   Expect 200s, the current logo/asset paths in the HTML, a 206 for the video range, and a listening log line. Check <http://192.168.2.210:19010/> from outside the host as well.

## Rollback

The previous image is kept locally. Restore the backed-up compose file (or set its `image:` back to the previous `sha-` tag) and recreate the service:

```bash
cd /root/devops/linksense-website
cp docker-compose.yml.bak-<previous-sha> docker-compose.yml
docker compose up -d web
```

Do not run host-wide `docker system prune`; other stacks share this host on ports 19000/19001/19090/19443.

## Notes

- The GHCR package is public; anonymous `docker compose pull` works. The local `gh` token has no `read:packages` scope, so do not rely on `gh api` to inspect or change package visibility — use an anonymous pull or the GitHub UI.
- Compose file history: `docker-compose.yml.bak-<sha>` is the rollback config for that tag.
- Deployed 2026-11-19: `sha-a8c66d6039c5bc77a95d6942725d0d6693afb57a` (commit `a8c66d6`). Previous: `sha-8a13f5df0c1fa94bb4b66849f5466fe9b0b2c546`.
