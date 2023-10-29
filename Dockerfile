# Stage 0: Build Stage
# Use node version 20.6.1
FROM node:16.14-alpine3.14 AS base

# Label Instruction
LABEL maintainer="Juan Castelblanco <castelwhite7821@outlook.com>"
LABEL description="Fragments node.js microservice"

#ENV instructions
# We default to use port 8080 in our service
# ENV PORT=8080
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

#Working Directory
# Use /app as our working directory
WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json /app/

#Run Instructions
# Install node dependencies defined in package-lock.json
RUN npm install

###########################

# Stage 1: Production Stage
FROM node:16.14-alpine3.14 AS production

WORKDIR /app

# Copy src to /app/src/
# COPY ./src ./src
COPY --from=base /app /app

# Copy source code into the image
COPY . .

# Copy our HTPASSWD file
# COPY ./tests/.htpasswd ./tests/.htpasswd

# CMD npm start
#Install dumb-init
RUN apk add dumb-init

# Start the container by running our server
CMD ["dumb-init","node","/app/src/server.js"]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1