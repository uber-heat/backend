import mongooseToJson from '@meanie/mongoose-to-json';
import { Document, Model, Mongoose, Schema } from 'mongoose';
import ServiceContainer from '../services/service-container';
import Attributes from './model';

/**
 * User attributes interface.
 */
export interface UserAttributes extends Attributes {
    email: string;
    surname: string;
    firstname: string;
    company: string;
    password: string;
    banned: boolean;
    refreshToken?: string;
}

/**
 * User instance interface.
 */
export interface UserInstance extends UserAttributes, Document {}

/**
 * Creates the user model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<UserInstance> {
    return mongoose.model('User', createUserSchema(container), 'users');
}

/**
 * Creates the user schema.
 * 
 * @param container Services container
 * @returns User schema
 */
function createUserSchema(container: ServiceContainer) {
    const schema = new Schema({
        email: {
            type: Schema.Types.String,
            required: [true, 'Email is required'],
            unique: true,
            validate: {
                validator: (email: string) => /\S+@\S+\.\S+/.test(email),
                message: 'Invalid email'
            }
        },
        surname: {
            type: Schema.Types.String,
            required: [true, 'Surname is required']
        },
        firstname: {
            type: Schema.Types.String,
            required: [true, 'Surname is required']
        },
        company: {
            type: Schema.Types.String,
            required: [true, 'Company is required']
        },
        password: {
            type: Schema.Types.String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password is too small'],
            select: false
        },
        banned: {
            type: Schema.Types.Boolean,
            default: false
        },
        refreshToken: {
            type: Schema.Types.String,
            default: null,
            select: false
        }
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

    // Password hash validation
    schema.pre('save', async function(this: UserInstance, next) {
        if (this.isNew && this.password != null) { // Validates the password only if filled
            try {
                this.password = await container.crypto.hash(this.password, parseInt(process.env.HASH_SALT, 10));
                return next();
            } catch (err) {
                return next(err);
            }
        }
    });

    schema.plugin(mongooseToJson);

    return schema;
}
