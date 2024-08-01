import { Component, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IClient, IClientCollapsible } from 'src/app/shared/models/clients/clients'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { ClientService } from 'src/app/shared/services/clients/client.service'
import { IProjectCollapsible } from 'src/app/shared/models/projects/projects'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  public clients: IClientCollapsible[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public isEditModal: boolean = false
  public clientToEdit: IClient | null = null

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getClients()
  }

  createCustomer(customer: IClientCollapsible): void {
    customer.editMode = false
    console.log("leaving customer input")
  }

  addCustomer(): void {
    this.clients.push({ name: '', editMode: true, showProjects: false, projects: [] })
  }

  addProject(customer: IClientCollapsible): void {
    customer.projects.push({ name: '', currency: '', amount: 0, editMode: true, showMilestones: false, milestones: [] })
  }

  addMilestone(customer: IClientCollapsible, newProject: IProjectCollapsible): void {
    const project = customer.projects.find(project => project.id === newProject.id)

    project!.milestones.push({ name: '', date: '', amountPercentage: 0, editMode: true })
  }

  toggleVisibility(i: number, j?: number) {
    if (j === undefined) {
      this.clients[i].showProjects = !this.clients[i].showProjects
    } else {
      this.clients[i].projects[j].showMilestones = !this.clients[i].projects[j].showMilestones
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  editEntity(entity: any, event: Event) {
    event.stopPropagation()
    entity.editMode = !entity.editMode
  }

  deleteEntity(i: number, j?: number, k?: number, event?: Event) {
    if (event) {
      event.stopPropagation()
    }
    if (k === undefined && j === undefined) {
      this.clients.splice(i, 1)
    } else if (k === undefined && j !== undefined) {
      this.clients[i].projects.splice(j, 1)
    } else if (j !== undefined && k !== undefined) {
      this.clients[i].projects[j].milestones.splice(k, 1)
    }
  }

  private async getClients(): Promise<void> {
    const clients = await this.clientService.getClients()

    this.clients = clients.map((client: IClient) => {
      const newClient: IClientCollapsible = { ...client, editMode: false, showProjects: false, projects: [] }

      return newClient
    })
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
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear empresa' })
    this.resetForm()
  }

  public async createClient(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const client: IClient = this.form.value

    try {
      await this.clientService.createClient(client)
      this.getClients()
      this.modalService.close()
      this.resetForm()
    }
    catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public openEditClientModal(clientId: number, modalTemplate: TemplateRef<any>): void {
    this.resetForm()

    this.isEditModal = true

    this.clientToEdit = this.clients.find(client => client.id === clientId) ?? null

    if (!this.clientToEdit) return

    this.form.patchValue({ name: this.clientToEdit.name })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar empresa' })
  }

  public async editClient(): Promise<void> {
    if (!this.clientToEdit) return

    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { name } = this.form.value

    const client: IClient = {
      id: this.clientToEdit.id,
      name
    }

    try {
      await this.clientService.updateClient(client)
      this.getClients()
      this.modalService.close()
      this.resetForm()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public async deleteClient(clientId: number): Promise<void> {
    try {
      await this.clientService.deleteClient(clientId)
      this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
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
