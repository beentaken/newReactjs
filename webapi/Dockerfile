# webapi/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["webapi.csproj", "./"]
RUN dotnet restore "webapi.csproj"

COPY . .

WORKDIR "/src/webapi"
RUN dotnet build "../webapi.csproj" -c Release -o /app/build
RUN dotnet publish "../webapi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 7048

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "webapi.dll"]