FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3005

CMD ["sh", "-c", "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ormconfig.ts; npx ts-node -r tsconfig-paths/register src/local.ts"]
