export const typeDefs = `#graphql
    type Tarjeta {
        number: String!,
        cvv: String!,
        expirity: String!,
        money: Int!
    }

    type Cliente {
        id: ID!,
        name: String!,
        email: String!,
        cards: [Tarjeta!]!,
        travels: [Viaje!]!
    }

    type Conductor {
        id: ID!,
        name: String!,
        email: String!,
        username: String!,
        travels: [Viaje!]!
    }

    enum Status {
        Preparado,
        EnProgreso,
        Realizado
    }

    type Viaje {
        id: ID!,
        client: Cliente!,
        driver: Conductor!,
        money: Int!,
        distance: Int!,
        date: String!,
        status: Status!
    }

    type Query {
        clientes: [Cliente!]!
        conductores: [Conductor!]!
        viajes: [Viaje!]!
    }

    type Mutation {
        addCliente(name: String!, email: String!): Cliente!
        addConductor(name: String!, email: String!, username: String!): Conductor!
        addTarjeta(id: ID!, number: String!, cvv: String!, expirity: String!, money: Int!): Cliente!
        addViaje(client: ID!, driver: ID!, money: Int!, distance: Int!, date: String!, status: Status!): Viaje!
        deleteCliente(id: ID!): Cliente!
        deleteConductor(id: ID!): Conductor!
        deleteTarjeta(numero: String!, cvv: String!, expirity: String!): Tarjeta!
        terminarViaje(id: ID!): String!
    }

`;