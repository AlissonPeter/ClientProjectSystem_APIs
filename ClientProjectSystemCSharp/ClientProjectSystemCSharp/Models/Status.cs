
namespace ClientProjectSystemCSharp.Models
{
    public class Status
    {
        public virtual int? Id { get; set; }
        public virtual string Description { get; set; }
        public virtual int Kind { get; set; }

        public override bool Equals(object? obj)
        {
            return obj is Status status &&
                   Id == status.Id &&
                   Description == status.Description &&
                   Kind == status.Kind;
        }
        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Description, Kind);
        }
    }
}
