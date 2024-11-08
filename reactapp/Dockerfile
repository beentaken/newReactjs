FROM node:16-bullseye

# Install the .NET SDK
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://dot.net/v1/dotnet-install.sh && \
    chmod +x dotnet-install.sh && \
    ./dotnet-install.sh -c 6.0 -InstallDir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY ["package.json", "./"]
COPY ["package-lock.json", "./"]
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 80

# Run the application
CMD ["sh", "-c", "PORT=80 npm run start"]
