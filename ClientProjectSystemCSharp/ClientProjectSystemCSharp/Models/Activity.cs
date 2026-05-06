

using System.Text.Json.Serialization;

namespace ClientProjectSystemCSharp.Models
{
    public class Activity
    {
        public virtual int? Id { get; set; }
        public virtual string Description { get; set; }
        [JsonIgnore]
        public virtual Project? Project { get; set; }
        public virtual Status Status { get; set; }

        public override bool Equals(object? obj)
        {
            return obj is Activity activity &&
                   Id == activity.Id &&
                   Description == activity.Description &&
                   EqualityComparer<Project>.Default.Equals(Project, activity.Project) &&
                   EqualityComparer<Status>.Default.Equals(Status, activity.Status);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Description, Project, Status);
        }
    }
}
