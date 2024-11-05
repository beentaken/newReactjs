#PRODUCTION
FROM node:alpine as build
WORKDIR /publish
RUN apk --no-cache add curl
COPY ./Reactjs/reactapp/package.json ./
COPY ./Reactjs/reactapp/package-lock.json ./
COPY ./Reactjs/reactapp/ ./
ENV NODE_ENV=production
RUN npm install --production
RUN npm run-script build --production

FROM build AS final
WORKDIR /app
COPY --from=build /publish/build .
RUN npm install -g serve
CMD serve -s -l 80



##DEVELOPMENT
#FROM node:alpine
#WORKDIR /app
#COPY ./Reactjs/reactapp/package.json ./
#COPY ./Reactjs/reactapp/package-lock.json ./
#COPY ./Reactjs/reactapp/ ./
#RUN npm i
#CMD PORT=80 npm run start #for linux
##CMD set PORT=80 && npm run start #for windows
##CMD ["npm", "run", "start"]