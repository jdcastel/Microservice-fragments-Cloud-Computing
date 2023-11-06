# Stage 0: Build Stage
# Use node version 16.14-alpine3.14
FROM node:16.14-alpine3.14 AS base

LABEL maintainer="Juan Castelblanco <castelwhite7821@outlook.com>"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install --no-package-lock

# Stage 1: Production Stage
FROM node:16.14-alpine3.14 AS production

WORKDIR /app

COPY --from=base /app /app

COPY . .

# Install dumb-init with --no-cache switch
RUN apk add --no-cache dumb-init=1.2.5-r1

# Start the container by running our server
CMD ["dumb-init","node","/app/src/server.js"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
