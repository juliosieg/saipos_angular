import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/task';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  task = {} as Task;
  completedTasks: Task[];
  pendingTasks: Task[];
  loading = false;
  formTask: FormGroup;
  submitted = false;
  generalErrorForm = '';
  didYouMean = '';

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.completedTasks = [];
    this.pendingTasks = [];
  }

  async onSubmit() {
    this.submitted = true;

    if (this.formTask.invalid) {
        return;
    }

    this.loading = true;
    await this.taskService.create(this.formTask.value).subscribe(() => {
      this.getTasks()
      this.loading = false;
      this.generalErrorForm = '';
    },
    (err) => {
      if(err.error.did_you_mean) {
        this.didYouMean = "Did you mean <b>" + err.error.did_you_mean + "</b>?";
        this.generalErrorForm = '';
      } else {
        this.generalErrorForm = err.error;
      }

      this.loading = false;
    });
  }

  ngOnInit() {
    this.formTask = this.fb.group({
      description: ['', Validators.required ],
      responsible: ['', Validators.required ],
      email: ['', [Validators.required, Validators.email] ]
   });
    this.getTasks();
  }

  get f() { return this.formTask.controls; }

  getTasks() {
    this.taskService.getTasks(0).subscribe((tasks: Task[]) => {
      this.pendingTasks = tasks;
    });

    this.taskService.getTasks(1).subscribe((tasks: Task[]) => {
      this.completedTasks = tasks;
    });
  }

  async randomTasks() {
    this.loading = true;
    await this.taskService.randomTasks().subscribe(() => {
      this.getTasks()
      this.loading = false;
    },(err) => {
      this.loading = false;
    })
  }

  async changeStatus(newStatus: number, id: number) {

    if(newStatus == 0) {
      let retorno = prompt("Insira a senha de supervisor");
      if (retorno != 'TrabalheNaSaipos') {
        if(retorno == null) {
          alert("Operação cancelada");
          return;
        } else {
          alert("Senha incorreta");
          return;
        }
      }
    }

    this.loading = true;
    await this.taskService.changeStatus(newStatus, id).subscribe(() => {
      this.getTasks()
      this.loading = false;
    },(err) => {
      this.loading = false;
    })
  }
}
