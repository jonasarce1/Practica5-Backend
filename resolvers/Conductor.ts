import { ConductorModelType } from "../db/conductor.ts";
import { ViajeModel, ViajeModelType } from "../db/viaje.ts";

export const Conductor = {
    travels: async (parent: ConductorModelType): Promise<Array<ViajeModelType>> => { //Viajes de un conductor
        return await ViajeModel.find({driver: parent._id}).exec();
        //return await ViajeModel.find({driver: parent._id}).populate("client").exec(); //opcion para ver el cliente
    }
};