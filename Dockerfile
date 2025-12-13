FROM oven/bun:1.3-debian AS build
ARG GUAC_URL
ARG GUAC_PASS
ARG GUAC_USER
ARG GUAC_MONTHS
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production
RUN bun run build

FROM httpd:2.4 AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80