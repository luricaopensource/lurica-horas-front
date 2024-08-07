import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { IMilestone, INewMilestone } from 'src/app/shared/models/milestones/milestones'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'
import { IProject } from 'src/app/shared/models/projects/projects'
import { ProjectService } from 'src/app/shared/services/project/project.service'

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.css']
})
export class MilestonesComponent {
  public milestones: IMilestone[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public projects: IProject[] = []
  public milestoneToEdit: IMilestone | null = null
  public isEditModal: boolean = false

  constructor(
    private milestoneService: MilestoneService,
    private projectsService: ProjectService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getMilestones()
    this.getProjects()
  }

  private async getMilestones(): Promise<void> {
    const milestones = await this.milestoneService.getMilestones()

    this.milestones = milestones

    this.milestones.forEach((milestone: IMilestone) => {
      const date = new Date(milestone.date)
      milestone.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    })
  }

  private async getProjects(): Promise<void> {
    this.projects = await this.projectsService.getProjects()
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      project: ['', [Validators.required]],
      date: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    })
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public openNewMilestoneModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear hito' })
    this.resetForm()
  }

  public async createMilestone(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { name, date, amount, project } = this.form.value

    const milestone: INewMilestone = {
      name,
      date,
      amountPercentage: amount,
      projectId: parseInt(project),
    }



    try {
      await this.milestoneService.createMilestone(milestone)
      this.getMilestones()
      this.modalService.close()
      this.resetForm()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public async openEditMilestoneModal(milestoneId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    const milestone = this.milestones.find(milestone => milestone.id === milestoneId)

    if (!milestone) return

    this.milestoneToEdit = milestone

    this.form.patchValue({
      name: milestone.name,
      amount: 0,
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar Hito' })
  }

  public async editMilestone(): Promise<void> {
    if (!this.milestoneToEdit) return

    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { name, project, date, amount } = this.form.value

    const milestone: INewMilestone = {
      id: this.milestoneToEdit.id,
      name,
      projectId: parseInt(project),
      date,
      amountPercentage: amount
    }

    try {
      await this.milestoneService.updateMilestone(milestone)
      this.getMilestones()
      this.modalService.close()
      this.resetForm()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public async deleteMilestone(milestoneId: number): Promise<void> {
    try {
      await this.milestoneService.deleteMilestone(milestoneId)
      this.getMilestones()
    }
    catch (error) {
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
