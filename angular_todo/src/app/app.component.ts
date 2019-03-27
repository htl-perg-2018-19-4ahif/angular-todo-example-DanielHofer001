import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  filter: boolean = true;
  title = 'my Todo';
  todos: ITodoItem[] = [];
  newtodo: ITodoItem = ({ description: undefined });
  url = 'http://localhost:8080/api';
  user: string;
  description;
  done: boolean = false;
  assignedTo;
  date:Date;
  tododone: boolean;
  assignee: IPerson[] = [];
  currentedit = false;
  current: ITodoItem;
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.http.get(this.url + '/todos').subscribe((data: ITodoItem[]) => {
      this.todos = data;
    });
    this.http.get(this.url + '/people').subscribe((data: IPerson[]) => {
      this.assignee = data;
    });

  }
  setFilter() {
    if (this.filter) this.filter = false;
    else this.filter = true;
    console.log("Filter");
  }
  add() {
    this.http.post(this.url + '/todos', { description: this.newtodo.description, assignedTo: this.newtodo.assignedTo }, { headers: this.headers }).subscribe((data: ITodoItem) => {
      console.log("created")
      this.todos.push(data);
    });
    console.log("add", this.assignedTo);
  }
  edit(s: string) {
    if (this.currentedit) this.currentedit = false;
    this.currentedit = true;
    this.http.get(this.url + '/todos/' + s).subscribe((data: ITodoItem) => {
      this.current = data;
      this.tododone = data.done;
      this.description = data.description;
      this.assignedTo = data.assignedTo;
      this.date=data.date;
      console.log(this.current)
    });

    console.log(s)
  }
  update(s: string) {
    this.http.patch(this.url + '/todos/' + s, { description: this.description, assignedTo: this.assignedTo, done: this.tododone,date:this.date }, { headers: this.headers }).subscribe((data: ITodoItem) => {
      console.log("updated ", s, this.description, this.assignedTo, this.done,this.date)
      let l: number = this.todos.findIndex(i => i.id === parseInt(s));
      this.todos.splice(l, 1);
      this.todos.push(data)
    });
    // close edit view
    //  this.currentedit = false;
    console.log(s)
  }
  delete(s: string) {
    console.log(this.done)
    this.http.delete(this.url + '/todos/' + s).subscribe(() => {
      let l: number = this.todos.findIndex(i => i.id === parseInt(s));
      this.todos.splice(l, 1);
    });
    console.log(s)
  }
}
export interface ITodoItem {
  id?: number;
  assignedTo?: string;
  description: string;
  done?: boolean;
  date?:Date;
}
interface IPerson {
  name: string;
}
