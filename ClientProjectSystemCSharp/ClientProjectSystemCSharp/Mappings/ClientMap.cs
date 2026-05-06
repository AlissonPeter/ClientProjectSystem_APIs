namespace ClientProjectSystemCSharp.Mappings
{
    using ClientProjectSystemCSharp.Models;
    using NHibernate.Mapping.ByCode;
    using NHibernate.Mapping.ByCode.Conformist;

    public class ClientMap : ClassMapping<Client>
    {
        public ClientMap()
        {
            Table("Client");
            Id(x => x.Id, m => m.Generator(Generators.Identity));
            Property(x => x.Name, m =>
            {
                m.Length(100);
                m.NotNullable(true);
            });
        }
    }
}
