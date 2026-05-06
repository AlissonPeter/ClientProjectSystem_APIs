using ClientProjectSystemLoginCSharp.Models;
using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;

namespace ClientProjectSystemLoginCSharp.Mappings
{
    public class LoginMap : ClassMapping<Login>
    {
        public LoginMap()
        {
            Table("Login");
            Id(x => x.Id, m => m.Generator(Generators.Identity));
            Property(x => x.Username, m =>
             {
                m.Length(100);
                m.NotNullable(true);
             });
            Property(x => x.Password, m =>
            {
                m.Length(100);
                m.NotNullable(true);
            });
        }
    }
}
