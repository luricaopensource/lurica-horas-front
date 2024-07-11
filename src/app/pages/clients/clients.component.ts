import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IClient } from 'src/app/shared/models/clients/clients'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { ClientService } from 'src/app/shared/services/clients/client.service'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  public clients: IClient[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getClients()
  }

  private async getClients(): Promise<void> {
    const clients = await this.clientService.getClients()

    this.clients = clients
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    })
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public openNewClientModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear cliente' })
    this.resetForm()
  }

  public async createClient(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const client: IClient = this.form.value

    const response = await this.clientService.createClient(client)
    if (response.id) {
      this.getClients()
      this.modalService.close()
      this.resetForm()
    }
  }

  public async editClient(clientId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    const client = this.clients.find(client => client.id === clientId)

    if (!client) return

    this.form.patchValue({
      name: client.name,
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar cliente' })
  }

  public async deleteClient(clientId: number): Promise<void> {
    const response = await this.clientService.deleteClient(clientId);

    if (response.id) { this.getClients() }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }
}
