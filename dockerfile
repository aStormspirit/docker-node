FROM node:12
WORKDIR /app
COPY package.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm install; \
        else npm install --only-production; \
        fi

COPY . ./
EXPOSE 3000
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
CMD ["npm", "run", "dev"]