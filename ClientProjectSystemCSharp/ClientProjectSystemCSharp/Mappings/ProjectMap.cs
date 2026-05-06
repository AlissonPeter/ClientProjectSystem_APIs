using ClientProjectSystemCSharp.Models;
using FluentNHibernate.Mapping;
using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;

namespace ClientProjectSystemCSharp.Mappings
{
    public class ProjectMap : ClassMapping<Project>
    {
        public ProjectMap() {
            Table("Project");
            Id(x => x.Id, m => m.Generator(Generators.Identity));
            Property(x => x.Description, m =>
            {
                m.Length(100);
                m.NotNullable(true);
            });
            ManyToOne(x => x.Client, m =>
            {
                m.Column("ClientId");   // Nome da coluna na tabela Project
                m.NotNullable(true);    // Se for obrigatório
            });
            ManyToOne(x => x.Status, m =>
            {
                m.Column("statusId");   // Nome da coluna na tabela Status
                m.NotNullable(true);    // Se for obrigatório
            });
            Bag(x => x.Activities, c =>
            {
                c.Key(k => k.Column("ProjectId"));  // Chave estrangeira na tabela Activity
                c.Inverse(true);                   // Importante: evita updates redundantes
                c.Cascade(Cascade.All | Cascade.DeleteOrphans);  // Opcional: se quiser propagar inserts/updates/delete
            },
            r => r.OneToMany()
            );

        }
    }
}
