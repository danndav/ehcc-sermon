import { Logger } from '@nestjs/common';

export function LogService(): ClassDecorator {
  return (target: any) => {
    const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
      (prop) => typeof target.prototype[prop] === 'function' && prop !== 'constructor'
    );

    methodNames.forEach((methodName) => {
      const originalMethod = target.prototype[methodName];

      target.prototype[methodName] = async function (...args: any[]) {
        Logger.log(
          `Calling method: ${methodName} with arguments: ${JSON.stringify(args)}`,
          `${target.name}::${methodName}`
        );

        const result = await originalMethod.apply(this, args);

        Logger.log(`Method: ${methodName} returned: ${JSON.stringify(result)}`, `${target.name}::${methodName}`);

        return result;
      };
    });
  };
}
