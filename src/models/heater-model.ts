import mongooseToJson from '@meanie/mongoose-to-json';
import { Mongoose, Model, Schema, Document } from 'mongoose';
import ServiceContainer from '../services/service-container';
import Attributes from './model';

/**
 * Heater attributes interface.
 */
export interface HeaterAttributes extends Attributes {
  type: string;
  article: string;
  width?: number;
  height?: number;
  thickness?: number;
  depth?: number;
  diameter?: number;
  noise: {
    n10: number;
    n5: number;
    n2: number;
    n1: number;
  }
}

/**
 * Heater instance interface.
 */
export interface HeaterInstance extends HeaterAttributes, Document {}

/**
 * Creates the heater model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<HeaterInstance> {
    return mongoose.model('Heater', createProjectSchema(), 'heaters');
}

/**
 * Creates the heater schema.
 * 
 * @returns Heater schema
 */
function createProjectSchema() {
  const schema = new Schema({
    type: {
      type: Schema.Types.String,
      required: [true, 'Type is required']
    },
    article: {
      type: Schema.Types.String,
      required: [true, 'Article is required']
    },
    width: {
      type: Schema.Types.Number,
      default: null
    },
    height: {
      type: Schema.Types.Number,
      default: null
    },
    thickness: {
      type: Schema.Types.Number,
      default: null
    },
    depth: {
      type: Schema.Types.Number,
      default: null
    },
    diameter: {
      type: Schema.Types.Number,
      default: null
    },
    noise: {
      type: createNoiseSubSchema(),
      required: [true, 'Noise is required']
    }
  });

  schema.plugin(mongooseToJson);

  return schema;
}

function createNoiseSubSchema() {
  const schema = new Schema({
    n10: {
      type: Schema.Types.Number,
      required: [true, '10m noise is required']
    },
    n5: {
      type: Schema.Types.Number,
      required: [true, '5m noise is required']
    },
    n2: {
      type: Schema.Types.Number,
      required: [true, '2m noise is required']
    },
    n1: {
      type: Schema.Types.Number,
      required: [true, '1m noise is required']
    }
  }, {
    _id: false,
    id: false
  });
  return schema;
}
