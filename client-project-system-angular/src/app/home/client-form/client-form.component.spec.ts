import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientFormComponent } from './client-form.component';
import { ClientTableSelectorComponent } from '../client-table-selector/client-table-selector.component';
import { Client } from '../../model/Client';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Mock do componente ClientTableSelectorComponent
class MockClientTableSelectorComponent {
  getClients() { }
}

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let httpTestingController: HttpTestingController;

  const mockClient = new Client();
  mockClient.id = '1';
  mockClient.name = 'Test Client';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adicionamos o `FormsModule` aqui novamente, e o `HttpClientTestingModule`.
      // Embora o componente standalone já importe o FormsModule, em alguns cenários
      // de injeção o TestBed precisa que ele seja declarado explicitamente aqui.
      imports: [FormsModule, ClientFormComponent, HttpClientTestingModule],

      providers: [
        { provide: ClientTableSelectorComponent, useClass: MockClientTableSelectorComponent }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    component.tableClients = new MockClientTableSelectorComponent() as ClientTableSelectorComponent;

    // Dispara o ciclo de vida do componente, incluindo ngOnInit
    fixture.detectChanges();

    //Faz a solicitação GET que fica no componente ClientTableSelectorComponent
    const req = httpTestingController.expectOne(`${component.API_BACKEND_URL}clients/all`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // Retorne um array vazio ou uma lista de clientes mockados
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle selected client correctly', () => {
    component.handleSelected(mockClient);
    expect(component.client).toEqual(mockClient);
  });

  it('should clear the form', () => {
    component.client = mockClient;
    component.clearForm();
    expect(component.client).toEqual(new Client());
  });

  it('should submit form and create a new client', async () => {
    // 1. Configurar o estado inicial do componente
    component.client.id = null; // Garante que será uma criação
    component.client.name = 'New Client';

    // 2. Espionar métodos que serão chamados (opcional, mas recomendado)
    spyOn(component.tableClients, 'getClients');

    // 3. Chamar o método que você quer testar
    const promise = component.submitForm();

    // 4. Interceptar a requisição HTTP que o método disparou
    const req = httpTestingController.expectOne(`${component.API_BACKEND_URL}clients`);
    expect(req.request.method).toEqual('POST');

    // 5. Simular a resposta da requisição
    req.flush({});

    // 6. Esperar a execução do método assíncrono
    await promise;

    // 7. Verificar se os resultados são os esperados
    expect(component.tableClients.getClients).toHaveBeenCalled();
    expect(component.client.id).toBeNull(); // Ou o valor retornado pela API
    expect(component.submitted).toBe(true);
  });

  it('should submit form and update an existing client', async () => {
    // 1. Configurar o estado inicial do componente
    //    Atribuir um ID ao cliente para que a requisição seja um PUT.
    const existingClient = new Client();
    existingClient.id = '123';
    existingClient.name = 'Existing Client';
    
    component.client = { ...existingClient }; // Clona o objeto para não alterar o original

    // 2. Espionar o método getClients
    spyOn(component.tableClients, 'getClients');

    // 3. Chamar o método que você quer testar
    const promise = component.submitForm();

    // 4. Interceptar a requisição HTTP que o método disparou
    //    A URL deve conter o ID do cliente.
    const req = httpTestingController.expectOne(`${component.API_BACKEND_URL}clients/${existingClient.id}?name=${existingClient.name}`);
    expect(req.request.method).toEqual('PUT');

    // 5. Simular a resposta da requisição PUT
    req.flush({});

    // 6. Esperar a execução do método assíncrono
    await promise;

    // 7. Verificar se os resultados são os esperados
    expect(component.tableClients.getClients).toHaveBeenCalled();
    expect(component.client.id).toBe(null); // Verifica se o formulário foi limpo
    expect(component.submitted).toBe(true);
  });
});