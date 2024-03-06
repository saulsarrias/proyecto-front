export class Cliente {
  id!: number;
  nombre: string;
  nif: string;
  email: string;
  direccion: string;
  poblacion: string;
  provincia: string;
  pais: string;
  codigo_postal: string;
  telefono: string;

  constructor(
    nombre: string,
    nif: string,
    email: string,
    direccion: string,
    poblacion: string,
    provincia: string,
    pais: string,
    codigo_postal: string,
    telefono: string
  ) {
    this.nombre = nombre;
    this.nif = nif;
    this.email = email;
    this.direccion = direccion;
    this.poblacion = poblacion;
    this.provincia = provincia;
    this.pais = pais;
    this.codigo_postal = codigo_postal;
    this.telefono = telefono;
  }
}
