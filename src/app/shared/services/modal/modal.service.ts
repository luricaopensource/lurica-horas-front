import { ComponentRef, Injectable, TemplateRef, ViewContainerRef } from "@angular/core"
import { ModalComponent } from "../../components/modal/modal.component"
import { Observable, Subject } from "rxjs"

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalNotifier?: Subject<string>
  public containerRef!: ViewContainerRef
  private componentRef!: ComponentRef<ModalComponent>
  private components: ComponentRef<ModalComponent>[] = []

  constructor() { }

  open(content: TemplateRef<any>, options?: { size?: string, title?: string }): Observable<string> {
    const componentRef = this.containerRef.createComponent(ModalComponent)

    componentRef.instance.content = content
    componentRef.instance.size = options?.size
    componentRef.instance.title = options?.title
    componentRef.instance.closeEvent.subscribe(() => this.closeModal())
    componentRef.instance.submitEvent.subscribe(() => this.submitModal())

    componentRef.hostView.detectChanges()

    this.componentRef = componentRef
    this.containerRef.insert(componentRef.hostView)
    this.modalNotifier = new Subject()

    this.components.push(componentRef)

    return this.modalNotifier.asObservable()
  }

  close() {
    this.components.forEach(component => component.destroy())
    this.closeModal()
  }

  private closeModal() {
    this.modalNotifier?.complete()
  }

  private submitModal() {
    this.modalNotifier?.next('submit')
    this.closeModal()
  }
}
