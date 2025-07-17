export abstract class DomainException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// todo: créer un ApplicationException avec les exceptions de tout les usecases et schedulers
