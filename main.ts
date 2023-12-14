import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Cliente } from "./resolvers/Cliente.ts";
import { Conductor } from "./resolvers/Conductor.ts";
import { Viaje } from "./resolvers/Viaje.ts";

import { typeDefs } from "./gql/schema.ts";
import mongoose from "mongoose";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  throw new Error("Please provide a MongoDB connection string");
}

// Connect to MongoDB
await mongoose.connect(MONGO_URL);

console.info("🚀 Connected to MongoDB");

const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Cliente,
      Conductor,
      Viaje
    },
});

const { url } = await startStandaloneServer(server);
console.info(`🚀 Server ready at ${url}`);