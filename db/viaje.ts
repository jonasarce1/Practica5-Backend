import mongoose, {Schema, InferSchemaType} from "mongoose";
import { Status } from "../types.ts";
import { ClienteModel } from "./cliente.ts";
import { ConductorModel } from "./conductor.ts";

const ViajeSchema = new Schema({
    client: {type: Schema.Types.ObjectId, required: true, ref: "Cliente"},
    driver: {type: Schema.Types.ObjectId, required: true, ref: "Conductor"},
    money: {type: Number, required: true}, //Minimo 5 euros
    distance: {type: Number, required: true}, //En km, minimo en 0,01km
    date: {type: Date, required: true},
    status: {type: String, required: true, enum: Object.values(Status)}
})

//Validate money
ViajeSchema.path("money").validate(function (money: number) {
    if(money < 5){ //Minimo 5 euros
        throw new Error('El dinero minimo es 5 euros');
    }
})

//Validate distance
ViajeSchema.path("distance").validate(function (distance: number) {
    if(distance < 0.01){ //Minimo 0,01km
        throw new Error('La distancia minima es 0,01km');
    }
})

//Validate date
ViajeSchema.path("date").validate(function (date: Date) {
    if(date.getTime() > Date.now()){ //La fecha no puede ser anterior a la actual
        return true;
    }
    throw new Error('La fecha no puede ser anterior a la actual');
})

//Validate status
ViajeSchema.path("status").validate(function (status: Status) {
    if(Object.values(Status).includes(status)){ //El estado tiene que ser uno de los estados definidos
        return true;
    }
    throw new Error('El estado no es valido');
})

//Middleware hook, un viaje solo se puede crear si tanto conductor como cliente no tienen viajes activos y ademas el cliente tiene que tener algo de dinero en su cuenta
ViajeSchema.pre("save", async function(next) {
    const viaje = this as ViajeModelType;
    const cliente = await ClienteModel.findById(viaje.client);
    const conductor = await ConductorModel.findById(viaje.driver);
    if(cliente && conductor){
        const viajesCliente = cliente.travels;
        const viajesConductor = conductor.travels;
        //Si el cliente no tiene viajes o bien dentro de sus viajes no hay ninguno con un estado que no sea realizado
        if(!viajesCliente.some(viaje => viaje.status !== Status.Realizado)){
            console.log("holo")
            //Si el conductor no tiene viajes o bien dentro de sus viajes no hay ninguno con un estado que no sea realizado
            if(!viajesConductor.some(viaje => viaje.status !== Status.Realizado)){
                //Si el cliente tiene dinero en su cuenta
                if(cliente.cards.length > 0 && cliente.cards.some(card => card.money > 0)){
                    //si el dinero del cliente es mayor o igual al dinero del viaje
                    if(cliente.cards.some(card => card.money >= viaje.money)){
                        //Restamos el dinero al cliente
                        const card = cliente.cards.find(card => card.money >= viaje.money);
                        if(card){
                            console.log("holo");
                            card.money -= viaje.money;
                            await cliente.save();
                            next();
                        }
                    }else{
                        throw new Error('El cliente no tiene dinero suficiente en su cuenta');
                    }
                }else{
                    throw new Error('El cliente no tiene dinero en su cuenta');
                }
            }else{
                throw new Error('El conductor tiene un viaje activo');
            }
        }else{
            throw new Error('El cliente tiene un viaje activo');
        }
    }
    throw new Error('No existe cliente o conductor');
})

export type ViajeModelType = mongoose.Document & InferSchemaType<typeof ViajeSchema>;

export const ViajeModel = mongoose.model<ViajeModelType>("Viaje", ViajeSchema)