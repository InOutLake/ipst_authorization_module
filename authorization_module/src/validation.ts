import Joi from 'joi';
import { User } from './models';

const userSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  surname: Joi.string().min(2).max(255).required(),
  middlename: Joi.string().max(255),
  email: Joi.string().email({ minDomainSegments: 2 }).max(255).required(),
  username: Joi.string().min(2).max(15),
  password: Joi.string()
    .pattern(
      new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
      )
    )
    .required(),
  is_confirmed: Joi.boolean().default(false)
});

const passwordSchema = Joi.string()
  .pattern(
    new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
  )
  .required();

const validateUser = (user: User): void => {
  const { error } = userSchema.validate(user);
  if (error) {
    throw new Error('User validation failed');
  }
};

const validatePassword = (password: string): void => {
  const { error } = passwordSchema.validate(password);
  if (error) {
    throw new Error('Password validation failed');
  }
};

export { userSchema, validateUser, validatePassword, passwordSchema };
