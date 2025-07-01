# Use Node.js 18 Alpine base image
FROM node:18-alpine

# Install prerequisites for .NET SDK and native modules
RUN apk add --no-cache \
    bash \
    icu-libs \
    krb5-libs \
    libgcc \
    libstdc++ \
    libintl \
    zlib \
    curl \
    openssl \
    wget \
    make \
    g++ \
    python3 && \
    # Download and install the .NET SDK
    wget https://dot.net/v1/dotnet-install.sh && \
    chmod +x dotnet-install.sh && \
    ./dotnet-install.sh -c 6.0 -InstallDir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet && \
    # Clean up temporary files
    rm -rf /var/cache/apk/* dotnet-install.sh

# Set working directory
WORKDIR /app

# Copy and install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 80

# Start the application
CMD ["sh", "-c", "PORT=80 npm run start"]
