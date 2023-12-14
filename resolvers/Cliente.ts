import { ClienteModelType } from "../db/cliente.ts";
import { ViajeModel, ViajeModelType } from "../db/viaje.ts";

export const Cliente = {
    travels: async (parent: ClienteModelType): Promise<Array<ViajeModelType>> => { //Viajes de un cliente
        return await ViajeModel.find({client: parent._id}).exec();
        //return await ViajeModel.find({client: parent._id}).populate("driver").exec(); //opcion para ver el conductor
    }
};