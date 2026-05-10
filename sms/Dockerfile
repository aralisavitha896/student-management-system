# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the specific executable jar, avoiding .original or other files
COPY --from=build /app/target/sms-*.jar app.jar
EXPOSE 8080
# Use -Xmx to stay within Render's 512MB free tier limit
ENTRYPOINT ["java", "-Xmx384m", "-Xms384m", "-jar", "app.jar"]
