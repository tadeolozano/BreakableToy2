# Etapa 1: Build
FROM azul/zulu-openjdk-alpine:21-latest AS builder

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

RUN chmod +x gradlew
RUN ./gradlew build -x test

# Etapa 2: Run
FROM azul/zulu-openjdk-alpine:21-jre-latest

WORKDIR /app

COPY --from=builder /app/build/libs/bt2-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
