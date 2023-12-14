import mongoose, {Schema, InferSchemaType} from "mongoose";
import { ViajeModel, ViajeModelType } from "./viaje.ts";
import { ConductorModel } from "./conductor.ts";

const ClienteSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    cards: [{ //array de objetos Tarjeta, no uso objectID ya que tarjeta no sera coleccion de mongo
        number: {type: String, required: true},
        cvv: {type: String, required: true},
        expirity: {type: String, required: true},
        money: {type: Number, required: false, default: 0}, 
    }, {required: false, default: []}],
    travels: [{type: Schema.Types.ObjectId, required: false, ref:"Viaje", default: []}]
})

//Validate nombre (que no este vacio y que tenga sentido)
ClienteSchema.path("name").validate(function (name:string) {
    if(name.length > 0 && name.length < 100){
        return true;
    }
    throw new Error('El nombre no puede ser vacio o muy largo');
})

//Validate email
ClienteSchema.path("email").validate(function(valor: string) {
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)){ //Expresion regular para validar el email, esto indica que el email tiene que tener un @ y un . algo
        return true;
    }
    throw new Error('El mail es incorrecto, ejmplo mail correcto: algo@algo.com');
})

//Validate numero de tarjeta
ClienteSchema.path("cards.number").validate(function (valor: string) {
    if(/^(\d{4} ){3}\d{4}$|^\d{16}$/.test(valor)){ //permite 1111 2222 3333 4444 o 1111222233334444
        return true;
    }
    throw new Error('El numero de tarjeta es incorrecto, ejemplo de numero de tarjeta correcto: 1111 2222 3333 4444 o 1111222233334444');
})

//Validate cvv
ClienteSchema.path("cards.cvv").validate(function (valor: string) {
    if(/^\d{3}$/.test(valor)){ //permite 3 caracteres
        return true;
    }
    throw new Error('El cvv es incorrecto, ha de tener 3 caracteres');
})

//Validate expiracion
ClienteSchema.path("cards.expirity").validate(function (valor: string) {
    if(/^(0[1-9]|1[0-2])\/(20)\d{2}$/.test(valor)){ //permite el formato MM/YYYY
        //si el mes y anyo son anteriores a la fecha actual no es valido
        const mes = parseInt(valor.split("/")[0]);
        const anyo = parseInt(valor.split("/")[1]);
        const fechaActual = new Date();
        const anyoActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth(); //el mes puede ser el mismo
        if(anyo > anyoActual || (anyo == anyoActual && mes >= mesActual)){
            return true;
        }
    } 
    throw new Error('La fecha de expiracion es incorrecta, ejemplo de fecha de expiracion correcta: 01/2025, ademas ha de ser posterior a la fecha actual');
})

//Validate money
ClienteSchema.path("cards.money").validate(function (money: number) {
    if(money >= 0){ //no se permite dinero negativo
        return true;
    }
    throw new Error('El dinero no puede ser negativo');
})

//Validate travels, no puede tener mas de un viaje activo (status != Realizado)
ClienteSchema.path("travels").validate(function (travels: Array<ViajeModelType>) {
    let count = 0;
    for(let i = 0; i < travels.length; i++){
        if(travels[i].status != "Realizado"){
            count++;
        }
    }
    if(count > 1){
        throw new Error('No puede tener mas de un viaje activo');
    }
    return true;
})

//Middleware hook cuando se elimina un cliente se borra su viaje y sus dependencias
ClienteSchema.post("findOneAndDelete", async function(cliente: ClienteModelType){
    if(cliente){
        await ViajeModel.deleteMany({client: cliente._id}); //Borramos sus viajes
        await ConductorModel.updateMany({travels: cliente._id}, {$pull: {travels: cliente._id}}); //Borramos los viajes de los conductores
    }
})

export type ClienteModelType = mongoose.Document & InferSchemaType<typeof ClienteSchema>;

export const ClienteModel = mongoose.model<ClienteModelType>("Cliente", ClienteSchema)