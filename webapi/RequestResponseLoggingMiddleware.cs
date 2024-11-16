using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text;
using System.Threading.Tasks;

public class RequestResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

    public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log Request
        context.Request.EnableBuffering(); // Enable request body re-reading

        var requestBody = await ReadRequestBody(context.Request);
        var requestLog = $"Request URL: {context.Request.Method} {context.Request.Path}{context.Request.QueryString}\n" +
                         $"Request Body: {requestBody}";
        _logger.LogInformation(requestLog);

        // Replace response body stream
        var originalResponseBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await _next(context); // Call the next middleware in the pipeline

        // Log Response
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var responseBodyText = await new StreamReader(context.Response.Body).ReadToEndAsync();
        var responseLog = $"Response Status: {context.Response.StatusCode}\n" +
                          $"Response Body: {responseBodyText}";
        _logger.LogInformation(responseLog);

        // Copy the response back to the original stream
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        await responseBody.CopyToAsync(originalResponseBodyStream);
    }

    private async Task<string> ReadRequestBody(HttpRequest request)
    {
        request.Body.Seek(0, SeekOrigin.Begin);
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        request.Body.Seek(0, SeekOrigin.Begin); // Reset the stream position after reading
        return body;
    }
}
