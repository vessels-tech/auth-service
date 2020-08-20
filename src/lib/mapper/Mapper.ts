export interface Mapper<T> {
  toDomain(...raw: any): T
  toDTO(t: T): any
  toModel(t: T): any
}



// export abstract class Mapper<T> {
//   public toDomain(raw: any): T;

// }
