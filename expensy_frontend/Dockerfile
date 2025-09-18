# ---- Build stage ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# then your existing build line
RUN npm ci
COPY . .

RUN npm run build

# ---- Runtime stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
# copy only what's needed to run
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
# next start uses PORT env; default 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

