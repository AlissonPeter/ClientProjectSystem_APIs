using ClientProjectSystemCSharp.Models;
using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;

namespace ClientProjectSystemCSharp.Mappings
{
    public class ActivityMap : ClassMapping<Activity>
    {
        public ActivityMap() {
            Table("Activity");
            Id(x => x.Id, m => m.Generator(Generators.Identity));
            Property(x => x.Description, m =>
            {
                m.Length(100);
                m.NotNullable(true);
            });
            ManyToOne(x => x.Project, m =>
            {
                m.Column("ProjectId");   // Nome da coluna na tabela Project
                m.NotNullable(true);    // Se for obrigatório
            });
            ManyToOne(x => x.Status, m =>
            {
                m.Column("statusId");   // Nome da coluna na tabela Status
                m.NotNullable(true);    // Se for obrigatório
            });
        }
    }
}
