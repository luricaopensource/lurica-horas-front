import { Injectable, TemplateRef, ViewContainerRef } from "@angular/core"
import { ModalComponent } from "../../components/modal/modal.component"
import { Observable, Subject } from "rxjs"
import { NgTemplateOutlet } from "@angular/common"

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalNotifier?: Subject<string>
  public containerRef!: ViewContainerRef

  constructor() { }

  open(content: TemplateRef<ModalComponent>, options?: { size?: string, title?: string }): Observable<string> {
    const componentRef = this.containerRef.createComponent(ModalComponent)

    componentRef.instance.content = content
    componentRef.instance.size = options?.size
    componentRef.instance.title = options?.title
    componentRef.instance.closeEvent.subscribe(() => this.closeModal())
    componentRef.instance.submitEvent.subscribe(() => this.submitModal())

    componentRef.hostView.detectChanges()

    this.containerRef.insert(componentRef.hostView)
    this.modalNotifier = new Subject()
    return this.modalNotifier.asObservable()
  }

  private closeModal() {
    this.modalNotifier?.complete()
  }

  private submitModal() {
    this.modalNotifier?.next('submit')
    this.closeModal()
  }
}
