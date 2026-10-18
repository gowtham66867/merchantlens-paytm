FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV MERCHANTLENS_TARGET=cloudrun
RUN node node_modules/vinext/dist/cli.js build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0
COPY --from=build --chown=node:node /app/dist/standalone ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
