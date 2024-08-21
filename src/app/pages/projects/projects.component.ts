import { Component, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { getCurrencyId } from 'src/app/shared/helpers/currency'
import { IResponseModel } from 'src/app/shared/models'
import { IClientCollapsible } from 'src/app/shared/models/clients/clients'
import { INewProject, IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { ProjectService } from 'src/app/shared/services/project/project.service'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  public form: FormGroup = new FormGroup({})

  constructor(
    private service: ProjectService
  ) {
  }

  addProject(customer: IClientCollapsible): void {
    customer.projects.push({ name: '', currency: '', amount: 0, created: false, editMode: true, showMilestones: true, milestones: [] })
  }

  async saveProject(project: IProjectCollapsible, customerId: number, i: number, event: Event, j?: number) {
    event.stopPropagation()

    if (!project.editMode) {
      project.editMode = true
      return
    }

    if (!project.name || !project.currency || !project.amount) return

    const projectToCreate: INewProject = {
      name: project.name,
      currency: getCurrencyId(project.currency),
      amount: project.amount,
      client: customerId
    }

    if (project.id) projectToCreate.id = project.id

    const response: IResponseModel = project.created ? await this.service.editProject(projectToCreate) : await this.service.createProject(projectToCreate)

    project.id = response.id
    project.currencyId = getCurrencyId(project.currency)
    project.editMode = false
    project.created = true
  }

  async deleteProject(project: IProjectCollapsible, i: number, j: number, event: Event): Promise<void> {
    event.stopPropagation()

    if (!project.name && !project.currency && !project.amount) {
      // this.deleteEntity(i, j, undefined, event)
      return
    }

    try {
      await this.service.deleteProject(project.id!)
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }
}
