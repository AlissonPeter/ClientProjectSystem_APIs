
namespace ClientProjectSystemLoginCSharp.Models
{
    public class Project
    {
        public virtual int? Id { get; set; }
        public virtual string Description { get; set; }
        public virtual Client Client { get; set; }
        public virtual Status Status { get; set; }
        public virtual IList<Activity> Activities { get; set; }

        public override bool Equals(object? obj)
        {
            return obj is Project project &&
                   Id == project.Id &&
                   Description == project.Description &&
                   EqualityComparer<Client>.Default.Equals(Client, project.Client) &&
                   EqualityComparer<Status>.Default.Equals(Status, project.Status) &&
                   EqualityComparer<IList<Activity>>.Default.Equals(Activities, project.Activities);
        }
        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Description, Client, Status, Activities);
        }
    }
}
