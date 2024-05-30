import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { ModalService } from './shared/services/modal/modal.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hourfront'

  constructor(private containerRef: ViewContainerRef, private modalService: ModalService) {
    this.modalService.containerRef = this.containerRef
  }
}
