import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ICompany } from 'src/app/shared/models/companies/companies'
import { INewProject, IProject } from 'src/app/shared/models/projects/projects'
import { CompanyService } from 'src/app/shared/services/companies/company.service'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { currencies } from 'src/app/shared/helpers/currency'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  public projects: IProject[] = []
  public companies: ICompany[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public currencies = currencies

  constructor(
    private projectService: ProjectService,
    private companiesService: CompanyService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getProjects()
    this.getCompanies()
  }

  private async getProjects(): Promise<void> {
    this.projects = await this.projectService.getProjects()
  }

  private async getCompanies(): Promise<void> {
    this.companies = await this.companiesService.getCompanies()
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      currency: ['', [Validators.required]]
    })
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public openNewProjectModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear proyecto' })
    this.resetForm()
  }

  public async createProject(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { name, company, currency } = this.form.value

    const project: INewProject = {
      name,
      companyId: parseInt(company),
      currency: parseInt(currency)
    }

    const savedProject = await this.projectService.createProject(project)
    if (savedProject.id) {
      this.getProjects()
      this.modalService.close()
      this.resetForm()
    }
  }

  public async editProject(projectId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    const project = this.projects.find(project => project.id === projectId)

    if (!project) return

    this.form.patchValue({
      name: project.name,
      company: project.companyName,
      currency: project.currency
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar Proyecto' })
  }

  public async deleteProject(projectId: number): Promise<void> {
    const deletedProject = await this.projectService.deleteProject(projectId)

    if (deletedProject.id) { this.getProjects() }
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
