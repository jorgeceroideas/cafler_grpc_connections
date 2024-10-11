FROM mcr.microsoft.com/appsvc/node:20-lts

ENTRYPOINT ["pm2", "start", "--no-daemon", "/opt/startup/default-static-site.js"]

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

CMD ["node", "app.js"]