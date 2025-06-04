FROM node:18

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN echo "Ensuring specific native modules are installed..." && \
    npm install --legacy-peer-deps \
        lightningcss-linux-x64-gnu \
        @tailwindcss/oxide-linux-x64-gnu \
        sass-embedded-linux-x64

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
