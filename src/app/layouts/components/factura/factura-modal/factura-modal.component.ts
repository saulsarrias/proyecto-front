import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Cliente} from "../../../../models/cliente";
import {Factura} from "../../../../models/factura";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

import {ObraService} from "../../../../services/obra.service";
import {Obra} from "../../../../models/obra";
import {FacturaService} from "../../../../services/factura.service";
import {ClienteService} from "../../../../services/cliente.service";


@Component({
  selector: 'app-factura-modal',
  templateUrl: './factura-modal.component.html',
  styleUrls: ['./factura-modal.component.css']
})
export class FacturaModalComponent implements OnInit{
  clientes: Cliente[] = [];
  obras: Obra [] = [];
  @Input() factura!: Factura;
  newFactura!: FormGroup;
  @Input() isUpdate!: boolean;
  searchTerm: string = '';
  searchResults: Cliente[] = [];
  showResults: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private obraService: ObraService,
    private elementRef: ElementRef,
    private facturaService: FacturaService,
    private clienteService: ClienteService
  ) {
    this.newFactura = this.formBuilder.group({
      id_cliente: ['', Validators.required],
      id_obra: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      monto: ['', Validators.required],
      estado_pago: ['', Validators.required],
      retencion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
    console.log(this.clientes);
    if (this.factura) {
      this.newFactura.patchValue({
        id_cliente: this.factura.id_cliente,
        id_obra: this.factura.id_obra,
        fecha_emision: this.factura.fecha_emision,
        monto: this.factura.monto,
        estado_pago: this.factura.estado_pago,
        retencion: this.factura.retencion
      });
    }
    this.newFactura.get('id_cliente')?.disable();
  }
  selectClient(cliente: Cliente) {
    console.log('Cliente seleccionado:', cliente);
    this.newFactura.controls['id_cliente'].setValue(cliente.id);
    this.getObrasById(cliente.id);
    this.closeList();
  }

  closeList(){
    this.showResults = false;
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

  closeModal(): void{
    this.bsModalRef.hide();
    this.obraService.actualizarObra();
  }



  get f() { return this.newFactura.controls; }
  save(): void {
    if (this.newFactura.valid) {
      const factura = new Factura(
        this.f['id_cliente'].value,
        this.f['id_obra'].value,
        this.f['fecha_emision'].value,
        this.f['monto'].value,
        this.f['estado_pago'].value,
        this.f['retencion'].value,
        "ES21 0000 0000 00 0000000000"
      );

      if(this.isUpdate){
        this.facturaService.update(this.factura.id, factura).subscribe(
          response =>{

            this.facturaService.actualizarFactura();
            this.closeModal();
          },
          error => {
            console.log("Error al guardar");
          }
        )
      } else{
        this.facturaService.save(factura).subscribe(
          response => {

            this.facturaService.actualizarFactura();
            this.closeModal();
          },
          error => {
            console.error('Error al guardar la factura:', error);
          }
        );
      }
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }

  getAllClientes() {
    this.clienteService.getAllClientes()
      .subscribe(
        clientes => {
          this.clientes = clientes;

          console.log(clientes);
        },
        error => {
          console.error('Error al obtener clientes:', error);
        }
      );
  }

  getObrasById(id: number){
    this.obraService.getById(id).subscribe({
      next:response => {
        this.obras = response;
        console.log(response);
      }, error:error => {
        console.log(error);
      }
    })
  }

}
