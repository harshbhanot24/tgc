import { Mongo } from 'meteor/mongo';
export const Vault = new Mongo.Collection("vault");
 Vault.insert({
   serialNo: "HouseTJ",
   vaultNo: "HouseTJ",
   shelfNo: "HouseTJ",
   boxNo: "HouseTJ",
   weight:1212.11,
   left: 3232,
   assignTo: [],
   membership: "gold",
   createdAt: new Date()
 });
