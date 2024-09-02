import { Component, OnInit } from '@angular/core'
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
export class ClientsComponent implements OnInit {
  public customers: IClientCollapsible[] = []
  public clientToEdit: IClient | null = null
  public currencies = currencies
  public toggleShowProjects: boolean = false

  constructor(
    private service: ClientService) {
  }

  ngOnInit(): void {
    this.getClients()
  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  async createCustomer(customer: IClientCollapsible): Promise<void> {
    if (!customer.name) return

    try {
      const customerCreated = customer.id ? await this.service.updateClient(customer) : await this.service.createClient(customer)
      customer.id = customerCreated.id
      customer.editMode = false
    } catch (error) {
      console.error((error as any).error)
      // Create a toast notification
    }
  }

  displayProjects(customer: IClientCollapsible) {
    customer.showProjects = !customer.showProjects
  }

  addCustomer(): void {
    this.customers.push({ name: '', projects: [], editMode: true, showProjects: false })
  }

  edit(customer: IClientCollapsible, event: Event) {
    this.stopPropagation(event)
    customer.editMode = !customer.editMode
  }

  private async getClients(): Promise<void> {
    const clients = await this.service.getClients()

    this.customers = clients.map((client: IClient) => {
      let projects = client.projects?.map<IProjectCollapsible>((project: IProject) => {
        let milestones = project.milestones?.map<IMilestoneCollapsible>((milestone: IMilestone) => ({
          ...milestone,
          editMode: false,
          created: true
        }))

        return {
          ...project,
          editMode: false,
          showMilestones: false,
          milestones,
          created: true
        }
      })

      if (!projects || projects.length == 0) projects = []

      const newClient: IClientCollapsible = { ...client, editMode: false, showProjects: false, projects }

      return newClient
    })
  }

  public async delete(customer: IClient, customerIndex: number, event: Event): Promise<void> {
    this.stopPropagation(event)
    if (!customer.name) {
      this.customers.splice(customerIndex, 1)
      return
    }

    try {
      await this.service.deleteClient(customer.id!)
      this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }
}
