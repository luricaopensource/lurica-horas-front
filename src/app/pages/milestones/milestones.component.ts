import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IResponseModel } from 'src/app/shared/models'
import { IMilestoneCollapsible } from 'src/app/shared/models/milestones/milestones'
import { IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['../clients/clients.component.css']
})
export class MilestonesComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  @Input() project: IProjectCollapsible = {} as IProjectCollapsible;

  constructor(
    private service: MilestoneService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      milestones: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.buildForm()
  }

  get milestonesFormArray(): FormArray {
    return this.form.get('milestones') as FormArray
  }

  private buildForm(): void {
    this.project.milestones.forEach(milestone => {
      this.addMilestoneToFormArray(milestone)
    })
  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  toggleFields(milestone: IMilestoneCollapsible, event: Event): void {
    this.stopPropagation(event)

    milestone.collapsed = !milestone.collapsed
  }

  addMilestoneToFormArray(milestone: IMilestoneCollapsible): void {
    const date = milestone.date ? new Date(milestone.date).toISOString().split('T')[0] : null
    const amountPercentage = milestone.amountPercentage ? milestone.amountPercentage : null

    const milestoneFormGroup = this.fb.group({
      name: [{ value: milestone.name, disabled: !milestone.editMode }, Validators.required],
      date: [{ value: date, disabled: !milestone.editMode }, Validators.required],
      amountPercentage: [{ value: amountPercentage, disabled: !milestone.editMode }, Validators.required]
    })

    this.milestonesFormArray.push(milestoneFormGroup)
  }

  addMilestone(): void {
    const milestone: IMilestoneCollapsible = { name: '', date: '', amountPercentage: 0, created: false, editMode: true, collapsed: false }
    this.project.milestones.push(milestone)
    this.addMilestoneToFormArray(milestone)
  }

  toggleFormControls(index: number): void {
    const milestoneFormGroup = this.milestonesFormArray.at(index) as FormGroup
    const milestone = this.project.milestones[index]

    !milestone.editMode ? milestoneFormGroup.enable() : milestoneFormGroup.disable()

    milestone.editMode = !milestone.editMode
  }

  async saveMilestone(index: number, projectId: number, event: Event): Promise<void> {
    this.stopPropagation(event)
    const projectMilestone = this.project.milestones[index]

    if (!projectMilestone.editMode || !this.form.touched) {
      this.toggleFormControls(index)
      return
    }

    const milestoneFormGroup = this.milestonesFormArray.at(index) as FormGroup
    const { name, date, amountPercentage } = milestoneFormGroup.value

    if (!name || !date || !amountPercentage) return

    const milestone = this.project.milestones[index]

    try {
      const response: IResponseModel = milestone.created
        ? await this.service.updateMilestone({ id: milestone.id, name, date, amountPercentage, projectId })
        : await this.service.createMilestone({ name, date, amountPercentage, projectId })

      milestone.id = response.id
      this.toggleFormControls(index)
      this.form.markAsUntouched()
    } catch (error) {
      console.error(error)
    }
  }

  async deleteMilestone(index: number, event: Event): Promise<void> {
    this.stopPropagation(event)

    const milestone = this.project.milestones[index]

    if (!milestone.created) {
      this.project.milestones.splice(index, 1)
      this.milestonesFormArray.removeAt(index)
      return
    }

    try {
      await this.service.deleteMilestone(milestone.id!)
      this.project.milestones.splice(index, 1)
      this.milestonesFormArray.removeAt(index)
    } catch (error) {
      console.error(error)
    }
  }
}
