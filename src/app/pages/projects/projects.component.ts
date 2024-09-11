import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControlName, FormGroup, FormGroupDirective, Validators } from '@angular/forms'
import { currencies, getCurrencyId } from 'src/app/shared/helpers/currency'
import { IResponseModel } from 'src/app/shared/models'
import { IClientCollapsible } from 'src/app/shared/models/clients/clients'
import { INewProject, IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { ProjectService } from 'src/app/shared/services/project/project.service'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../clients/clients.component.css']
})
export class ProjectsComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  public currencies = currencies
  @Input() customer: IClientCollapsible = {} as IClientCollapsible

  constructor(
    private service: ProjectService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      projects: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.buildForm()
  }

  get projectsFormArray(): FormArray {
    return this.form.get('projects') as FormArray
  }

  addProjectToFormArray(project: IProjectCollapsible) {
    const projectFormGroup = this.fb.group({
      name: [{ value: project.name, disabled: !project.editMode }],
      currency: [{ value: getCurrencyId(project.currency), disabled: !project.editMode }],
      amount: [{ value: project.amount, disabled: !project.editMode }]
    })

    const formProjects = this.form.get('projects') as FormArray
    formProjects.push(projectFormGroup)
  }

  buildForm() {

    this.customer.projects.forEach((project) => {
      this.addProjectToFormArray(project)
    })
  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  toggleFields(project: IProjectCollapsible) {
    project.showMilestones = !project.showMilestones
  }

  toggleFormControls(index: number) {
    const projectFormGroup = this.projectsFormArray.at(index) as FormGroup
    const project = this.customer.projects[index]

    !project.editMode ? projectFormGroup.enable() : projectFormGroup.disable()

    project.editMode = !project.editMode
  }

  addProject(customer: IClientCollapsible): void {
    const project: IProjectCollapsible = { name: '', currency: '', amount: null, editMode: true, created: false, showMilestones: false, milestones: [] }

    this.addProjectToFormArray(project)

    customer.projects.push(project)
  }

  async save(index: number, customerId: number, event: Event): Promise<void> {
    this.stopPropagation(event)

    console.log(this.form.touched)
    const customerProject = this.customer.projects[index]

    if (!customerProject.editMode || !this.form.touched) {
      this.toggleFormControls(index)
      return
    }

    const projectFormGroup = this.projectsFormArray.at(index) as FormGroup

    const name = projectFormGroup.get('name')?.value
    const currency = projectFormGroup.get('currency')?.value
    const amount = projectFormGroup.get('amount')?.value

    if (!name || !currency || !amount) return

    const projectToCreate: INewProject = {
      name,
      currency,
      amount,
      clientId: customerId
    }

    const project = customerProject
    if (project.id) {
      projectToCreate.id = project.id
    }

    try {
      const response: IResponseModel = project.id
        ? await this.service.editProject(projectToCreate)
        : await this.service.createProject(projectToCreate)

      project.id = response.id
      this.toggleFormControls(index)
      this.form.markAsUntouched()
    } catch (error) {
      console.error(error)
    }
  }

  async delete(projectIndex: number, event: Event): Promise<void> {
    this.stopPropagation(event)

    const project = this.customer.projects[projectIndex]

    if (!project.created) {
      this.customer.projects.splice(projectIndex, 1)
      this.projectsFormArray.removeAt(projectIndex)
      return
    }

    try {
      await this.service.deleteProject(project.id!)
      this.customer.projects.splice(projectIndex, 1)
      this.projectsFormArray.removeAt(projectIndex)
    } catch (error) {
      console.error(error)
    }
  }
}
