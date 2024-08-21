import { Component } from '@angular/core'
import { IClient, IClientCollapsible } from 'src/app/shared/models/clients/clients'
import { ClientService } from 'src/app/shared/services/clients/client.service'
import { IProject, IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { currencies } from '../../shared/helpers/currency'
import { IMilestone, IMilestoneCollapsible } from 'src/app/shared/models/milestones/milestones'


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  public customers: IClient[] = []
  public clientToEdit: IClient | null = null
  public currencies = currencies
  public toggleShowProjects: boolean = false

  constructor(
    private clientService: ClientService) {
    this.getClients()
  }

  async createCustomer(customer: IClientCollapsible): Promise<void> {
    if (!customer.name) return

    try {
      const customerCreated = await this.clientService.createClient(customer)
      customer.id = customerCreated.id
      customer.editMode = false
    } catch (error) {
      console.error((error as any).error)
      // Create a toast notification
    }
  }

  displayProjects() {
    this.toggleShowProjects = !this.toggleShowProjects
  }

  addCustomer(): void {
    this.customers.push({ name: '', projects: [] })
  }

  edit() {
    console.log("editEntity")
  }

  private async getClients(): Promise<void> {
    this.customers = await this.clientService.getClients()
  }

  public async delete(customer: IClient): Promise<void> {
    if (!customer.name) {
      // this.deleteEntity(i, undefined, undefined, event)
      return
    }

    try {
      await this.clientService.deleteClient(customer.id!)
      this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }
}
