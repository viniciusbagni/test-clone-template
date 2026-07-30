import { faker } from '@faker-js/faker'

export function randomEmail(): string {
  return faker.internet.email()
}

export function randomPassword(): string {
  return faker.internet.password()
}

// demais funções de geração de dados podem ser adicionadas aqui, conforme necessário.