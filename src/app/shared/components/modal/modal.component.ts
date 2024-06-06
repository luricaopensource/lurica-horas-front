import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit {
  @Input() public content!: TemplateRef<any>
  @Input() public size?: string = 'md'
  @Input() public title?: string = 'Modal Title'

  @Output() public closeEvent = new EventEmitter()
  @Output() public submitEvent = new EventEmitter()

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    if (this.content && this.contentContainer) {
      this.contentContainer.createEmbeddedView(this.content)
    }
  }

  public close(): void {
    this.elementRef.nativeElement.remove()
    this.closeEvent.emit()
  }

  public submit(): void {
    this.elementRef.nativeElement.remove()
    this.submitEvent.emit()
  }
}
