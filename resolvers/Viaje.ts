import { GraphQLError } from "graphql";
import { ViajeModelType } from "../db/viaje.ts";
import { ClienteModel, ClienteModelType } from "../db/cliente.ts";
import { ConductorModel, ConductorModelType } from "../db/conductor.ts";

export const Viaje = {
    client: async (parent: ViajeModelType): Promise<ClienteModelType> => { //Cliente de un viaje
        if(parent.client){
            const cliente = await ClienteModel.findById(parent.client).exec();
            if(cliente){
                return cliente;
            }
        }
        throw new GraphQLError("No existe cliente para este viaje");
    },

    driver: async (parent: ViajeModelType): Promise<ConductorModelType> => { //Conductor de un viaje
        if(parent.driver){
            const conductor = await ConductorModel.findById(parent.driver).exec();
            if(conductor){
                return conductor;
            }
        }
        throw new GraphQLError("No existe conductor para este viaje");
    }
}


