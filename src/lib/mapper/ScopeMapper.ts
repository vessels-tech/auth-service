import { Mapper } from './Mapper';
import { Scope } from '~/domain/types';
import { ExternalScope } from '~/interface/types';


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

  toDTO(scopes: Array<Scope>): Array<ExternalScope> {
    // Dictionary of accountId to ExternalScope object
    const scopeDictionary = {}

    scopes.forEach((scope: Scope): void => {
      const accountId: string = scope.accountId

      if (!(accountId in scopeDictionary)) {
        // @ts-ignore
        scopeDictionary[accountId] = {
          accountId,
          actions: []
        }
      }
      // @ts-ignore
      scopeDictionary[accountId].actions.push(scope.action)
    })

    return Object.values(scopeDictionary)
  }

  toModel(t: Array<Scope>) {
    throw new Error("Method not implemented.");
  }

}

// We can't have static methods on interfaces!
// What a pain...
const scopeMapperInstance = new ScopeMapper()
export default scopeMapperInstance
