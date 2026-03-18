# ETAPA 1: Construcción (Build)
# Usamos una imagen que ya tenga Maven y Java instalados
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el archivo de configuración de Maven primero
COPY pom.xml .

# Este paso descarga las dependencias. Se queda en caché si no cambias el pom.xml
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos el proyecto
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Run)
# Usamos una imagen de Java más ligera para correr la app
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copiamos solo el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto por defecto de Spring Boot
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]