import { Component } from '@angular/core'
import { IClient, IClientCollapsible } from 'src/app/shared/models/clients/clients'
import { ClientService } from 'src/app/shared/services/clients/client.service'
import { IProject, IProjectCollapsible, IResponseProject } from 'src/app/shared/models/projects/projects'
import { currencies, getCurrencyId } from '../../shared/helpers/currency'
import { IMilestone, IMilestoneCollapsible } from 'src/app/shared/models/milestones/milestones'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'
import { IResponseModel } from '../../shared/models/index'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  public clients: IClientCollapsible[] = []
  public formSubmitted: boolean = false
  public isEditModal: boolean = false
  public clientToEdit: IClient | null = null
  public currencies = currencies

  constructor(
    private clientService: ClientService,
    private projectService: ProjectService,
    private milestoneService: MilestoneService) {
    this.getClients()
  }

  async createCustomer(customer: IClientCollapsible): Promise<void> {
    try {
      const customerCreated = await this.clientService.createClient(customer)
      customer.id = customerCreated.id
      customer.editMode = false
    } catch (error) {
      console.error((error as any).error)
      // Create a toast notification
    }
  }

  addCustomer(): void {
    this.clients.push({ name: '', editMode: true, showProjects: false, projects: [] })
  }

  addProject(customer: IClientCollapsible): void {
    customer.projects.push({ name: '', currency: '', amount: 0, created: false, editMode: true, showMilestones: false, milestones: [] })
  }

  addMilestone(customer: IClientCollapsible, newProject: IProjectCollapsible): void {
    const project = customer.projects.find(project => project.id === newProject.id)

    project!.milestones.push({ name: '', date: '', amountPercentage: 0, created: false, editMode: true })
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

  async saveProject(project: IProjectCollapsible, customerId: number, event: Event) {
    if (!project.editMode) {
      project.editMode = true
      return
    }
    event.stopPropagation()

    if (!project.name || !project.currency || !project.amount) return

    const response: IResponseModel = await this.projectService.createProject({
      name: project.name,
      currency: getCurrencyId(project.currency),
      amount: project.amount,
      client: customerId
    })

    project.id = response.id
    project.editMode = false
    project.created = true
  }

  async saveMilestone(milestone: IMilestoneCollapsible, projectId: number, event: Event) {
    if (!milestone.editMode) {
      milestone.editMode = true
      return
    }

    event.stopPropagation()

    if (!milestone.name || !milestone.date || !milestone.amountPercentage) return

    const response: IResponseModel = await this.milestoneService.createMilestone({
      name: milestone.name,
      date: milestone.date,
      amountPercentage: milestone.amountPercentage,
      projectId
    })

    milestone.id = response.id
    milestone.editMode = false
    milestone.created = true
  }

  editEntity(entity: IClientCollapsible, event: Event) {
    event.stopPropagation()
    entity.editMode = true
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

  public async deleteClient(customer: IClient, i: number, event: Event): Promise<void> {
    event.stopPropagation()

    if (!customer.name) {
      this.deleteEntity(i, undefined, undefined, event)
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

  async deleteProject(project: IProjectCollapsible, i: number, j: number, event: Event): Promise<void> {
    event.stopPropagation()

    if (!project.name && !project.currency && !project.amount) {
      this.deleteEntity(i, j, undefined, event)
      return
    }

    try {
      await this.projectService.deleteProject(project.id!)
      this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  async deleteMilestone(milestone: IMilestoneCollapsible, i: number, j: number, k: number, event: Event): Promise<void> {
    event.stopPropagation()

    if (!milestone.amountPercentage && !milestone.date && !milestone.name) {
      this.deleteEntity(i, j, k, event)
      return
    }

    try {
      await this.milestoneService.deleteMilestone(milestone.id!)
      this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public isInvalidInput(input: string): boolean {
    // TODO: Validate input
    return false
  }
}
