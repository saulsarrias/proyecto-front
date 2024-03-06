import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ObraService} from "../../../../../services/obra.service";
import {Obra} from "../../../../../models/obra";
import {Cliente} from "../../../../../models/cliente";

@Component({
  selector: 'app-obra-modal',
  templateUrl: './obra-modal.component.html',
  styleUrls: ['./obra-modal.component.css']
})
export class ObraModalComponent implements OnInit{
  @Input() clientes!: Cliente[];
  @Input() obra!: Obra;
  newObra!: FormGroup;
  @Input() isUpdate!: boolean;
  searchTerm: string = '';
  searchResults: Cliente[] = [];
  showResults: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private obraService: ObraService,
    private elementRef: ElementRef
  ) {
    this.newObra = this.formBuilder.group({
      id_cliente: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin_prevista: ['', Validators.required],
      presupuesto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //console.log(this.clientes);
    if (this.obra) {
      this.newObra.patchValue({
        id_cliente: this.obra.id_cliente,
        direccion: this.obra.direccion,
        estado: this.obra.estado,
        fecha_inicio: this.obra.fecha_inicio,
        fecha_fin_prevista: this.obra.fecha_fin_prevista,
        presupuesto: this.obra.presupuesto
      });
    }
    this.newObra.get('id_cliente')?.disable();
  }

  closeModal(): void{
    this.bsModalRef.hide();
  }

  get f() { return this.newObra.controls; }

  save(): void {
    if (this.newObra.valid) {
      const obra = new Obra(
        this.f['id_cliente'].value,
        this.f['direccion'].value,
        this.f['estado'].value,
        this.f['fecha_inicio'].value,
        this.f['fecha_fin_prevista'].value,
        this.f['presupuesto'].value
      );

      if(this.isUpdate){
        this.obraService.update(this.obra.id, obra).subscribe(
          response =>{
            console.log('Obra guardada exitosamente:', response);
            this.obraService.actualizarObra();
            this.closeModal();
          },
          error => {
            console.log("Error al guardar");
          }
        )
      } else{
        this.obraService.save(obra).subscribe(
          response => {
            console.log('Obra guardado exitosamente:', response);
            this.obraService.actualizarObra();
            this.closeModal();
          },
          error => {
            console.error('Error al guardar la obra:', error);
          }
        );
      }
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }

  searchClients() {
    console.log("buscando");
    if (this.searchTerm.length >= 0) {
      this.searchResults = this.clientes.filter(cliente => {
        return (
          cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          cliente.nif.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.showResults = true;
    } else {
      this.searchResults = [];
      this.showResults = false;
    }
    console.log(this.showResults);
    console.log(this.searchResults);
  }

  selectClient(cliente: Cliente) {
    this.closeList();
    console.log('Cliente seleccionado:', cliente);
    this.newObra.controls['id_cliente'].setValue(cliente.id);
  }

  closeList(){
    this.showResults = false;
  }
}
