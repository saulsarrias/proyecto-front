import {Component, Input, OnInit} from '@angular/core';
import {Inventario} from "../../../../models/inventario";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {InventarioService} from "../../../../services/inventario.service";


@Component({
  selector: 'app-inventario-modal',
  templateUrl: './inventario-modal.component.html',
  styleUrls: ['./inventario-modal.component.css']
})
export class InventarioModalComponent implements OnInit{

  @Input() material!: Inventario;
  @Input() isUpdate!: boolean;
  newMaterial!: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
      public bsModalRef: BsModalRef,
      private inventarioService: InventarioService
  ) {
    this.newMaterial = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });
  }
  ngOnInit(): void {
    if(this.material){
      this.newMaterial.patchValue({
        nombre: this.material.nombre,
        descripcion: this.material.descripcion,
        cantidad: this.material.cantidad
      })
    }
  }

  get f() { return this.newMaterial.controls; }
  save(){
    if (this.newMaterial.valid) {
      const material = new Inventario(
          this.f['nombre'].value,
          this.f['descripcion'].value,
          this.f['cantidad'].value,
      );

      if(this.isUpdate){
        this.inventarioService.update(this.material.id, material).subscribe({
          next:response => {
          this.inventarioService.actualizarInventario();
          this.closeModal();
        },
        error:error => {
          console.log(error);
        }
      });
      } else{
        this.inventarioService.save(material).subscribe({
          next:response => {
          this.inventarioService.actualizarInventario();
          this.closeModal();
        },
        error:error => {
          console.error('Error al guardar el cliente:', error);
        }
      });
      }
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }

  closeModal(){
    this.bsModalRef.hide();
  }

}
