import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[wheelClick]'
})
export class WheelClickDirective {
  @Output() wheelClick = new EventEmitter<MouseEvent>();

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 1) {
      this.wheelClick.emit(event);
    }
  }
}
