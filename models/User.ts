import mongoose, { model, models, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser { 
    email: string;
    password: string;
    role: 'user' | 'admin';
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        const salt = bcryptjs.genSaltSync(10);
        this.password = bcryptjs.hashSync(this.password, salt);
    }
    next();
});

const User = models?.User || model<IUser>('User', userSchema);

export default User;