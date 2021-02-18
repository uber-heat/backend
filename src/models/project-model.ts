import mongooseToJson from '@meanie/mongoose-to-json';
import { Mongoose, Model, Schema, Document } from 'mongoose';
import ServiceContainer from '../services/service-container';
import { HeaterInstance } from './heater-model';
import Attributes from './model';
import { UserInstance } from './user-model';

/**
 * Project attributes interface.
 */
export interface ProjectAttributes extends Attributes {
  owner: UserInstance;
  name: string;
  description: string;
  results: HeaterInstance[];
}

/**
 * Project instance interface.
 */
export interface ProjectInstance extends ProjectAttributes, Document {}

/**
 * Creates the project model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<ProjectInstance> {
    return mongoose.model('Project', createProjectSchema(), 'projects');
}

/**
 * Creates the project schema.
 * 
 * @returns Project schema
 */
function createProjectSchema() {
  const schema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    },
    name: {
      type: Schema.Types.String,
      required: [true, 'Name is required']
    },
    description: {
      type: Schema.Types.String,
      default: null
    },
    results: {
      type: Schema.Types.ObjectId,
      ref: 'Heater',
      default: []
    }
  });

  schema.plugin(mongooseToJson);

  return schema;
}
