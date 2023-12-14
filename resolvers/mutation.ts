import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { ClienteModel, ClienteModelType } from "../db/cliente.ts";
import { ConductorModel, ConductorModelType } from "../db/conductor.ts";
import { ViajeModel, ViajeModelType } from "../db/viaje.ts";

export const Mutation = {
    addCliente: async (_:unknown, args: {name: string, email: string}): Promise<ClienteModelType> => {
        try{
            const cliente = {
                name: args.name,
                email: args.email
            };
            
            const newCliente = await ClienteModel.create(cliente);

            /*if(!newCliente){ //Creo que no haria falta debido a las validaciones
                throw new GraphQLError("No se pudo crear el cliente");
            }*/

            return newCliente;
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    addConductor: async (_:unknown, args: {name: string, email: string, username: string}): Promise<ConductorModelType> => {
        try{
            const conductor = {
                name: args.name,
                email: args.email,
                username: args.username
            };
            const newConductor = await ConductorModel.create(conductor);
            return newConductor;
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    addTarjeta: async (_:unknown, args: {id: string, number: string, cvv: string, expirity: string, money: number}): Promise<ClienteModelType> => {
        try{
            const cliente = await ClienteModel.findById(args.id).exec();
            
            if(!cliente){
                throw new GraphQLError("No existe el cliente");
            }

            const card = {
                number: args.number,
                cvv: args.cvv,
                expirity: args.expirity,
                money: args.money
            };

            cliente.cards.push(card);
            await cliente.save();

            return cliente;
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    addViaje: async (_:unknown, args: {client: string, driver: string, money: number, distance: number, date: Date, status: string}): Promise<ViajeModelType> => {
        try{
            const viaje = {
                client: args.client,
                driver: args.driver,
                money: args.money,
                distance: args.distance,
                date: args.date,
                status: args.status
            }

            const newViaje = await ViajeModel.create(viaje);

            return newViaje;
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    deleteCliente: async (_:unknown, args: {id: string}): Promise<string> => {
        try{
            const clienteBorrado = await ClienteModel.findByIdAndDelete(args.id).exec();

            if(!clienteBorrado){
                throw new GraphQLError("No existe el cliente");
            }

            return "Cliente borrado correctamente";
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    deleteConductor: async (_:unknown, args: {id: string}): Promise<string> => {
        try{
            const conductorBorrado = await ConductorModel.findByIdAndDelete(args.id).exec();

            if(!conductorBorrado){
                throw new GraphQLError("No existe el conductor");
            }

            return "Conductor borrado correctamente";
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    deleteTarjeta: async (_:unknown, args: {numero: string, cvv: string, expirity: string}): Promise<string> => {
        try{
            //Encontramos todos los clientes que tengan la tarjeta
            const clientes = await ClienteModel.find({cards: {$elemMatch: {number: args.numero, cvv: args.cvv, expirity: args.expirity}}}).exec();

            if(clientes.length == 0){
                throw new GraphQLError("No existe la tarjeta");
            }

            //Eliminamos la tarjeta de todos los clientes
            clientes.forEach(async cliente => {
                //con filter eliminamos las tarjetas que coincidan con los datos de la tarjeta a eliminar
                cliente.cards = cliente.cards.filter(card => !(card.number == args.numero && card.cvv == args.cvv && card.expirity == args.expirity));
                await cliente.save();
            });

            return "Tarjeta borrada correctamente";
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    },

    terminarViaje: async (_:unknown, args: {id: string}): Promise<string> => {
        try{
            //cambiamos el status del viaje a Realizado
            const viaje = await ViajeModel.findByIdAndUpdate(args.id, {status: "Realizado", date: new Date()}, {new: true, runValidators: true}).exec();

            if(!viaje){
                throw new GraphQLError("No existe el viaje");
            }

            return "Viaje terminado correctamente";
        }catch(error){
            if (error instanceof mongoose.Error.ValidationError) {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                throw new GraphQLError(validationErrors.join(", "));
            } else {
                throw new GraphQLError(error.message);
            }
        }
    }
}