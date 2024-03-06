import {Component, ElementRef, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ObraService} from "../../../../services/obra.service";
import {FacturaService} from "../../../../services/factura.service";
import {ClienteService} from "../../../../services/cliente.service";
import {LineaFacturaService} from "../../../../services/linea-factura.service";
import {LineaFactura} from "../../../../models/linea-factura";

@Component({
  selector: 'app-linea-factura-modal',
  templateUrl: './linea-factura-modal.component.html',
  styleUrls: ['./linea-factura-modal.component.css']
})
export class LineaFacturaModalComponent {

  @Input() lineaFactura!: LineaFactura;
  newLineaFactura!: FormGroup;
  @Input() isUpdate!: boolean;
  @Input() id_factura!: number;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private obraService: ObraService,
    private elementRef: ElementRef,
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private lineaFacturaService: LineaFacturaService
  ) {
    this.newLineaFactura = this.formBuilder.group({
      id_factura: ['', Validators.required],
      base_unitaria: ['', Validators.required],
      precio: ['', Validators.required],
      iva: ['', Validators.required],
      concepto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.lineaFactura) {
      this.newLineaFactura.patchValue({
        id_factura: this.lineaFactura.id_factura,
        base_unitaria: this.lineaFactura.base_unitaria,
        precio: this.lineaFactura.precio,
        concepto: this.lineaFactura.concepto,
        iva: this.lineaFactura.iva
      });
    } else{
      this.newLineaFactura.patchValue({
          id_factura: this.id_factura
      })
    }
    this.newLineaFactura.get('id_factura')?.disable();
  }

  closeModal(): void{
    this.bsModalRef.hide();
    this.obraService.actualizarObra();
  }

  get f() { return this.newLineaFactura.controls; }
  save(): void {
    console.log(this.newLineaFactura.getRawValue());
    if (this.newLineaFactura.valid) {
      const lineaFactura = new LineaFactura(
        this.f['id_factura'].value,
        this.f['concepto'].value,
        this.f['base_unitaria'].value,
        this.f['iva'].value,
        this.f['precio'].value
      );

      if(this.isUpdate){
        this.lineaFacturaService.update(this.lineaFactura.id, lineaFactura).subscribe(
          response =>{
            console.log('Linea guardada exitosamente:', response);
            this.lineaFacturaService.actualizarLineaFactura();
            this.closeModal();
          },
          error => {
            console.log("Error al guardar");
          }
        )
      } else{
        this.lineaFacturaService.save(lineaFactura).subscribe(
          response => {
            console.log('Factura guardado exitosamente:', response);
            this.lineaFacturaService.actualizarLineaFactura();
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

}
