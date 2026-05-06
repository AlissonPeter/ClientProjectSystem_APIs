
using ClientProjectSystemLoginCSharp.Mappings;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Mapping.ByCode;
using NHibernate.Tool.hbm2ddl;

public static class NHibernateHelper
{
    private static ISessionFactory _sessionFactory;

    public static ISessionFactory SessionFactory
    {
        get
        {
            if (_sessionFactory == null)
                _sessionFactory = CreateSessionFactory();
            return _sessionFactory;
        }
    }

    private static ISessionFactory CreateSessionFactory()
    {
        try
        {

            var configuration = new Configuration();

            // Configuração do banco e mapeamentos aqui
            configuration.DataBaseIntegration(db =>
            {
                db.ConnectionString = "Server=localhost\\SQLEXPRESS;Database=db_clientprojectsystem;Trusted_Connection=True;";
                db.Dialect<NHibernate.Dialect.MsSql2012Dialect>();
                db.Driver<NHibernate.Driver.SqlClientDriver>();
                db.SchemaAction = SchemaAutoAction.Update;
            });

            configuration.SetProperty(NHibernate.Cfg.Environment.ConnectionDriver, "NHibernate.Driver.SqlClientDriver");


            // Mapeamento para criação das tabelas no DB
            var mapper = new ModelMapper();
            mapper.AddMapping<ClientMap>();
            mapper.AddMapping<ProjectMap>();
            mapper.AddMapping<ActivityMap>();
            mapper.AddMapping<StatusMap>();
            mapper.AddMapping<LoginMap>();
            var mappings = mapper.CompileMappingForAllExplicitlyAddedEntities();
            configuration.AddMapping(mappings);

            return configuration.BuildSessionFactory();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erro ao criar SessionFactory: " + ex);
            throw;
        }
    }

}
