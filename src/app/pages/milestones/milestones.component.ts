import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { IMilestone } from 'src/app/shared/models/milestones/milestones'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.css']
})
export class MilestonesComponent {
  public milestones: IMilestone[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false

  constructor(
    private milestoneService: MilestoneService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getMilestones()
  }

  private async getMilestones(): Promise<void> {
    const milestones = await this.milestoneService.getMilestones()

    this.milestones = milestones
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      project: ['', [Validators.required]],
      date: ['', [Validators.required]],
      totalAmount: ['', [Validators.required]],
      paidAmount: ['', [Validators.required]],
      surplusAmount: ['', [Validators.required]]
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

    const milestone: IMilestone = this.form.value

    const response = await this.milestoneService.createMilestone(milestone)
    if (response.id) {
      this.getMilestones()
      this.modalService.close()
      this.resetForm()
    }
  }

  public async editMilestone(milestoneId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    const milestone = this.milestones.find(milestone => milestone.id === milestoneId)

    if (!milestone) return

    this.form.patchValue({
      name: milestone.name,
      totalAmount: milestone.totalAmount,
      paidAmount: milestone.paidAmount,
      surplusAmount: milestone.surplusAmount
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar Hito' })
  }

  public async deleteMilestone(milestoneId: number): Promise<void> {
    const response = await this.milestoneService.deleteMilestone(milestoneId);

    if (response.id) { this.getMilestones() }
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
