import {AfterViewInit, Component} from '@angular/core';


@Component({
  selector: 'app-logistics',
  templateUrl: './shbzak.component.html',
  styleUrls: ['shbzak.component.scss']
})
export class ShbzakComponent implements AfterViewInit {

  public people: { id: number, name: string, job: string }[] = [
    {id: 1, name: 'רפפורט גבריאל', job: 'מפקד'},
    {id: 2, name: 'בראונר אשר יעקב', job: 'תותחן'},
    {id: 3, name: 'אילוז עידו', job: 'טען'},
    {id: 4, name: 'ברי שניר', job: 'נהג'},
    {id: 5, name: 'אברמוביץ ינון', job: 'מפקד'},
    {id: 6, name: 'נדלר עומר', job: 'תותחן'},
    {id: 7, name: 'שנק גיא', job: 'טען'},
    {id: 8, name: 'בירגר דנטה סמואל', job: 'נהג'},
    {id: 9, name: 'כהן תום', job: 'מפקד'},
    {id: 10, name: 'שלם עוז', job: 'תותחן'},
    {id: 11, name: 'כהן אליה חיים', job: 'טען'},
    {id: 12, name: 'פיש ישראל מאיר', job: 'נהג'},
    {id: 13, name: 'כליף ארז', job: 'מפקד'},
    {id: 14, name: 'צבירן גיא', job: 'תותחן'},
    {id: 15, name: 'כהן בן בנימין', job: 'טען'},
    {id: 16, name: 'ריק ליאור', job: 'נהג'},
    {id: 17, name: 'נבו אביב', job: 'מפקד'},
    {id: 18, name: 'ציובוטרו גילעד', job: 'תותחן'},
    {id: 19, name: 'כבישי תאמר', job: 'טען'},
    {id: 20, name: 'נמני אבני יראל רפאל', job: 'נהג'},
    {id: 21, name: 'בית אריה דוד', job: 'מפקד'},
    {id: 22, name: 'קלור אוריאל', job: 'תותחן'},
    {id: 23, name: 'טולידנו תומר איתן', job: 'טען'},
    {id: 24, name: 'כהן יאיר', job: 'נהג'},
    {id: 25, name: 'קום בועז', job: 'מפקד'},
    {id: 26, name: 'דרטלר אסף', job: 'תותחן'},
    {id: 27, name: 'אורן שוקר', job: 'טען'},
    {id: 28, name: 'מנגיסטו ארמיאס', job: 'נהג'},
    {id: 29, name: 'גופמן גנדי צבי', job: 'מפקד'},
    {id: 30, name: 'איידלמן אריאל', job: 'תותחן'},
    {id: 31, name: 'צדקני נריה', job: 'טען'},
    {id: 32, name: 'יאיר שטרן', job: 'נהג'},
    {id: 33, name: 'שון בנבנישתי', job: 'תותחן'},
    {id: 34, name: 'מוסקוביץ איתן', job: 'תותחן'},
    {id: 35, name: 'בניטה אוריה', job: 'טען'},
    {id: 36, name: 'אלוש שמעון', job: 'נהג'},
    {id: 37, name: 'לוי אייל', job: 'תותחן'},
    {id: 38, name: 'דניאל טומניאן', job: 'נהג'},
    {id: 39, name: 'יהודה מורג', job: 'מפקד'},
    {id: 40, name: 'דין שלו', job: 'מפל"ג'},
    {id: 41, name: 'יהב דן', job: 'מפל"ג'},
    {id: 42, name: 'שני שם טוב', job: 'מפל"ג'},
    {id: 43, name: 'אליהו ראובן', job: 'מפל"ג'},
    {id: 44, name: 'רועי סולימני', job: 'מפל"ג'},
    {id: 45, name: 'אריאל קופלד', job: 'מפל"ג'},
    {id: 46, name: 'אבי גרינפילד', job: 'טען'},
    {id: 47, name: 'טל וקסמן', job: 'נהג'},
  ];

  public titles: { id: number, name: string }[] = [
    { id: 101, name: 'ג' },
    { id: 102, name: 'ד' },
    { id: 103, name: '1' },
    { id: 104, name: '2' },
    { id: 105, name: '3' },
    { id: 106, name: '1ב' },
    { id: 107, name: '2ב' },
    { id: 108, name: '3ב' },
    { id: 109, name: 'בבית' },
    { id: 110, name: 'קרית 8' },
    { id: 111, name: 'גדוד' }
  ];
  public lastUpdate: string = '';

  ngAfterViewInit(): void {
    this.retrievePositions();
    this.retrieveChanges();
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
    this.lastUpdate = new Date().toLocaleString();
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
