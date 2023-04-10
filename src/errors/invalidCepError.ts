import { ApplicationError } from '@/protocols';

export function invalidCepError(): ApplicationError {
  return {
    name: 'InvalidCepError',
    message: 'Your cep has a invalid format!',
  };
}