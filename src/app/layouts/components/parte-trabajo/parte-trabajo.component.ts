import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Obra} from "../../../models/obra";
import {ParteTrabajo} from "../../../models/parte-trabajo";
import {Tarea} from "../../../models/tarea";
import {LoadingService} from "../../../services/loading.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {SortingService} from "../../../services/sorting.service";
import {ParteTrabajoService} from "../../../services/parte-trabajo.service";
import {TareaService} from "../../../services/tarea.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {TareaModalComponent} from "./tarea/tarea-modal/tarea-modal.component";
import {ParteTrabajoModalComponent} from "./parte-trabajo-modal/parte-trabajo-modal.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-parte-trabajo',
  templateUrl: './parte-trabajo.component.html',
  styleUrls: ['./parte-trabajo.component.css']
})
export class ParteTrabajoComponent implements OnInit{
  partes: ParteTrabajo[] = [];
  tareas: Tarea[] = [];
  obras: Obra[] = [];
  bsModalRef!: BsModalRef;
  searchText: any;
  public page = 1;
  public pageSize = 10;
  parteSeleccionado: ParteTrabajo | null = null;
  cliente = '';

  constructor(
      public loadingService: LoadingService,
      private authService: AuthService,
      private router: Router,
      public sortingService: SortingService,
      private modalService: BsModalService,
      private parteService: ParteTrabajoService,
      private tareaService: TareaService,
      private titleService: Title
  ) {
  }

  ngOnInit() {
    this.setTitle("Partes");
    this.loadingService.setLoadingState(true);
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.parteService.actualizacionPartes$.subscribe(() => {
          this.getPartes();
        });
        this.getPartes();

      } else {
        this.loadingService.setLoadingState(false);
        console.log('El usuario no está autenticado.');
        this.router.navigate(['/']);
      }
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getPartes() {
    this.loadingService.setLoadingState(true);
    this.parteService.getAll().subscribe({
      next: parte => {
        this.partes = parte;
        this.loadingService.setLoadingState(false);
      }, error: error => {
        this.loadingService.setLoadingState(false);
        console.log(error);
      }
    });
  }

  public getTareasById(id: number) {
    this.tareaService.find(id).subscribe({
      next: tarea => {
        this.tareas = tarea;
      }, error: error => {
        console.log(error);
      }
    });
  }

  toggleDetalle(parte: ParteTrabajo): void {
    if (this.parteSeleccionado === parte) {
      this.parteSeleccionado = null;
      this.tareas = [];
    } else {
      this.parteSeleccionado = parte;
      this.getTareasById(parte.id);
    }
  }

  showParteModalUpdate(parte: ParteTrabajo) {
    this.bsModalRef = this.modalService.show(ParteTrabajoModalComponent, {
      initialState: {
        parte: parte,
        isUpdate: true
      }
    });
  }
  showParteModal() {
    this.bsModalRef = this.modalService.show(ParteTrabajoModalComponent);
  }

  showTareaModal(id: number) {
  this.bsModalRef = this.modalService.show(TareaModalComponent, {
    initialState: {
      tarea: undefined,
      parte_trabajo_id: id
    }
  });
  }

  showTareaModalUpdate(tarea: Tarea) {
    this.bsModalRef = this.modalService.show(TareaModalComponent, {
      initialState: {
        tarea: tarea,
        isUpdate: true
      }
    });
  }

  deleteTarea(id: number) {
    this.tareaService.delete(id).subscribe({
      next: response => {
        this.tareaService.actualizarTarea();
      }, error: error => {
        console.log(error);
      }
    });
  }

  deleteParte(id: number) {
    this.parteService.delete(id).subscribe({
      next: response => {
      this.parteService.actualizarParte();
      }, error: error => {
        console.log(error);
      }
    });
  }

  descargarParte(parte: ParteTrabajo) {
    const doc = new jsPDF();
    const imgData = '../../../../assets/images/logo.png';
    const fechaEmisionString = parte.fecha_parte;
    const fechaEmision = new Date(fechaEmisionString);
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    // @ts-ignore
    const fechaFormateada = fechaEmision.toLocaleDateString('es-ES', options);
    this.tareaService.find(parte.id).subscribe((tareas: any[]) => {
      doc.setFontSize(16);
      doc.text("ESTRUCTURAS Y", 15, 10);
      doc.text("CONSTRUCCIONES", 15, 20);
      doc.text("ANDREU S.L", 15, 30);
      doc.addImage(imgData, 'PNG', 155, 5, 37, 45);
      doc.setFontSize(10); // Utiliza un tamaño de fuente más pequeño
      doc.text("Direccion: Calle Inventada 123. (Orihuela)", 15, 40);
      doc.text("Correo: construccionesandreu@gmail.com", 15, 45);
      doc.text("Telefono: +34 123 456 789", 15, 50);
      doc.text("www.construccionesandreu.com", 15, 55);
      doc.text("Factura nº: " + parte.id.toString(), 15, 70);
      doc.text("Fecha: " + fechaFormateada.toString(), 15, 75);
      const headers = [['ID', 'Descripcion', 'Horas Trabajadas', 'Precio', 'Importe']];
      const data: any[][] = [];
      let total = 0;
      let id = 1;
      tareas.forEach((tarea: Tarea) => {
        total = total + (tarea.precio_por_hora * tarea.horas_trabajadas)
        const rowData = [
          id.toString(),
          tarea.descripcion,
          tarea.horas_trabajadas.toString(),
          tarea.precio_por_hora.toString() + '€',
          (tarea.horas_trabajadas * tarea.precio_por_hora).toString() + '€'
        ];
        id = id + 1;
        data.push(rowData);
      });
      data.push(['', '', '', 'Total', total.toFixed(2) + '€']);
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 80,
      });
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

}
