<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
nest i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo __.env.template__ y renombrar la compia a __.env__
6. Llenar las variables de entorno definidas en el __.env__
7. Ejecutar la aplicacion en dev:
```
yarn start:dev
```
8. Reconstrir la BD con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* MondoDB
* Nest

# Production Build
1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de produccion
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
4. Ejecutar la imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```