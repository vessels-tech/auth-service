import { Mapper } from './Mapper';
import { Consent } from '~/model/consent';


class ConsentMap implements Mapper<Consent> {
  toDomain(raw: any): Consent {
    throw new Error("Method not implemented.");
  }

  toDTO(t: Consent) {
    throw new Error("Method not implemented.");
  }

  toModel(t: Consent) {
    throw new Error("Method not implemented.");
  }

}

// We can't have static methods on interfaces!
// What a pain...
const consentMapInstance = new ConsentMap()
export default consentMapInstance
