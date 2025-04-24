using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Cryptography.Xml;
using webapi.Model;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class MenuController : ControllerBase
{
    private static readonly string[] Menu = new[]
    {
        "UserInfo", "Location", "WeatherForecast"
    };

    private readonly ILogger<MenuController> _logger;

    public MenuController(ILogger<MenuController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetMenu")]
    public Menu GetMenu()
    {
        return new Menu
        {
            Title = Menu,
            Role = "Admin",
        };
    }

    [HttpGet("GetDataClasstostringJson")]
    public String GetDataClasstostringJson()
    {
        var Data = new
        {
            alarmCode = "",
            deviceCodes = new string[] { },
            channelIds = new string[] { },
            alarmStatus = new string[] { },
            alarmTypes = new string[] { },
            startAlarmTime = 1610991072,
            endAlarmTime = 1611423072,
            alarmGrade = new string[] { },
            handleUser = "",
            startHandleTime = "",
            endHandleTime = "",
            handleStatus = new string[] { },
            splitTime = "",
            splitId = "",
            currentPage = 1,
            pageSize = 20,
            page = 1,
            orderType = 1,
            orderDirection = 1
        };

        return JsonConvert.SerializeObject(Data);
    }

    public class ResponseModel
    {
        public object Response { get; set; }
        public string Message { get; set; }
    }
}
