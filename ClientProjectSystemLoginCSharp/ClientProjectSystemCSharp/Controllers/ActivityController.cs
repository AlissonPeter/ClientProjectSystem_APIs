using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientProjectSystemLoginCSharp.Controllers
{
    [ApiController]
    [Route("Activities")]
    public class ActivityController : ControllerBase
    {
        private readonly ActivityService _activityService;

        public ActivityController(ActivityService activityservice)
        {
            _activityService = activityservice;
        }

        /*[HttpPost]
        public IActionResult CreateActivities([FromBody] List<Activity> activities)
        {
            _activityService.SaveOrUpdate(activities);
            return CreatedAtAction(nameof(GetById), new { id = activities.Id }, activities);
        }*/

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var Activity = _activityService.FindById(id);
            if (Activity == null) return NotFound();
            return Ok(Activity);
        }

    }
}
