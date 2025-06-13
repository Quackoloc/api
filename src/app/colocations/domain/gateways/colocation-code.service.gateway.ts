export abstract class ColocationCodeServiceGateway {
  abstract createCode(): Promise<string>;

  abstract checkIfBelongsToColocation(code: string): Promise<number>;
}
