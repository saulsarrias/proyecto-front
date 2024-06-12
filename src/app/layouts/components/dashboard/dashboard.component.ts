import {Component, OnInit} from '@angular/core';
import {ParteTrabajo} from "../../../models/parte-trabajo";
import {ParteTrabajoService} from "../../../services/parte-trabajo.service";
import {LoadingService} from "../../../services/loading.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {forkJoin} from "rxjs";
import {Usuario} from "../../../models/usuario";
import jsPDF from "jspdf";
import {Tarea} from "../../../models/tarea";
import autoTable from "jspdf-autotable";
import {TareaService} from "../../../services/tarea.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  searchText: any;
  public page = 1;
  public pageSize = 8;
  partes: ParteTrabajo [] = [];
  usuarios: Usuario[] = [];

  constructor(
    private parteService: ParteTrabajoService,
    public loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private tareaService: TareaService,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${year}-${month}-${day}`;

    this.setTitle("Inicio");
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadingService.setLoadingState(true);
        this.authService.isAuthenticatedSubject.next(true);
        forkJoin([this.parteService.find(fechaFormateada), this.apiService.getUsuarios()])
          .subscribe(([partes, usuarios]) => {
            this.partes = partes;
            this.usuarios = usuarios;
            this.addEmpleado();
            this.loadingService.setLoadingState(false);
          });
      } else {
        window.location.reload();
        this.router.navigate(['/']);
      }
    });

  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  addEmpleado(){
    this.partes.forEach((parte: ParteTrabajo) => {
      const usuario = this.usuarios.find((usuario) => usuario.id === parte.id_user);
      if (usuario) {
        parte.nombre_empleado = usuario.name;
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
        console.log(total);
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
