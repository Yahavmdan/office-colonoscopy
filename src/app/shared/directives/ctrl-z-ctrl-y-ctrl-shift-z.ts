import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ctrlZ]'
})
export class CtrlZDirective {
  @Output() ctrlZ = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === 'z' || event.key === 'Z' || event.key === 'ז') && !event.shiftKey) {
      event.preventDefault();
      this.ctrlZ.emit();
    }
  }
}

@Directive({
  selector: '[ctrlY]'
})
export class CtrlYDirective {
  @Output() ctrlY = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === 'y' || event.key === 'Y' || event.key === 'ט') && !event.shiftKey) {
      event.preventDefault();
      this.ctrlY.emit();
    }
  }
}

@Directive({
  selector: '[ctrlShiftZ]'
})
export class CtrlShiftZDirective {
  @Output() ctrlShiftZ = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === 'z' || event.key === 'Z' || event.key === 'ז') && event.shiftKey) {
      event.preventDefault();
      this.ctrlShiftZ.emit();
    }
  }
}
