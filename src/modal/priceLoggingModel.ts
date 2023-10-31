import { model, Schema, Model, Document, Types } from 'mongoose';

interface IWorkflow extends Document {
    _id: Types.ObjectId;
    key: String;
    userAccountId: string;
    workflow: object;
    enabled: boolean;
    createdAt: object;
    updatedAt: object;
    state: boolean;
}

const PriceLoggingSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    ceth: { type: String },
    cusdc: {type: String},
    createDate:{type: Date},
});


export const PriceLogging: Model<any> = model('price_logging', PriceLoggingSchema);