namespace ClientProjectSystemCSharp.Mappings
{
    using ClientProjectSystemCSharp.Models;
    using NHibernate.Mapping.ByCode;
    using NHibernate.Mapping.ByCode.Conformist;

    public class StatusMap : ClassMapping<Status>
    {
        public StatusMap()
        {
            Table("Status");
            Id(x => x.Id, m => m.Generator(Generators.Identity));
            Property(x => x.Description, m =>
            {
                m.Length(100);
                m.NotNullable(true);
            });
            Property(x => x.Kind, m =>
            {
                m.NotNullable(true);
            });
        }
    }
}
