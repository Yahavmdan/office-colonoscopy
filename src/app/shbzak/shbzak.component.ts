import { AfterViewInit, Component } from '@angular/core';
import { People, people, Title, titles } from "./consts/data";

@Component({
  selector: 'app-logistics',
  templateUrl: './shbzak.component.html',
  styleUrls: ['shbzak.component.scss']
})
export class ShbzakComponent implements AfterViewInit {

  public people: People[] = people;
  public titles: Title[] = titles;
  public lastUpdate: string = '';
  public localStorageKeys: [] = [];

  ngAfterViewInit(): void {
    this.getLocalStorageItems();
    this.retrievePositions();
    this.retrieveChanges();
  }

  private getLocalStorageItems(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key[0] === '$') {
        // @ts-ignore
        this.localStorageKeys.push(key);
      }
    }
  }

  public deleteState(key: string): void {
    let answer: boolean = confirm('Are you sure you want to delete?');
    if (!answer) {
      return;
    }
    localStorage.removeItem(key);
    window.location.reload();
  }

  public loadState(key: string): void {
    this.deleteNonDollarKeys();
    this.breakAndLoadLocalStorage(key);
  }

  private breakAndLoadLocalStorage(key: string): void {
    const storedObject = localStorage.getItem(key);

    if (storedObject) {
      const parsedObject = JSON.parse(storedObject);

      for (const [key, value] of Object.entries(parsedObject)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      window.location.reload();
    } else {
      console.log("No object found in local storage with the provided key.");
    }
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
    window.location.reload();
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
    storedPositions.forEach((position: any) => {
      const element = document.getElementById(position.id);
      if (element !== null) {
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

  public onDragEnd(event: any): void {
    this.getTime();
    const element = event.source.getRootElement();
    const id = element.id;
    const transform = this.getTransformValues(element);
    const position = {id, ...transform};
    let storedPositions = JSON.parse(localStorage.getItem('positions') || '[]');

    const existingIndex = storedPositions.findIndex((p: any) => p.id === id);

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

}
