import { Mapper } from './Mapper';
import { Scope } from '~/domain/types';
import { ExternalScope } from '../scopes';


class ScopeMapper implements Mapper<Array<Scope>> {
  toDomain(externalScopes: ExternalScope[], consentId: string): Array<Scope> {
    const scopes: Scope[] = externalScopes.map(element =>
      element.actions.map(action => ({
        consentId,
        accountId: element.accountId,
        action
      })
      )
    ).flat()

    return scopes
  }

  toDTO(t: Array<Scope>) {
    throw new Error("Method not implemented.");
  }

  toModel(t: Array<Scope>) {
    throw new Error("Method not implemented.");
  }

}

// We can't have static methods on interfaces!
// What a pain...
const scopeMapperInstance = new ScopeMapper()
export default scopeMapperInstance
