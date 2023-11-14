import {AfterViewInit, Component, ElementRef, HostListener, Renderer2} from '@angular/core';
import { ElLocation, People, people, Title, titles } from "./consts/data";
import { CdkDragEnd, CdkDragStart } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-logistics',
  templateUrl: './shbzak.component.html',
  styleUrls: ['shbzak.component.scss']
})
export class ShbzakComponent implements AfterViewInit {

  public people: People[] = people;
  public titles: Title[] = titles;
  public lastUpdate: string = '';
  public localStorageKeys: string[] = [];
  private logChanges: ElLocation[] = [];
  private actionCounter: number = 0;

  private isDrawing = false;
  private startX: number;
  private startY: number;
  private currentBox: HTMLDivElement;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.getLocalStorageItems();
    this.retrievePositions();
    this.retrieveChanges();
  }

  private getLocalStorageItems(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key[0] === '$') {
        if (!this.localStorageKeys.includes(key)) {
          this.localStorageKeys.push(key);
        }
      }
    }
  }

  public deleteState(key: string): void {
    let answer: boolean = confirm('Are you sure you want to delete?');
    if (!answer) {
      return;
    }
    localStorage.removeItem(key);
    const index = this.localStorageKeys.indexOf(key);
    if (index !== -1) {
      this.localStorageKeys.splice(index, 1);
    }
  }

  public loadState(key: string): void {
    this.deleteNonDollarKeys();
    this.breakAndLoadLocalStorage(key);
  }

  private breakAndLoadLocalStorage(key: string): void {
    const storedObject = localStorage.getItem(key);

    if (!storedObject) {
      return;
    }
    const parsedObject = JSON.parse(storedObject);

    for (const [key, value] of Object.entries(parsedObject)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    this.retrievePositions();
    this.retrieveChanges();
  }

  private deleteNonDollarKeys(): void {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('$')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  public saveState(): void {
    const name = prompt('Enter: "$" to save the state');
    if (!name || !name.startsWith('$')) {
      return;
    }
    this.getTime();
    localStorage.setItem(name + ' - ' + this.lastUpdate, JSON.stringify(this.getAllLocalStorageItems()));
    this.localStorageKeys.push(name + ' - ' + this.lastUpdate);
  }

  private getAllLocalStorageItems(): string {
    const localStorageItems: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('$')) {
        const item = localStorage.getItem(key);
        if (item) {
          localStorageItems[key] = JSON.parse(item);
        }
      }
    }
    return localStorageItems;
  }

  public resetRecentChanges(sadak: HTMLDivElement): void {
    Array.from(sadak.children).forEach((element: Element) => {
      const person = element as HTMLElement;
      localStorage.removeItem(person.id);
      person.classList.remove('bg-light-red');
    });
  }

  public markChangedPerson(person: HTMLDivElement): void {
    if (!person.classList.contains('bg-light-red')) {
      localStorage.setItem(person.id, person.id);
      person.classList.add('bg-light-red');
      return;
    }
    person.classList.remove('bg-light-red');
    localStorage.removeItem(person.id);
  }

  private retrieveChanges(): void {
    this.people.forEach(person => {
      const el = document.getElementById(person.id.toString());
      const item = localStorage.getItem(person.id.toString());
      if (item === person.id.toString()) {
        this.markChangedPerson(el as HTMLDivElement);
      }
    })
  }

  private retrievePositions(): void {
    const teamPositions = localStorage.getItem('positions');

    if (!teamPositions) {
      return;
    }
    const storedPositions = JSON.parse(teamPositions);
    this.reArrangePositions(storedPositions);
  }

  private findAndReplace(updatedObject: { id: string, x: number, y: number }): void {
    const storedObjectsString = localStorage.getItem('positions');
    if (!storedObjectsString) {
      return;
    }
    const storedObjects: any[] = JSON.parse(storedObjectsString);
    const indexToUpdate = storedObjects.findIndex(obj => obj.id === updatedObject.id);

    if (indexToUpdate !== -1) {
      storedObjects[indexToUpdate].x = updatedObject.x;
      storedObjects[indexToUpdate].y = updatedObject.y;

      localStorage.setItem('positions', JSON.stringify(storedObjects));
    }
  }

  private reArrangePositions(storedPositions: ElLocation[] | ElLocation): void {
    if (!Array.isArray(storedPositions)) {
      this.findAndReplace(storedPositions);
      const element = document.getElementById(storedPositions.id);
      if (element !== null) {
        element.style.transform = `translate(${storedPositions.x}px, ${storedPositions.y}px)`;
      }
      return;
    }
    storedPositions.forEach((position: ElLocation) => {
      const element = document.getElementById(position.id);
      if (element) {
        element.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    });
  }

  public getTime(): void {
    this.lastUpdate = this.getDay() + ' ' + new Date().toLocaleString('he-IL');
  }

  private getDay(): string {
    const day = new Date().getDay();
    switch (day) {
      case 0:return 'ראשון';
      case 1:return 'שני';
      case 2:return 'שלישי';
      case 3:return 'רביעי';
      case 4:return 'חמישי';
      case 5:return 'שישי';
      case 6:return 'שבת';
      default:return 'Invalid Day';
    }
  }

  private getDragEvent(event: CdkDragStart | CdkDragEnd): ElLocation {
    const element = event.source.getRootElement();
    const id = element.id;
    const transform = this.getTransformValues(element);
    return {id, ...transform};
  }

  public onDragStart(event: CdkDragStart): void {
    this.storeDraggingLog(this.getDragEvent(event));
  }

  public onDragEnd(event: CdkDragEnd): void {
    this.getTime();
    const position = this.getDragEvent(event);
    let storedPositions = JSON.parse(localStorage.getItem('positions') || '[]');
    const existingIndex = storedPositions.findIndex((p: ElLocation) => p.id === position.id);

    if (existingIndex !== -1) {
      storedPositions[existingIndex] = position;
    } else {
      storedPositions.push(position);
    }

    localStorage.setItem('positions', JSON.stringify(storedPositions));
  }

  private getTransformValues(element: HTMLElement): { x: number; y: number } {
    const transform = {x: 0, y: 0};
    const style = window.getComputedStyle(element);

    if (style.transform) {
      const matrix = style.transform.match(/(-?\d+(\.\d+)?)/g);
      if (matrix && matrix.length >= 6) {
        transform.x = parseInt(matrix[4], 10);
        transform.y = parseInt(matrix[5], 10);
      }
    }

    return transform;
  }

  private storeDraggingLog(position: ElLocation): void {
    this.actionCounter ++;
    this.logChanges.push(position);
  }

  public undo(): void {
    if (!this.logChanges.length || this.actionCounter === 0) {
      return;
    }
    this.actionCounter --;
    this.reArrangePositions(this.logChanges[this.actionCounter]);
    this.actionCounter === 0 ? this.actionCounter = 1 : null;
  }

  public redo(): void {
    if (!this.logChanges.length || this.actionCounter === 0) {
      return;
    }
    if (this.actionCounter === this.logChanges.length) {
      this.reArrangePositions(this.logChanges[this.actionCounter -1]);
      return;
    }
    this.reArrangePositions(this.logChanges[this.actionCounter]);
    this.actionCounter ++;
  }
  private previousBox: HTMLDivElement;


  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (this.previousBox) {
      this.renderer.removeChild(this.el.nativeElement, this.previousBox);
    }

    this.isDrawing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.currentBox = this.renderer.createElement('div');
    this.currentBox.className = 'drawn-box';
    this.updateBoxSize(event);
    this.renderer.appendChild(this.el.nativeElement, this.currentBox);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.updateBoxSize(event);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDrawing = false;
    this.previousBox = this.currentBox;
  }

  private updateBoxSize(event: any) {
    const width = Math.abs(this.startX - event.clientX);
    const height = Math.abs(this.startY - event.clientY);

    this.renderer.setStyle(this.currentBox, 'width', `${width}px`);
    this.renderer.setStyle(this.currentBox, 'height', `${height}px`);

    this.renderer.setStyle(this.currentBox, 'left', `${Math.min(this.startX, event.clientX)}px`);
    this.renderer.setStyle(this.currentBox, 'top', `${Math.min(this.startY, event.clientY)}px`);
  }

}
