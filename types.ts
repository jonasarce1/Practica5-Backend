export type Tarjeta = {
    number: string, //Numero de tarjeta (1111 2222 3333 4444), obligatorio
    cvv: string, //3 caracteres, obligatorio
    expirity: string, //expiracion, formato MM/YYYY
    money: number //dinero en la cuenta, si no se pone nada es 0
}

export type Cliente = {
    name: string, //obligatorio
    email: string, //unico, obligatorio, formato email
    cards: Array<Tarjeta>, //Array de tarjetas, opcional
    travels: Array<Viaje> //Array de viajes, opcional
}

export type Conductor = {
    name: string, //obligatorio
    email: string, //unico, obligatorio, formato email
    username: string //unico, obligatorio
    travels: Array<Viaje> //Array de viajes, opcional
}

export enum Status {
    Preparado = "Preparado",
    EnProgreso = "EnProgreso",
    Realizado = "Realizado"
}

export type Viaje = {
    client: Cliente, //obligatorio, unico
    driver: Conductor, //obligatorio, unico
    money: number, //obligatorio, minimo 5 euros
    distance: number, //obligatorio, en km, minimo 0,01km
    date: Date, //obligatorio
    status: Status //Estado del vuelo, obligatorio
}