import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
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
  }

  ngOnInit(): void {
    this.buildForm()
  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  toggleFields(project: IProjectCollapsible) {
    project.showMilestones = !project.showMilestones
  }

  buildForm() {
    this.form = new FormBuilder().group({})

    this.customer.projects.forEach((control) => {
      this.createFormControls(control)
    })
  }

  createFormControlsNames(project: IProjectCollapsible) {
    const projectName = project.name + project.id
    const projectCurrency = project.currency + project.id
    const projectAmount = project.amount + project.id!
    let stringProjectAmount = String(projectAmount)
    stringProjectAmount = stringProjectAmount.replace('.', '')
    project.amountControlName = stringProjectAmount

    return [projectName, projectCurrency, stringProjectAmount]
  }

  createFormControls(project: IProjectCollapsible) {
    const [projectName, projectCurrency, projectAmount] = this.createFormControlsNames(project)

    this.form.addControl(projectName, this.fb.control({ value: project.name, disabled: !project.editMode }))
    this.form.addControl(projectCurrency, this.fb.control({ value: getCurrencyId(project.currency), disabled: !project.editMode }))
    this.form.addControl(projectAmount, this.fb.control({ value: project.amount, disabled: !project.editMode }))
  }

  getFormControlsValues(project: IProjectCollapsible) {
    const [projectName, projectCurrency, projectAmount] = this.createFormControlsNames(project)

    return {
      name: this.form.get(projectName)?.value,
      currency: this.form.get(projectCurrency)?.value,
      amount: this.form.get(projectAmount)?.value
    }
  }

  addControlToForm(project: IProjectCollapsible) {
    this.createFormControls(project)
  }

  toggleFormControls(project: IProjectCollapsible) {
    const [controlName, controlCurrency, controlAmount] = this.createFormControlsNames(project)

    if (this.form.get(controlName)?.disabled) {
      this.form.get(controlName)?.enable()
      this.form.get(controlCurrency)?.enable()
      this.form.get(controlAmount)?.enable()
    } else {
      this.form.get(controlName)?.disable()
      this.form.get(controlCurrency)?.disable()
      this.form.get(controlAmount)?.disable()
    }
  }

  addProject(customer: IClientCollapsible): void {
    const project: IProjectCollapsible = { name: '', currency: '', amount: 0, editMode: true, created: false, showMilestones: false, milestones: [] }

    this.addControlToForm(project)

    customer.projects.push(project)
  }

  async save(project: IProjectCollapsible, customerId: number, event: Event): Promise<void> {
    this.stopPropagation(event)
    if (!project.editMode) {
      this.toggleFormControls(project)
      project.editMode = true
      return
    }


    const { name, currency, amount } = this.getFormControlsValues(project)

    if (!name || !currency || !amount) return

    const projectToCreate: INewProject = {
      name,
      currency,
      amount,
      clientId: customerId
    }

    if (project.id) projectToCreate.id = project.id

    try {
      const response: IResponseModel = project.id ? await this.service.editProject(projectToCreate) : await this.service.createProject(projectToCreate)

      project.id = response.id
      this.toggleFormControls(project)
    } catch (error) {
      console.error(error)
      // show error toast
    }
  }

  async delete(project: IProjectCollapsible, projectIndex: number, event: Event): Promise<void> {
    this.stopPropagation(event)
    if (!project.name && !project.currency && !project.amount) {
      this.customer.projects.splice(projectIndex, 1)
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
