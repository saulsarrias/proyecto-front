import {Component, Input, OnInit} from '@angular/core';
import {Obra} from "../../../../../models/obra";
import {ParteTrabajo} from "../../../../../models/parte-trabajo";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ObraService} from "../../../../../services/obra.service";
import {ParteTrabajoService} from "../../../../../services/parte-trabajo.service";
import {AuthService} from "../../../../../services/auth.service";
import {Tarea} from "../../../../../models/tarea";
import {TareaService} from "../../../../../services/tarea.service";

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.component.html',
  styleUrls: ['./tarea-modal.component.css']
})
export class TareaModalComponent implements OnInit {
  @Input() parte_trabajo_id!: number;
  partes: ParteTrabajo [] = [];
  @Input() tarea!: Tarea;
  newTarea!: FormGroup;
  @Input() isUpdate!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private parteService: ParteTrabajoService,
    private authService: AuthService,
    private tareaService: TareaService
  ) {
    this.newTarea = this.formBuilder.group({
      parte_trabajo_id: ['', Validators.required],
      descripcion: ['', Validators.required],
      personal_asignado: ['', Validators.required],
      precio_por_hora: ['', Validators.required],
      horas_trabajadas: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticatedSubject.next(true);
    this.getPartes();
    if (this.tarea) {
      this.newTarea.patchValue({
        parte_trabajo_id: this.tarea.parte_trabajo_id,
        descripcion: this.tarea.descripcion,
        personal_asignado: this.tarea.personal_asignado,
        precio_por_hora: this.tarea.precio_por_hora,
        horas_trabajadas: this.tarea.horas_trabajadas
      });
    } else {
      this.newTarea.patchValue({
        parte_trabajo_id: this.parte_trabajo_id
      });
    }

  }

  getPartes(){
    this.parteService.getAll().subscribe({
      next:parte =>{
        this.partes = parte;
      }, error:error =>{
        console.log(error);
      }
    });
  }

  closeModal(): void{
    this.bsModalRef.hide();
    this.parteService.actualizarParte();
  }

  get f() { return this.newTarea.controls; }

  save(): void {
    if (this.newTarea.valid) {
      const tarea = new Tarea(
        this.f['parte_trabajo_id'].value,
        this.f['descripcion'].value,
        this.f['personal_asignado'].value,
        this.f['precio_por_hora'].value,
        this.f['horas_trabajadas'].value
      );

      if(this.isUpdate){
        this.tareaService.update(this.tarea.id, tarea).subscribe({
          next: response => {
            this.parteService.actualizarParte();
            this.closeModal();
          },
          error: error => {
            console.log("Error al guardar");
          }
        });

      } else{
        this.tareaService.save(tarea).subscribe({
          next:response=>
          {
            this.parteService.actualizarParte();
            this.closeModal();
          },
          error:error => {

          }
        });
      }
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }
}
