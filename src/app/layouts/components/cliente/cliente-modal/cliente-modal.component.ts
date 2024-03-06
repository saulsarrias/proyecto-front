import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from "../../../../models/cliente";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ClienteService} from "../../../../services/cliente.service";

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent  implements OnInit{

  @Input() cliente!: Cliente;
  newCliente!: FormGroup;
  @Input() isUpdate!: boolean;
  @Input() isInfo!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private clienteService: ClienteService
  ) {
    this.newCliente = this.formBuilder.group({
      nif: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      direccion: ['', Validators.required],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      pais: ['', Validators.required],
      codigo_postal: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });
  }

  ngOnInit(): void {
    if (this.cliente) {
      this.newCliente.patchValue({
        nif: this.cliente.nif,
        nombre: this.cliente.nombre,
        email: this.cliente.email,
        telefono: this.cliente.telefono,
        direccion: this.cliente.direccion,
        poblacion: this.cliente.poblacion,
        provincia: this.cliente.provincia,
        pais: this.cliente.pais,
        codigo_postal: this.cliente.codigo_postal
      });
    }
  }

  closeModal(): void{
    this.bsModalRef.hide();
  }

  get f() { return this.newCliente.controls; }

  save(): void {
    if (this.newCliente.valid) {
      const cliente = new Cliente(
        this.f['nombre'].value,
        this.f['nif'].value,
        this.f['email'].value,
        this.f['direccion'].value,
        this.f['poblacion'].value,
        this.f['provincia'].value,
        'España',
        this.f['codigo_postal'].value,
        this.f['telefono'].value
      );

      if(this.isUpdate){
        this.clienteService.update(this.cliente.id, cliente).subscribe(
          response =>{
            console.log('Cliente guardado exitosamente:', response);
            this.closeModal();
          },
          error => {
            console.log("Error al guardar");
          }
        )
      } else{
        this.clienteService.save(cliente).subscribe(
          response => {
            console.log('Cliente guardado exitosamente:', response);
            this.closeModal();
          },
          error => {
            console.error('Error al guardar el cliente:', error);
          }
        );
      }
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }

}
