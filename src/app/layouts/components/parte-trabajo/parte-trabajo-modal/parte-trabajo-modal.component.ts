import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ObraService} from "../../../../services/obra.service";
import {Obra} from "../../../../models/obra";
import {ParteTrabajo} from "../../../../models/parte-trabajo";
import {ParteTrabajoService} from "../../../../services/parte-trabajo.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-parte-trabajo-modal',
  templateUrl: './parte-trabajo-modal.component.html',
  styleUrls: ['./parte-trabajo-modal.component.css']
})
export class ParteTrabajoModalComponent implements OnInit{
  obras: Obra [] = [];
  @Input() parte_trabajo_id!: number;
  @Input() parte!: ParteTrabajo;
  newParte!: FormGroup;
  @Input() isUpdate!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private obraService: ObraService,
    private parteService: ParteTrabajoService,
    private authService: AuthService
  ) {
    this.newParte = this.formBuilder.group({
      id_user: ['', Validators.required],
      id_obra: ['', Validators.required],
      fecha_parte: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticatedSubject.next(true);
    this.getObras();
    if (this.parte) {
      this.newParte.patchValue({
        id_user: this.parte.id_user,
        id_obra: this.parte.id_obra,
        fecha_parte: this.parte.fecha_parte
      });
    }
  }

  getObras(){
    this.obraService.getAll().subscribe({
      next:obra =>{
        this.obras = obra;
      }, error:error =>{
        console.log(error);
    }
    });
  }

  closeModal(): void{
    this.bsModalRef.hide();
    this.parteService.actualizarParte();
  }

  get f() { return this.newParte.controls; }

  save(): void {
    if (this.newParte.valid) {
      const parte = new ParteTrabajo(
        this.f['id_user'].value,
        this.f['id_obra'].value,
        this.f['fecha_parte'].value
      );

      if(this.isUpdate){
        this.parteService.update(this.parte.id, parte).subscribe({
          next: response => {
            this.parteService.actualizarParte();
            this.closeModal();
          },
          error: error => {
            console.log("Error al guardar");
          }
        });

      } else{
        this.parteService.save(parte).subscribe({
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
