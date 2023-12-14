import { ClienteModel, ClienteModelType } from "../db/cliente.ts";
import { ConductorModel, ConductorModelType } from "../db/conductor.ts";
import { ViajeModel, ViajeModelType } from "../db/viaje.ts";

export const Query = {
    clientes: async (): Promise<Array<ClienteModelType>> => {
        return await ClienteModel.find().exec();
    },

    conductores: async (): Promise<Array<ConductorModelType>> => {
        return await ConductorModel.find().exec();
    },

    viajes: async (): Promise<Array<ViajeModelType>> => {
        return await ViajeModel.find().exec();
    }
}