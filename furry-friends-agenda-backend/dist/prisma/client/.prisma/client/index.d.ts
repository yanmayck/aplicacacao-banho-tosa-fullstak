
/**
 * Client
**/

import * as runtime from '@prisma/client/runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Pet
 * 
 */
export type Pet = $Result.DefaultSelection<Prisma.$PetPayload>
/**
 * Model Groomer
 * 
 */
export type Groomer = $Result.DefaultSelection<Prisma.$GroomerPayload>
/**
 * Model Package
 * 
 */
export type Package = $Result.DefaultSelection<Prisma.$PackagePayload>
/**
 * Model ServicePackage
 * 
 */
export type ServicePackage = $Result.DefaultSelection<Prisma.$ServicePackagePayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model AppointmentService
 * 
 */
export type AppointmentService = $Result.DefaultSelection<Prisma.$AppointmentServicePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const AppointmentStatus: {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type AppointmentStatus = $Enums.AppointmentStatus

export const AppointmentStatus: typeof $Enums.AppointmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pet`: Exposes CRUD operations for the **Pet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pets
    * const pets = await prisma.pet.findMany()
    * ```
    */
  get pet(): Prisma.PetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groomer`: Exposes CRUD operations for the **Groomer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Groomers
    * const groomers = await prisma.groomer.findMany()
    * ```
    */
  get groomer(): Prisma.GroomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.package`: Exposes CRUD operations for the **Package** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Packages
    * const packages = await prisma.package.findMany()
    * ```
    */
  get package(): Prisma.PackageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.servicePackage`: Exposes CRUD operations for the **ServicePackage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServicePackages
    * const servicePackages = await prisma.servicePackage.findMany()
    * ```
    */
  get servicePackage(): Prisma.ServicePackageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointmentService`: Exposes CRUD operations for the **AppointmentService** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppointmentServices
    * const appointmentServices = await prisma.appointmentService.findMany()
    * ```
    */
  get appointmentService(): Prisma.AppointmentServiceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Client: 'Client',
    Pet: 'Pet',
    Groomer: 'Groomer',
    Package: 'Package',
    ServicePackage: 'ServicePackage',
    Appointment: 'Appointment',
    AppointmentService: 'AppointmentService'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "client" | "pet" | "groomer" | "package" | "servicePackage" | "appointment" | "appointmentService"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Pet: {
        payload: Prisma.$PetPayload<ExtArgs>
        fields: Prisma.PetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          findFirst: {
            args: Prisma.PetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          findMany: {
            args: Prisma.PetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>[]
          }
          create: {
            args: Prisma.PetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          createMany: {
            args: Prisma.PetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>[]
          }
          delete: {
            args: Prisma.PetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          update: {
            args: Prisma.PetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          deleteMany: {
            args: Prisma.PetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>[]
          }
          upsert: {
            args: Prisma.PetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PetPayload>
          }
          aggregate: {
            args: Prisma.PetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePet>
          }
          groupBy: {
            args: Prisma.PetGroupByArgs<ExtArgs>
            result: $Utils.Optional<PetGroupByOutputType>[]
          }
          count: {
            args: Prisma.PetCountArgs<ExtArgs>
            result: $Utils.Optional<PetCountAggregateOutputType> | number
          }
        }
      }
      Groomer: {
        payload: Prisma.$GroomerPayload<ExtArgs>
        fields: Prisma.GroomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          findFirst: {
            args: Prisma.GroomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          findMany: {
            args: Prisma.GroomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>[]
          }
          create: {
            args: Prisma.GroomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          createMany: {
            args: Prisma.GroomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>[]
          }
          delete: {
            args: Prisma.GroomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          update: {
            args: Prisma.GroomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          deleteMany: {
            args: Prisma.GroomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>[]
          }
          upsert: {
            args: Prisma.GroomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroomerPayload>
          }
          aggregate: {
            args: Prisma.GroomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroomer>
          }
          groupBy: {
            args: Prisma.GroomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroomerCountArgs<ExtArgs>
            result: $Utils.Optional<GroomerCountAggregateOutputType> | number
          }
        }
      }
      Package: {
        payload: Prisma.$PackagePayload<ExtArgs>
        fields: Prisma.PackageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PackageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PackageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findFirst: {
            args: Prisma.PackageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PackageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findMany: {
            args: Prisma.PackageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          create: {
            args: Prisma.PackageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          createMany: {
            args: Prisma.PackageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PackageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          delete: {
            args: Prisma.PackageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          update: {
            args: Prisma.PackageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          deleteMany: {
            args: Prisma.PackageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PackageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PackageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          upsert: {
            args: Prisma.PackageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          aggregate: {
            args: Prisma.PackageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePackage>
          }
          groupBy: {
            args: Prisma.PackageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PackageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PackageCountArgs<ExtArgs>
            result: $Utils.Optional<PackageCountAggregateOutputType> | number
          }
        }
      }
      ServicePackage: {
        payload: Prisma.$ServicePackagePayload<ExtArgs>
        fields: Prisma.ServicePackageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServicePackageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServicePackageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          findFirst: {
            args: Prisma.ServicePackageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServicePackageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          findMany: {
            args: Prisma.ServicePackageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>[]
          }
          create: {
            args: Prisma.ServicePackageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          createMany: {
            args: Prisma.ServicePackageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServicePackageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>[]
          }
          delete: {
            args: Prisma.ServicePackageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          update: {
            args: Prisma.ServicePackageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          deleteMany: {
            args: Prisma.ServicePackageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServicePackageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServicePackageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>[]
          }
          upsert: {
            args: Prisma.ServicePackageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePackagePayload>
          }
          aggregate: {
            args: Prisma.ServicePackageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServicePackage>
          }
          groupBy: {
            args: Prisma.ServicePackageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServicePackageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServicePackageCountArgs<ExtArgs>
            result: $Utils.Optional<ServicePackageCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      AppointmentService: {
        payload: Prisma.$AppointmentServicePayload<ExtArgs>
        fields: Prisma.AppointmentServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          findFirst: {
            args: Prisma.AppointmentServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          findMany: {
            args: Prisma.AppointmentServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>[]
          }
          create: {
            args: Prisma.AppointmentServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          createMany: {
            args: Prisma.AppointmentServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentServiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>[]
          }
          delete: {
            args: Prisma.AppointmentServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          update: {
            args: Prisma.AppointmentServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          deleteMany: {
            args: Prisma.AppointmentServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentServiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>[]
          }
          upsert: {
            args: Prisma.AppointmentServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentServicePayload>
          }
          aggregate: {
            args: Prisma.AppointmentServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointmentService>
          }
          groupBy: {
            args: Prisma.AppointmentServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentServiceCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentServiceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    client?: ClientOmit
    pet?: PetOmit
    groomer?: GroomerOmit
    package?: PackageOmit
    servicePackage?: ServicePackageOmit
    appointment?: AppointmentOmit
    appointmentService?: AppointmentServiceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    pets: number
    appointments: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pets?: boolean | ClientCountOutputTypeCountPetsArgs
    appointments?: boolean | ClientCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountPetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PetWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type PetCountOutputType
   */

  export type PetCountOutputType = {
    appointments: number
  }

  export type PetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | PetCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * PetCountOutputType without action
   */
  export type PetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PetCountOutputType
     */
    select?: PetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PetCountOutputType without action
   */
  export type PetCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type GroomerCountOutputType
   */

  export type GroomerCountOutputType = {
    appointments: number
  }

  export type GroomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | GroomerCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * GroomerCountOutputType without action
   */
  export type GroomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroomerCountOutputType
     */
    select?: GroomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GroomerCountOutputType without action
   */
  export type GroomerCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type ServicePackageCountOutputType
   */

  export type ServicePackageCountOutputType = {
    appointmentServices: number
  }

  export type ServicePackageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointmentServices?: boolean | ServicePackageCountOutputTypeCountAppointmentServicesArgs
  }

  // Custom InputTypes
  /**
   * ServicePackageCountOutputType without action
   */
  export type ServicePackageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackageCountOutputType
     */
    select?: ServicePackageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServicePackageCountOutputType without action
   */
  export type ServicePackageCountOutputTypeCountAppointmentServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentServiceWhereInput
  }


  /**
   * Count Type AppointmentCountOutputType
   */

  export type AppointmentCountOutputType = {
    appointmentServices: number
  }

  export type AppointmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointmentServices?: boolean | AppointmentCountOutputTypeCountAppointmentServicesArgs
  }

  // Custom InputTypes
  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentCountOutputType
     */
    select?: AppointmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeCountAppointmentServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentServiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | User$clientArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | User$clientArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends User$clientArgs<ExtArgs> = {}>(args?: Subset<T, User$clientArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.client
   */
  export type User$clientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    address: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date
    updatedAt: Date
    userId: string | null
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    pets?: boolean | Client$petsArgs<ExtArgs>
    appointments?: boolean | Client$appointmentsArgs<ExtArgs>
    user?: boolean | Client$userArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Client$userArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Client$userArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "address" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pets?: boolean | Client$petsArgs<ExtArgs>
    appointments?: boolean | Client$appointmentsArgs<ExtArgs>
    user?: boolean | Client$userArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Client$userArgs<ExtArgs>
  }
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Client$userArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      pets: Prisma.$PetPayload<ExtArgs>[]
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      email: string | null
      address: string | null
      createdAt: Date
      updatedAt: Date
      userId: string | null
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pets<T extends Client$petsArgs<ExtArgs> = {}>(args?: Subset<T, Client$petsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appointments<T extends Client$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Client$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends Client$userArgs<ExtArgs> = {}>(args?: Subset<T, Client$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly name: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly address: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
    readonly userId: FieldRef<"Client", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.pets
   */
  export type Client$petsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    where?: PetWhereInput
    orderBy?: PetOrderByWithRelationInput | PetOrderByWithRelationInput[]
    cursor?: PetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PetScalarFieldEnum | PetScalarFieldEnum[]
  }

  /**
   * Client.appointments
   */
  export type Client$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Client.user
   */
  export type Client$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Pet
   */

  export type AggregatePet = {
    _count: PetCountAggregateOutputType | null
    _min: PetMinAggregateOutputType | null
    _max: PetMaxAggregateOutputType | null
  }

  export type PetMinAggregateOutputType = {
    id: string | null
    name: string | null
    species: string | null
    breed: string | null
    birthDate: string | null
    clientId: string | null
    observations: string | null
    foodType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    species: string | null
    breed: string | null
    birthDate: string | null
    clientId: string | null
    observations: string | null
    foodType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PetCountAggregateOutputType = {
    id: number
    name: number
    species: number
    breed: number
    birthDate: number
    clientId: number
    observations: number
    foodType: number
    lastTickMedicine: number
    rabiesVaccine: number
    vaccineHistory: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PetMinAggregateInputType = {
    id?: true
    name?: true
    species?: true
    breed?: true
    birthDate?: true
    clientId?: true
    observations?: true
    foodType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PetMaxAggregateInputType = {
    id?: true
    name?: true
    species?: true
    breed?: true
    birthDate?: true
    clientId?: true
    observations?: true
    foodType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PetCountAggregateInputType = {
    id?: true
    name?: true
    species?: true
    breed?: true
    birthDate?: true
    clientId?: true
    observations?: true
    foodType?: true
    lastTickMedicine?: true
    rabiesVaccine?: true
    vaccineHistory?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pet to aggregate.
     */
    where?: PetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pets to fetch.
     */
    orderBy?: PetOrderByWithRelationInput | PetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pets
    **/
    _count?: true | PetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PetMaxAggregateInputType
  }

  export type GetPetAggregateType<T extends PetAggregateArgs> = {
        [P in keyof T & keyof AggregatePet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePet[P]>
      : GetScalarType<T[P], AggregatePet[P]>
  }




  export type PetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PetWhereInput
    orderBy?: PetOrderByWithAggregationInput | PetOrderByWithAggregationInput[]
    by: PetScalarFieldEnum[] | PetScalarFieldEnum
    having?: PetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PetCountAggregateInputType | true
    _min?: PetMinAggregateInputType
    _max?: PetMaxAggregateInputType
  }

  export type PetGroupByOutputType = {
    id: string
    name: string
    species: string
    breed: string | null
    birthDate: string | null
    clientId: string
    observations: string | null
    foodType: string | null
    lastTickMedicine: JsonValue | null
    rabiesVaccine: JsonValue | null
    vaccineHistory: JsonValue[]
    createdAt: Date
    updatedAt: Date
    _count: PetCountAggregateOutputType | null
    _min: PetMinAggregateOutputType | null
    _max: PetMaxAggregateOutputType | null
  }

  type GetPetGroupByPayload<T extends PetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PetGroupByOutputType[P]>
            : GetScalarType<T[P], PetGroupByOutputType[P]>
        }
      >
    >


  export type PetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    species?: boolean
    breed?: boolean
    birthDate?: boolean
    clientId?: boolean
    observations?: boolean
    foodType?: boolean
    lastTickMedicine?: boolean
    rabiesVaccine?: boolean
    vaccineHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    appointments?: boolean | Pet$appointmentsArgs<ExtArgs>
    _count?: boolean | PetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pet"]>

  export type PetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    species?: boolean
    breed?: boolean
    birthDate?: boolean
    clientId?: boolean
    observations?: boolean
    foodType?: boolean
    lastTickMedicine?: boolean
    rabiesVaccine?: boolean
    vaccineHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pet"]>

  export type PetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    species?: boolean
    breed?: boolean
    birthDate?: boolean
    clientId?: boolean
    observations?: boolean
    foodType?: boolean
    lastTickMedicine?: boolean
    rabiesVaccine?: boolean
    vaccineHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pet"]>

  export type PetSelectScalar = {
    id?: boolean
    name?: boolean
    species?: boolean
    breed?: boolean
    birthDate?: boolean
    clientId?: boolean
    observations?: boolean
    foodType?: boolean
    lastTickMedicine?: boolean
    rabiesVaccine?: boolean
    vaccineHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "species" | "breed" | "birthDate" | "clientId" | "observations" | "foodType" | "lastTickMedicine" | "rabiesVaccine" | "vaccineHistory" | "createdAt" | "updatedAt", ExtArgs["result"]["pet"]>
  export type PetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    appointments?: boolean | Pet$appointmentsArgs<ExtArgs>
    _count?: boolean | PetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type PetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $PetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pet"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      species: string
      breed: string | null
      birthDate: string | null
      clientId: string
      observations: string | null
      foodType: string | null
      lastTickMedicine: Prisma.JsonValue | null
      rabiesVaccine: Prisma.JsonValue | null
      vaccineHistory: Prisma.JsonValue[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pet"]>
    composites: {}
  }

  type PetGetPayload<S extends boolean | null | undefined | PetDefaultArgs> = $Result.GetResult<Prisma.$PetPayload, S>

  type PetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PetCountAggregateInputType | true
    }

  export interface PetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pet'], meta: { name: 'Pet' } }
    /**
     * Find zero or one Pet that matches the filter.
     * @param {PetFindUniqueArgs} args - Arguments to find a Pet
     * @example
     * // Get one Pet
     * const pet = await prisma.pet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PetFindUniqueArgs>(args: SelectSubset<T, PetFindUniqueArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PetFindUniqueOrThrowArgs} args - Arguments to find a Pet
     * @example
     * // Get one Pet
     * const pet = await prisma.pet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PetFindUniqueOrThrowArgs>(args: SelectSubset<T, PetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetFindFirstArgs} args - Arguments to find a Pet
     * @example
     * // Get one Pet
     * const pet = await prisma.pet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PetFindFirstArgs>(args?: SelectSubset<T, PetFindFirstArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetFindFirstOrThrowArgs} args - Arguments to find a Pet
     * @example
     * // Get one Pet
     * const pet = await prisma.pet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PetFindFirstOrThrowArgs>(args?: SelectSubset<T, PetFindFirstOrThrowArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pets
     * const pets = await prisma.pet.findMany()
     * 
     * // Get first 10 Pets
     * const pets = await prisma.pet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const petWithIdOnly = await prisma.pet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PetFindManyArgs>(args?: SelectSubset<T, PetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pet.
     * @param {PetCreateArgs} args - Arguments to create a Pet.
     * @example
     * // Create one Pet
     * const Pet = await prisma.pet.create({
     *   data: {
     *     // ... data to create a Pet
     *   }
     * })
     * 
     */
    create<T extends PetCreateArgs>(args: SelectSubset<T, PetCreateArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pets.
     * @param {PetCreateManyArgs} args - Arguments to create many Pets.
     * @example
     * // Create many Pets
     * const pet = await prisma.pet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PetCreateManyArgs>(args?: SelectSubset<T, PetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pets and returns the data saved in the database.
     * @param {PetCreateManyAndReturnArgs} args - Arguments to create many Pets.
     * @example
     * // Create many Pets
     * const pet = await prisma.pet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pets and only return the `id`
     * const petWithIdOnly = await prisma.pet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PetCreateManyAndReturnArgs>(args?: SelectSubset<T, PetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pet.
     * @param {PetDeleteArgs} args - Arguments to delete one Pet.
     * @example
     * // Delete one Pet
     * const Pet = await prisma.pet.delete({
     *   where: {
     *     // ... filter to delete one Pet
     *   }
     * })
     * 
     */
    delete<T extends PetDeleteArgs>(args: SelectSubset<T, PetDeleteArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pet.
     * @param {PetUpdateArgs} args - Arguments to update one Pet.
     * @example
     * // Update one Pet
     * const pet = await prisma.pet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PetUpdateArgs>(args: SelectSubset<T, PetUpdateArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pets.
     * @param {PetDeleteManyArgs} args - Arguments to filter Pets to delete.
     * @example
     * // Delete a few Pets
     * const { count } = await prisma.pet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PetDeleteManyArgs>(args?: SelectSubset<T, PetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pets
     * const pet = await prisma.pet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PetUpdateManyArgs>(args: SelectSubset<T, PetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pets and returns the data updated in the database.
     * @param {PetUpdateManyAndReturnArgs} args - Arguments to update many Pets.
     * @example
     * // Update many Pets
     * const pet = await prisma.pet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pets and only return the `id`
     * const petWithIdOnly = await prisma.pet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PetUpdateManyAndReturnArgs>(args: SelectSubset<T, PetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pet.
     * @param {PetUpsertArgs} args - Arguments to update or create a Pet.
     * @example
     * // Update or create a Pet
     * const pet = await prisma.pet.upsert({
     *   create: {
     *     // ... data to create a Pet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pet we want to update
     *   }
     * })
     */
    upsert<T extends PetUpsertArgs>(args: SelectSubset<T, PetUpsertArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetCountArgs} args - Arguments to filter Pets to count.
     * @example
     * // Count the number of Pets
     * const count = await prisma.pet.count({
     *   where: {
     *     // ... the filter for the Pets we want to count
     *   }
     * })
    **/
    count<T extends PetCountArgs>(
      args?: Subset<T, PetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PetAggregateArgs>(args: Subset<T, PetAggregateArgs>): Prisma.PrismaPromise<GetPetAggregateType<T>>

    /**
     * Group by Pet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PetGroupByArgs['orderBy'] }
        : { orderBy?: PetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pet model
   */
  readonly fields: PetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    appointments<T extends Pet$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Pet$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pet model
   */
  interface PetFieldRefs {
    readonly id: FieldRef<"Pet", 'String'>
    readonly name: FieldRef<"Pet", 'String'>
    readonly species: FieldRef<"Pet", 'String'>
    readonly breed: FieldRef<"Pet", 'String'>
    readonly birthDate: FieldRef<"Pet", 'String'>
    readonly clientId: FieldRef<"Pet", 'String'>
    readonly observations: FieldRef<"Pet", 'String'>
    readonly foodType: FieldRef<"Pet", 'String'>
    readonly lastTickMedicine: FieldRef<"Pet", 'Json'>
    readonly rabiesVaccine: FieldRef<"Pet", 'Json'>
    readonly vaccineHistory: FieldRef<"Pet", 'Json[]'>
    readonly createdAt: FieldRef<"Pet", 'DateTime'>
    readonly updatedAt: FieldRef<"Pet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pet findUnique
   */
  export type PetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter, which Pet to fetch.
     */
    where: PetWhereUniqueInput
  }

  /**
   * Pet findUniqueOrThrow
   */
  export type PetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter, which Pet to fetch.
     */
    where: PetWhereUniqueInput
  }

  /**
   * Pet findFirst
   */
  export type PetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter, which Pet to fetch.
     */
    where?: PetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pets to fetch.
     */
    orderBy?: PetOrderByWithRelationInput | PetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pets.
     */
    cursor?: PetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pets.
     */
    distinct?: PetScalarFieldEnum | PetScalarFieldEnum[]
  }

  /**
   * Pet findFirstOrThrow
   */
  export type PetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter, which Pet to fetch.
     */
    where?: PetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pets to fetch.
     */
    orderBy?: PetOrderByWithRelationInput | PetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pets.
     */
    cursor?: PetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pets.
     */
    distinct?: PetScalarFieldEnum | PetScalarFieldEnum[]
  }

  /**
   * Pet findMany
   */
  export type PetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter, which Pets to fetch.
     */
    where?: PetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pets to fetch.
     */
    orderBy?: PetOrderByWithRelationInput | PetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pets.
     */
    cursor?: PetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pets.
     */
    skip?: number
    distinct?: PetScalarFieldEnum | PetScalarFieldEnum[]
  }

  /**
   * Pet create
   */
  export type PetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * The data needed to create a Pet.
     */
    data: XOR<PetCreateInput, PetUncheckedCreateInput>
  }

  /**
   * Pet createMany
   */
  export type PetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pets.
     */
    data: PetCreateManyInput | PetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pet createManyAndReturn
   */
  export type PetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * The data used to create many Pets.
     */
    data: PetCreateManyInput | PetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pet update
   */
  export type PetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * The data needed to update a Pet.
     */
    data: XOR<PetUpdateInput, PetUncheckedUpdateInput>
    /**
     * Choose, which Pet to update.
     */
    where: PetWhereUniqueInput
  }

  /**
   * Pet updateMany
   */
  export type PetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pets.
     */
    data: XOR<PetUpdateManyMutationInput, PetUncheckedUpdateManyInput>
    /**
     * Filter which Pets to update
     */
    where?: PetWhereInput
    /**
     * Limit how many Pets to update.
     */
    limit?: number
  }

  /**
   * Pet updateManyAndReturn
   */
  export type PetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * The data used to update Pets.
     */
    data: XOR<PetUpdateManyMutationInput, PetUncheckedUpdateManyInput>
    /**
     * Filter which Pets to update
     */
    where?: PetWhereInput
    /**
     * Limit how many Pets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pet upsert
   */
  export type PetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * The filter to search for the Pet to update in case it exists.
     */
    where: PetWhereUniqueInput
    /**
     * In case the Pet found by the `where` argument doesn't exist, create a new Pet with this data.
     */
    create: XOR<PetCreateInput, PetUncheckedCreateInput>
    /**
     * In case the Pet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PetUpdateInput, PetUncheckedUpdateInput>
  }

  /**
   * Pet delete
   */
  export type PetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
    /**
     * Filter which Pet to delete.
     */
    where: PetWhereUniqueInput
  }

  /**
   * Pet deleteMany
   */
  export type PetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pets to delete
     */
    where?: PetWhereInput
    /**
     * Limit how many Pets to delete.
     */
    limit?: number
  }

  /**
   * Pet.appointments
   */
  export type Pet$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Pet without action
   */
  export type PetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pet
     */
    select?: PetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pet
     */
    omit?: PetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PetInclude<ExtArgs> | null
  }


  /**
   * Model Groomer
   */

  export type AggregateGroomer = {
    _count: GroomerCountAggregateOutputType | null
    _avg: GroomerAvgAggregateOutputType | null
    _sum: GroomerSumAggregateOutputType | null
    _min: GroomerMinAggregateOutputType | null
    _max: GroomerMaxAggregateOutputType | null
  }

  export type GroomerAvgAggregateOutputType = {
    commissionPercentage: number | null
  }

  export type GroomerSumAggregateOutputType = {
    commissionPercentage: number | null
  }

  export type GroomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    status: string | null
    commissionPercentage: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    status: string | null
    commissionPercentage: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroomerCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    specialties: number
    status: number
    commissionPercentage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GroomerAvgAggregateInputType = {
    commissionPercentage?: true
  }

  export type GroomerSumAggregateInputType = {
    commissionPercentage?: true
  }

  export type GroomerMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    status?: true
    commissionPercentage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroomerMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    status?: true
    commissionPercentage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroomerCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    specialties?: true
    status?: true
    commissionPercentage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GroomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Groomer to aggregate.
     */
    where?: GroomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groomers to fetch.
     */
    orderBy?: GroomerOrderByWithRelationInput | GroomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Groomers
    **/
    _count?: true | GroomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroomerMaxAggregateInputType
  }

  export type GetGroomerAggregateType<T extends GroomerAggregateArgs> = {
        [P in keyof T & keyof AggregateGroomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroomer[P]>
      : GetScalarType<T[P], AggregateGroomer[P]>
  }




  export type GroomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroomerWhereInput
    orderBy?: GroomerOrderByWithAggregationInput | GroomerOrderByWithAggregationInput[]
    by: GroomerScalarFieldEnum[] | GroomerScalarFieldEnum
    having?: GroomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroomerCountAggregateInputType | true
    _avg?: GroomerAvgAggregateInputType
    _sum?: GroomerSumAggregateInputType
    _min?: GroomerMinAggregateInputType
    _max?: GroomerMaxAggregateInputType
  }

  export type GroomerGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    email: string | null
    specialties: string[]
    status: string
    commissionPercentage: number
    createdAt: Date
    updatedAt: Date
    _count: GroomerCountAggregateOutputType | null
    _avg: GroomerAvgAggregateOutputType | null
    _sum: GroomerSumAggregateOutputType | null
    _min: GroomerMinAggregateOutputType | null
    _max: GroomerMaxAggregateOutputType | null
  }

  type GetGroomerGroupByPayload<T extends GroomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroomerGroupByOutputType[P]>
            : GetScalarType<T[P], GroomerGroupByOutputType[P]>
        }
      >
    >


  export type GroomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    specialties?: boolean
    status?: boolean
    commissionPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointments?: boolean | Groomer$appointmentsArgs<ExtArgs>
    _count?: boolean | GroomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groomer"]>

  export type GroomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    specialties?: boolean
    status?: boolean
    commissionPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groomer"]>

  export type GroomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    specialties?: boolean
    status?: boolean
    commissionPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groomer"]>

  export type GroomerSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    specialties?: boolean
    status?: boolean
    commissionPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GroomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "specialties" | "status" | "commissionPercentage" | "createdAt" | "updatedAt", ExtArgs["result"]["groomer"]>
  export type GroomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Groomer$appointmentsArgs<ExtArgs>
    _count?: boolean | GroomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GroomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GroomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GroomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Groomer"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      email: string | null
      specialties: string[]
      status: string
      commissionPercentage: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["groomer"]>
    composites: {}
  }

  type GroomerGetPayload<S extends boolean | null | undefined | GroomerDefaultArgs> = $Result.GetResult<Prisma.$GroomerPayload, S>

  type GroomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroomerCountAggregateInputType | true
    }

  export interface GroomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Groomer'], meta: { name: 'Groomer' } }
    /**
     * Find zero or one Groomer that matches the filter.
     * @param {GroomerFindUniqueArgs} args - Arguments to find a Groomer
     * @example
     * // Get one Groomer
     * const groomer = await prisma.groomer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroomerFindUniqueArgs>(args: SelectSubset<T, GroomerFindUniqueArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Groomer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroomerFindUniqueOrThrowArgs} args - Arguments to find a Groomer
     * @example
     * // Get one Groomer
     * const groomer = await prisma.groomer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroomerFindUniqueOrThrowArgs>(args: SelectSubset<T, GroomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Groomer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerFindFirstArgs} args - Arguments to find a Groomer
     * @example
     * // Get one Groomer
     * const groomer = await prisma.groomer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroomerFindFirstArgs>(args?: SelectSubset<T, GroomerFindFirstArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Groomer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerFindFirstOrThrowArgs} args - Arguments to find a Groomer
     * @example
     * // Get one Groomer
     * const groomer = await prisma.groomer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroomerFindFirstOrThrowArgs>(args?: SelectSubset<T, GroomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Groomers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Groomers
     * const groomers = await prisma.groomer.findMany()
     * 
     * // Get first 10 Groomers
     * const groomers = await prisma.groomer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groomerWithIdOnly = await prisma.groomer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroomerFindManyArgs>(args?: SelectSubset<T, GroomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Groomer.
     * @param {GroomerCreateArgs} args - Arguments to create a Groomer.
     * @example
     * // Create one Groomer
     * const Groomer = await prisma.groomer.create({
     *   data: {
     *     // ... data to create a Groomer
     *   }
     * })
     * 
     */
    create<T extends GroomerCreateArgs>(args: SelectSubset<T, GroomerCreateArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Groomers.
     * @param {GroomerCreateManyArgs} args - Arguments to create many Groomers.
     * @example
     * // Create many Groomers
     * const groomer = await prisma.groomer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroomerCreateManyArgs>(args?: SelectSubset<T, GroomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Groomers and returns the data saved in the database.
     * @param {GroomerCreateManyAndReturnArgs} args - Arguments to create many Groomers.
     * @example
     * // Create many Groomers
     * const groomer = await prisma.groomer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Groomers and only return the `id`
     * const groomerWithIdOnly = await prisma.groomer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroomerCreateManyAndReturnArgs>(args?: SelectSubset<T, GroomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Groomer.
     * @param {GroomerDeleteArgs} args - Arguments to delete one Groomer.
     * @example
     * // Delete one Groomer
     * const Groomer = await prisma.groomer.delete({
     *   where: {
     *     // ... filter to delete one Groomer
     *   }
     * })
     * 
     */
    delete<T extends GroomerDeleteArgs>(args: SelectSubset<T, GroomerDeleteArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Groomer.
     * @param {GroomerUpdateArgs} args - Arguments to update one Groomer.
     * @example
     * // Update one Groomer
     * const groomer = await prisma.groomer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroomerUpdateArgs>(args: SelectSubset<T, GroomerUpdateArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Groomers.
     * @param {GroomerDeleteManyArgs} args - Arguments to filter Groomers to delete.
     * @example
     * // Delete a few Groomers
     * const { count } = await prisma.groomer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroomerDeleteManyArgs>(args?: SelectSubset<T, GroomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Groomers
     * const groomer = await prisma.groomer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroomerUpdateManyArgs>(args: SelectSubset<T, GroomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groomers and returns the data updated in the database.
     * @param {GroomerUpdateManyAndReturnArgs} args - Arguments to update many Groomers.
     * @example
     * // Update many Groomers
     * const groomer = await prisma.groomer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Groomers and only return the `id`
     * const groomerWithIdOnly = await prisma.groomer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GroomerUpdateManyAndReturnArgs>(args: SelectSubset<T, GroomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Groomer.
     * @param {GroomerUpsertArgs} args - Arguments to update or create a Groomer.
     * @example
     * // Update or create a Groomer
     * const groomer = await prisma.groomer.upsert({
     *   create: {
     *     // ... data to create a Groomer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Groomer we want to update
     *   }
     * })
     */
    upsert<T extends GroomerUpsertArgs>(args: SelectSubset<T, GroomerUpsertArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Groomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerCountArgs} args - Arguments to filter Groomers to count.
     * @example
     * // Count the number of Groomers
     * const count = await prisma.groomer.count({
     *   where: {
     *     // ... the filter for the Groomers we want to count
     *   }
     * })
    **/
    count<T extends GroomerCountArgs>(
      args?: Subset<T, GroomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Groomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroomerAggregateArgs>(args: Subset<T, GroomerAggregateArgs>): Prisma.PrismaPromise<GetGroomerAggregateType<T>>

    /**
     * Group by Groomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GroomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroomerGroupByArgs['orderBy'] }
        : { orderBy?: GroomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GroomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Groomer model
   */
  readonly fields: GroomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Groomer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Groomer$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Groomer$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Groomer model
   */
  interface GroomerFieldRefs {
    readonly id: FieldRef<"Groomer", 'String'>
    readonly name: FieldRef<"Groomer", 'String'>
    readonly phone: FieldRef<"Groomer", 'String'>
    readonly email: FieldRef<"Groomer", 'String'>
    readonly specialties: FieldRef<"Groomer", 'String[]'>
    readonly status: FieldRef<"Groomer", 'String'>
    readonly commissionPercentage: FieldRef<"Groomer", 'Float'>
    readonly createdAt: FieldRef<"Groomer", 'DateTime'>
    readonly updatedAt: FieldRef<"Groomer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Groomer findUnique
   */
  export type GroomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter, which Groomer to fetch.
     */
    where: GroomerWhereUniqueInput
  }

  /**
   * Groomer findUniqueOrThrow
   */
  export type GroomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter, which Groomer to fetch.
     */
    where: GroomerWhereUniqueInput
  }

  /**
   * Groomer findFirst
   */
  export type GroomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter, which Groomer to fetch.
     */
    where?: GroomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groomers to fetch.
     */
    orderBy?: GroomerOrderByWithRelationInput | GroomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Groomers.
     */
    cursor?: GroomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Groomers.
     */
    distinct?: GroomerScalarFieldEnum | GroomerScalarFieldEnum[]
  }

  /**
   * Groomer findFirstOrThrow
   */
  export type GroomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter, which Groomer to fetch.
     */
    where?: GroomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groomers to fetch.
     */
    orderBy?: GroomerOrderByWithRelationInput | GroomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Groomers.
     */
    cursor?: GroomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Groomers.
     */
    distinct?: GroomerScalarFieldEnum | GroomerScalarFieldEnum[]
  }

  /**
   * Groomer findMany
   */
  export type GroomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter, which Groomers to fetch.
     */
    where?: GroomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groomers to fetch.
     */
    orderBy?: GroomerOrderByWithRelationInput | GroomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Groomers.
     */
    cursor?: GroomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groomers.
     */
    skip?: number
    distinct?: GroomerScalarFieldEnum | GroomerScalarFieldEnum[]
  }

  /**
   * Groomer create
   */
  export type GroomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Groomer.
     */
    data: XOR<GroomerCreateInput, GroomerUncheckedCreateInput>
  }

  /**
   * Groomer createMany
   */
  export type GroomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Groomers.
     */
    data: GroomerCreateManyInput | GroomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Groomer createManyAndReturn
   */
  export type GroomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * The data used to create many Groomers.
     */
    data: GroomerCreateManyInput | GroomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Groomer update
   */
  export type GroomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Groomer.
     */
    data: XOR<GroomerUpdateInput, GroomerUncheckedUpdateInput>
    /**
     * Choose, which Groomer to update.
     */
    where: GroomerWhereUniqueInput
  }

  /**
   * Groomer updateMany
   */
  export type GroomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Groomers.
     */
    data: XOR<GroomerUpdateManyMutationInput, GroomerUncheckedUpdateManyInput>
    /**
     * Filter which Groomers to update
     */
    where?: GroomerWhereInput
    /**
     * Limit how many Groomers to update.
     */
    limit?: number
  }

  /**
   * Groomer updateManyAndReturn
   */
  export type GroomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * The data used to update Groomers.
     */
    data: XOR<GroomerUpdateManyMutationInput, GroomerUncheckedUpdateManyInput>
    /**
     * Filter which Groomers to update
     */
    where?: GroomerWhereInput
    /**
     * Limit how many Groomers to update.
     */
    limit?: number
  }

  /**
   * Groomer upsert
   */
  export type GroomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Groomer to update in case it exists.
     */
    where: GroomerWhereUniqueInput
    /**
     * In case the Groomer found by the `where` argument doesn't exist, create a new Groomer with this data.
     */
    create: XOR<GroomerCreateInput, GroomerUncheckedCreateInput>
    /**
     * In case the Groomer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroomerUpdateInput, GroomerUncheckedUpdateInput>
  }

  /**
   * Groomer delete
   */
  export type GroomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    /**
     * Filter which Groomer to delete.
     */
    where: GroomerWhereUniqueInput
  }

  /**
   * Groomer deleteMany
   */
  export type GroomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Groomers to delete
     */
    where?: GroomerWhereInput
    /**
     * Limit how many Groomers to delete.
     */
    limit?: number
  }

  /**
   * Groomer.appointments
   */
  export type Groomer$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Groomer without action
   */
  export type GroomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
  }


  /**
   * Model Package
   */

  export type AggregatePackage = {
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  export type PackageAvgAggregateOutputType = {
    includesBaths: number | null
    basePrice: number | null
    pickupPrice: number | null
  }

  export type PackageSumAggregateOutputType = {
    includesBaths: number | null
    basePrice: number | null
    pickupPrice: number | null
  }

  export type PackageMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    includesBaths: number | null
    includesGrooming: boolean | null
    includesHydration: boolean | null
    basePrice: number | null
    pickupPrice: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    includesBaths: number | null
    includesGrooming: boolean | null
    includesHydration: boolean | null
    basePrice: number | null
    pickupPrice: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageCountAggregateOutputType = {
    id: number
    name: number
    description: number
    includesBaths: number
    includesGrooming: number
    includesHydration: number
    basePrice: number
    pickupPrice: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PackageAvgAggregateInputType = {
    includesBaths?: true
    basePrice?: true
    pickupPrice?: true
  }

  export type PackageSumAggregateInputType = {
    includesBaths?: true
    basePrice?: true
    pickupPrice?: true
  }

  export type PackageMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    includesBaths?: true
    includesGrooming?: true
    includesHydration?: true
    basePrice?: true
    pickupPrice?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    includesBaths?: true
    includesGrooming?: true
    includesHydration?: true
    basePrice?: true
    pickupPrice?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    includesBaths?: true
    includesGrooming?: true
    includesHydration?: true
    basePrice?: true
    pickupPrice?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PackageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Package to aggregate.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Packages
    **/
    _count?: true | PackageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PackageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PackageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PackageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PackageMaxAggregateInputType
  }

  export type GetPackageAggregateType<T extends PackageAggregateArgs> = {
        [P in keyof T & keyof AggregatePackage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePackage[P]>
      : GetScalarType<T[P], AggregatePackage[P]>
  }




  export type PackageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageWhereInput
    orderBy?: PackageOrderByWithAggregationInput | PackageOrderByWithAggregationInput[]
    by: PackageScalarFieldEnum[] | PackageScalarFieldEnum
    having?: PackageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PackageCountAggregateInputType | true
    _avg?: PackageAvgAggregateInputType
    _sum?: PackageSumAggregateInputType
    _min?: PackageMinAggregateInputType
    _max?: PackageMaxAggregateInputType
  }

  export type PackageGroupByOutputType = {
    id: string
    name: string
    description: string | null
    includesBaths: number
    includesGrooming: boolean
    includesHydration: boolean
    basePrice: number
    pickupPrice: number
    createdAt: Date
    updatedAt: Date
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  type GetPackageGroupByPayload<T extends PackageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PackageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PackageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PackageGroupByOutputType[P]>
            : GetScalarType<T[P], PackageGroupByOutputType[P]>
        }
      >
    >


  export type PackageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    includesBaths?: boolean
    includesGrooming?: boolean
    includesHydration?: boolean
    basePrice?: boolean
    pickupPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["package"]>

  export type PackageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    includesBaths?: boolean
    includesGrooming?: boolean
    includesHydration?: boolean
    basePrice?: boolean
    pickupPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["package"]>

  export type PackageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    includesBaths?: boolean
    includesGrooming?: boolean
    includesHydration?: boolean
    basePrice?: boolean
    pickupPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["package"]>

  export type PackageSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    includesBaths?: boolean
    includesGrooming?: boolean
    includesHydration?: boolean
    basePrice?: boolean
    pickupPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PackageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "includesBaths" | "includesGrooming" | "includesHydration" | "basePrice" | "pickupPrice" | "createdAt" | "updatedAt", ExtArgs["result"]["package"]>

  export type $PackagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Package"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      includesBaths: number
      includesGrooming: boolean
      includesHydration: boolean
      basePrice: number
      pickupPrice: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["package"]>
    composites: {}
  }

  type PackageGetPayload<S extends boolean | null | undefined | PackageDefaultArgs> = $Result.GetResult<Prisma.$PackagePayload, S>

  type PackageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PackageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PackageCountAggregateInputType | true
    }

  export interface PackageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Package'], meta: { name: 'Package' } }
    /**
     * Find zero or one Package that matches the filter.
     * @param {PackageFindUniqueArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PackageFindUniqueArgs>(args: SelectSubset<T, PackageFindUniqueArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Package that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PackageFindUniqueOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PackageFindUniqueOrThrowArgs>(args: SelectSubset<T, PackageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Package that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PackageFindFirstArgs>(args?: SelectSubset<T, PackageFindFirstArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Package that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PackageFindFirstOrThrowArgs>(args?: SelectSubset<T, PackageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Packages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Packages
     * const packages = await prisma.package.findMany()
     * 
     * // Get first 10 Packages
     * const packages = await prisma.package.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const packageWithIdOnly = await prisma.package.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PackageFindManyArgs>(args?: SelectSubset<T, PackageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Package.
     * @param {PackageCreateArgs} args - Arguments to create a Package.
     * @example
     * // Create one Package
     * const Package = await prisma.package.create({
     *   data: {
     *     // ... data to create a Package
     *   }
     * })
     * 
     */
    create<T extends PackageCreateArgs>(args: SelectSubset<T, PackageCreateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Packages.
     * @param {PackageCreateManyArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PackageCreateManyArgs>(args?: SelectSubset<T, PackageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Packages and returns the data saved in the database.
     * @param {PackageCreateManyAndReturnArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Packages and only return the `id`
     * const packageWithIdOnly = await prisma.package.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PackageCreateManyAndReturnArgs>(args?: SelectSubset<T, PackageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Package.
     * @param {PackageDeleteArgs} args - Arguments to delete one Package.
     * @example
     * // Delete one Package
     * const Package = await prisma.package.delete({
     *   where: {
     *     // ... filter to delete one Package
     *   }
     * })
     * 
     */
    delete<T extends PackageDeleteArgs>(args: SelectSubset<T, PackageDeleteArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Package.
     * @param {PackageUpdateArgs} args - Arguments to update one Package.
     * @example
     * // Update one Package
     * const package = await prisma.package.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PackageUpdateArgs>(args: SelectSubset<T, PackageUpdateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Packages.
     * @param {PackageDeleteManyArgs} args - Arguments to filter Packages to delete.
     * @example
     * // Delete a few Packages
     * const { count } = await prisma.package.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PackageDeleteManyArgs>(args?: SelectSubset<T, PackageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Packages
     * const package = await prisma.package.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PackageUpdateManyArgs>(args: SelectSubset<T, PackageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Packages and returns the data updated in the database.
     * @param {PackageUpdateManyAndReturnArgs} args - Arguments to update many Packages.
     * @example
     * // Update many Packages
     * const package = await prisma.package.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Packages and only return the `id`
     * const packageWithIdOnly = await prisma.package.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PackageUpdateManyAndReturnArgs>(args: SelectSubset<T, PackageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Package.
     * @param {PackageUpsertArgs} args - Arguments to update or create a Package.
     * @example
     * // Update or create a Package
     * const package = await prisma.package.upsert({
     *   create: {
     *     // ... data to create a Package
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Package we want to update
     *   }
     * })
     */
    upsert<T extends PackageUpsertArgs>(args: SelectSubset<T, PackageUpsertArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageCountArgs} args - Arguments to filter Packages to count.
     * @example
     * // Count the number of Packages
     * const count = await prisma.package.count({
     *   where: {
     *     // ... the filter for the Packages we want to count
     *   }
     * })
    **/
    count<T extends PackageCountArgs>(
      args?: Subset<T, PackageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PackageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PackageAggregateArgs>(args: Subset<T, PackageAggregateArgs>): Prisma.PrismaPromise<GetPackageAggregateType<T>>

    /**
     * Group by Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PackageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PackageGroupByArgs['orderBy'] }
        : { orderBy?: PackageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PackageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Package model
   */
  readonly fields: PackageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Package.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PackageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Package model
   */
  interface PackageFieldRefs {
    readonly id: FieldRef<"Package", 'String'>
    readonly name: FieldRef<"Package", 'String'>
    readonly description: FieldRef<"Package", 'String'>
    readonly includesBaths: FieldRef<"Package", 'Int'>
    readonly includesGrooming: FieldRef<"Package", 'Boolean'>
    readonly includesHydration: FieldRef<"Package", 'Boolean'>
    readonly basePrice: FieldRef<"Package", 'Float'>
    readonly pickupPrice: FieldRef<"Package", 'Float'>
    readonly createdAt: FieldRef<"Package", 'DateTime'>
    readonly updatedAt: FieldRef<"Package", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Package findUnique
   */
  export type PackageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findUniqueOrThrow
   */
  export type PackageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findFirst
   */
  export type PackageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findFirstOrThrow
   */
  export type PackageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findMany
   */
  export type PackageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter, which Packages to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package create
   */
  export type PackageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * The data needed to create a Package.
     */
    data: XOR<PackageCreateInput, PackageUncheckedCreateInput>
  }

  /**
   * Package createMany
   */
  export type PackageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Package createManyAndReturn
   */
  export type PackageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Package update
   */
  export type PackageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * The data needed to update a Package.
     */
    data: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
    /**
     * Choose, which Package to update.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package updateMany
   */
  export type PackageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Packages.
     */
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyInput>
    /**
     * Filter which Packages to update
     */
    where?: PackageWhereInput
    /**
     * Limit how many Packages to update.
     */
    limit?: number
  }

  /**
   * Package updateManyAndReturn
   */
  export type PackageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * The data used to update Packages.
     */
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyInput>
    /**
     * Filter which Packages to update
     */
    where?: PackageWhereInput
    /**
     * Limit how many Packages to update.
     */
    limit?: number
  }

  /**
   * Package upsert
   */
  export type PackageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * The filter to search for the Package to update in case it exists.
     */
    where: PackageWhereUniqueInput
    /**
     * In case the Package found by the `where` argument doesn't exist, create a new Package with this data.
     */
    create: XOR<PackageCreateInput, PackageUncheckedCreateInput>
    /**
     * In case the Package was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
  }

  /**
   * Package delete
   */
  export type PackageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
    /**
     * Filter which Package to delete.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package deleteMany
   */
  export type PackageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Packages to delete
     */
    where?: PackageWhereInput
    /**
     * Limit how many Packages to delete.
     */
    limit?: number
  }

  /**
   * Package without action
   */
  export type PackageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Package
     */
    omit?: PackageOmit<ExtArgs> | null
  }


  /**
   * Model ServicePackage
   */

  export type AggregateServicePackage = {
    _count: ServicePackageCountAggregateOutputType | null
    _avg: ServicePackageAvgAggregateOutputType | null
    _sum: ServicePackageSumAggregateOutputType | null
    _min: ServicePackageMinAggregateOutputType | null
    _max: ServicePackageMaxAggregateOutputType | null
  }

  export type ServicePackageAvgAggregateOutputType = {
    price: number | null
    durationMin: number | null
  }

  export type ServicePackageSumAggregateOutputType = {
    price: number | null
    durationMin: number | null
  }

  export type ServicePackageMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: number | null
    durationMin: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServicePackageMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: number | null
    durationMin: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServicePackageCountAggregateOutputType = {
    id: number
    name: number
    description: number
    price: number
    durationMin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServicePackageAvgAggregateInputType = {
    price?: true
    durationMin?: true
  }

  export type ServicePackageSumAggregateInputType = {
    price?: true
    durationMin?: true
  }

  export type ServicePackageMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    durationMin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServicePackageMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    durationMin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServicePackageCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    durationMin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ServicePackageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServicePackage to aggregate.
     */
    where?: ServicePackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePackages to fetch.
     */
    orderBy?: ServicePackageOrderByWithRelationInput | ServicePackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServicePackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePackages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePackages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServicePackages
    **/
    _count?: true | ServicePackageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServicePackageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServicePackageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServicePackageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServicePackageMaxAggregateInputType
  }

  export type GetServicePackageAggregateType<T extends ServicePackageAggregateArgs> = {
        [P in keyof T & keyof AggregateServicePackage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServicePackage[P]>
      : GetScalarType<T[P], AggregateServicePackage[P]>
  }




  export type ServicePackageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServicePackageWhereInput
    orderBy?: ServicePackageOrderByWithAggregationInput | ServicePackageOrderByWithAggregationInput[]
    by: ServicePackageScalarFieldEnum[] | ServicePackageScalarFieldEnum
    having?: ServicePackageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServicePackageCountAggregateInputType | true
    _avg?: ServicePackageAvgAggregateInputType
    _sum?: ServicePackageSumAggregateInputType
    _min?: ServicePackageMinAggregateInputType
    _max?: ServicePackageMaxAggregateInputType
  }

  export type ServicePackageGroupByOutputType = {
    id: string
    name: string
    description: string | null
    price: number
    durationMin: number
    createdAt: Date
    updatedAt: Date
    _count: ServicePackageCountAggregateOutputType | null
    _avg: ServicePackageAvgAggregateOutputType | null
    _sum: ServicePackageSumAggregateOutputType | null
    _min: ServicePackageMinAggregateOutputType | null
    _max: ServicePackageMaxAggregateOutputType | null
  }

  type GetServicePackageGroupByPayload<T extends ServicePackageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServicePackageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServicePackageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServicePackageGroupByOutputType[P]>
            : GetScalarType<T[P], ServicePackageGroupByOutputType[P]>
        }
      >
    >


  export type ServicePackageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    durationMin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointmentServices?: boolean | ServicePackage$appointmentServicesArgs<ExtArgs>
    _count?: boolean | ServicePackageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servicePackage"]>

  export type ServicePackageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    durationMin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["servicePackage"]>

  export type ServicePackageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    durationMin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["servicePackage"]>

  export type ServicePackageSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    durationMin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServicePackageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "price" | "durationMin" | "createdAt" | "updatedAt", ExtArgs["result"]["servicePackage"]>
  export type ServicePackageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointmentServices?: boolean | ServicePackage$appointmentServicesArgs<ExtArgs>
    _count?: boolean | ServicePackageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServicePackageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ServicePackageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicePackagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServicePackage"
    objects: {
      appointmentServices: Prisma.$AppointmentServicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      price: number
      durationMin: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["servicePackage"]>
    composites: {}
  }

  type ServicePackageGetPayload<S extends boolean | null | undefined | ServicePackageDefaultArgs> = $Result.GetResult<Prisma.$ServicePackagePayload, S>

  type ServicePackageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServicePackageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServicePackageCountAggregateInputType | true
    }

  export interface ServicePackageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServicePackage'], meta: { name: 'ServicePackage' } }
    /**
     * Find zero or one ServicePackage that matches the filter.
     * @param {ServicePackageFindUniqueArgs} args - Arguments to find a ServicePackage
     * @example
     * // Get one ServicePackage
     * const servicePackage = await prisma.servicePackage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServicePackageFindUniqueArgs>(args: SelectSubset<T, ServicePackageFindUniqueArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ServicePackage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServicePackageFindUniqueOrThrowArgs} args - Arguments to find a ServicePackage
     * @example
     * // Get one ServicePackage
     * const servicePackage = await prisma.servicePackage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServicePackageFindUniqueOrThrowArgs>(args: SelectSubset<T, ServicePackageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServicePackage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageFindFirstArgs} args - Arguments to find a ServicePackage
     * @example
     * // Get one ServicePackage
     * const servicePackage = await prisma.servicePackage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServicePackageFindFirstArgs>(args?: SelectSubset<T, ServicePackageFindFirstArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServicePackage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageFindFirstOrThrowArgs} args - Arguments to find a ServicePackage
     * @example
     * // Get one ServicePackage
     * const servicePackage = await prisma.servicePackage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServicePackageFindFirstOrThrowArgs>(args?: SelectSubset<T, ServicePackageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ServicePackages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServicePackages
     * const servicePackages = await prisma.servicePackage.findMany()
     * 
     * // Get first 10 ServicePackages
     * const servicePackages = await prisma.servicePackage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servicePackageWithIdOnly = await prisma.servicePackage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServicePackageFindManyArgs>(args?: SelectSubset<T, ServicePackageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ServicePackage.
     * @param {ServicePackageCreateArgs} args - Arguments to create a ServicePackage.
     * @example
     * // Create one ServicePackage
     * const ServicePackage = await prisma.servicePackage.create({
     *   data: {
     *     // ... data to create a ServicePackage
     *   }
     * })
     * 
     */
    create<T extends ServicePackageCreateArgs>(args: SelectSubset<T, ServicePackageCreateArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ServicePackages.
     * @param {ServicePackageCreateManyArgs} args - Arguments to create many ServicePackages.
     * @example
     * // Create many ServicePackages
     * const servicePackage = await prisma.servicePackage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServicePackageCreateManyArgs>(args?: SelectSubset<T, ServicePackageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServicePackages and returns the data saved in the database.
     * @param {ServicePackageCreateManyAndReturnArgs} args - Arguments to create many ServicePackages.
     * @example
     * // Create many ServicePackages
     * const servicePackage = await prisma.servicePackage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServicePackages and only return the `id`
     * const servicePackageWithIdOnly = await prisma.servicePackage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServicePackageCreateManyAndReturnArgs>(args?: SelectSubset<T, ServicePackageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ServicePackage.
     * @param {ServicePackageDeleteArgs} args - Arguments to delete one ServicePackage.
     * @example
     * // Delete one ServicePackage
     * const ServicePackage = await prisma.servicePackage.delete({
     *   where: {
     *     // ... filter to delete one ServicePackage
     *   }
     * })
     * 
     */
    delete<T extends ServicePackageDeleteArgs>(args: SelectSubset<T, ServicePackageDeleteArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ServicePackage.
     * @param {ServicePackageUpdateArgs} args - Arguments to update one ServicePackage.
     * @example
     * // Update one ServicePackage
     * const servicePackage = await prisma.servicePackage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServicePackageUpdateArgs>(args: SelectSubset<T, ServicePackageUpdateArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ServicePackages.
     * @param {ServicePackageDeleteManyArgs} args - Arguments to filter ServicePackages to delete.
     * @example
     * // Delete a few ServicePackages
     * const { count } = await prisma.servicePackage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServicePackageDeleteManyArgs>(args?: SelectSubset<T, ServicePackageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServicePackages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServicePackages
     * const servicePackage = await prisma.servicePackage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServicePackageUpdateManyArgs>(args: SelectSubset<T, ServicePackageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServicePackages and returns the data updated in the database.
     * @param {ServicePackageUpdateManyAndReturnArgs} args - Arguments to update many ServicePackages.
     * @example
     * // Update many ServicePackages
     * const servicePackage = await prisma.servicePackage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ServicePackages and only return the `id`
     * const servicePackageWithIdOnly = await prisma.servicePackage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServicePackageUpdateManyAndReturnArgs>(args: SelectSubset<T, ServicePackageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ServicePackage.
     * @param {ServicePackageUpsertArgs} args - Arguments to update or create a ServicePackage.
     * @example
     * // Update or create a ServicePackage
     * const servicePackage = await prisma.servicePackage.upsert({
     *   create: {
     *     // ... data to create a ServicePackage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServicePackage we want to update
     *   }
     * })
     */
    upsert<T extends ServicePackageUpsertArgs>(args: SelectSubset<T, ServicePackageUpsertArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ServicePackages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageCountArgs} args - Arguments to filter ServicePackages to count.
     * @example
     * // Count the number of ServicePackages
     * const count = await prisma.servicePackage.count({
     *   where: {
     *     // ... the filter for the ServicePackages we want to count
     *   }
     * })
    **/
    count<T extends ServicePackageCountArgs>(
      args?: Subset<T, ServicePackageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServicePackageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServicePackage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServicePackageAggregateArgs>(args: Subset<T, ServicePackageAggregateArgs>): Prisma.PrismaPromise<GetServicePackageAggregateType<T>>

    /**
     * Group by ServicePackage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePackageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServicePackageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServicePackageGroupByArgs['orderBy'] }
        : { orderBy?: ServicePackageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServicePackageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServicePackageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServicePackage model
   */
  readonly fields: ServicePackageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServicePackage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServicePackageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointmentServices<T extends ServicePackage$appointmentServicesArgs<ExtArgs> = {}>(args?: Subset<T, ServicePackage$appointmentServicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ServicePackage model
   */
  interface ServicePackageFieldRefs {
    readonly id: FieldRef<"ServicePackage", 'String'>
    readonly name: FieldRef<"ServicePackage", 'String'>
    readonly description: FieldRef<"ServicePackage", 'String'>
    readonly price: FieldRef<"ServicePackage", 'Float'>
    readonly durationMin: FieldRef<"ServicePackage", 'Int'>
    readonly createdAt: FieldRef<"ServicePackage", 'DateTime'>
    readonly updatedAt: FieldRef<"ServicePackage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ServicePackage findUnique
   */
  export type ServicePackageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter, which ServicePackage to fetch.
     */
    where: ServicePackageWhereUniqueInput
  }

  /**
   * ServicePackage findUniqueOrThrow
   */
  export type ServicePackageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter, which ServicePackage to fetch.
     */
    where: ServicePackageWhereUniqueInput
  }

  /**
   * ServicePackage findFirst
   */
  export type ServicePackageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter, which ServicePackage to fetch.
     */
    where?: ServicePackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePackages to fetch.
     */
    orderBy?: ServicePackageOrderByWithRelationInput | ServicePackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServicePackages.
     */
    cursor?: ServicePackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePackages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePackages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServicePackages.
     */
    distinct?: ServicePackageScalarFieldEnum | ServicePackageScalarFieldEnum[]
  }

  /**
   * ServicePackage findFirstOrThrow
   */
  export type ServicePackageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter, which ServicePackage to fetch.
     */
    where?: ServicePackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePackages to fetch.
     */
    orderBy?: ServicePackageOrderByWithRelationInput | ServicePackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServicePackages.
     */
    cursor?: ServicePackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePackages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePackages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServicePackages.
     */
    distinct?: ServicePackageScalarFieldEnum | ServicePackageScalarFieldEnum[]
  }

  /**
   * ServicePackage findMany
   */
  export type ServicePackageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter, which ServicePackages to fetch.
     */
    where?: ServicePackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePackages to fetch.
     */
    orderBy?: ServicePackageOrderByWithRelationInput | ServicePackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServicePackages.
     */
    cursor?: ServicePackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePackages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePackages.
     */
    skip?: number
    distinct?: ServicePackageScalarFieldEnum | ServicePackageScalarFieldEnum[]
  }

  /**
   * ServicePackage create
   */
  export type ServicePackageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * The data needed to create a ServicePackage.
     */
    data: XOR<ServicePackageCreateInput, ServicePackageUncheckedCreateInput>
  }

  /**
   * ServicePackage createMany
   */
  export type ServicePackageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServicePackages.
     */
    data: ServicePackageCreateManyInput | ServicePackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServicePackage createManyAndReturn
   */
  export type ServicePackageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * The data used to create many ServicePackages.
     */
    data: ServicePackageCreateManyInput | ServicePackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServicePackage update
   */
  export type ServicePackageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * The data needed to update a ServicePackage.
     */
    data: XOR<ServicePackageUpdateInput, ServicePackageUncheckedUpdateInput>
    /**
     * Choose, which ServicePackage to update.
     */
    where: ServicePackageWhereUniqueInput
  }

  /**
   * ServicePackage updateMany
   */
  export type ServicePackageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServicePackages.
     */
    data: XOR<ServicePackageUpdateManyMutationInput, ServicePackageUncheckedUpdateManyInput>
    /**
     * Filter which ServicePackages to update
     */
    where?: ServicePackageWhereInput
    /**
     * Limit how many ServicePackages to update.
     */
    limit?: number
  }

  /**
   * ServicePackage updateManyAndReturn
   */
  export type ServicePackageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * The data used to update ServicePackages.
     */
    data: XOR<ServicePackageUpdateManyMutationInput, ServicePackageUncheckedUpdateManyInput>
    /**
     * Filter which ServicePackages to update
     */
    where?: ServicePackageWhereInput
    /**
     * Limit how many ServicePackages to update.
     */
    limit?: number
  }

  /**
   * ServicePackage upsert
   */
  export type ServicePackageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * The filter to search for the ServicePackage to update in case it exists.
     */
    where: ServicePackageWhereUniqueInput
    /**
     * In case the ServicePackage found by the `where` argument doesn't exist, create a new ServicePackage with this data.
     */
    create: XOR<ServicePackageCreateInput, ServicePackageUncheckedCreateInput>
    /**
     * In case the ServicePackage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServicePackageUpdateInput, ServicePackageUncheckedUpdateInput>
  }

  /**
   * ServicePackage delete
   */
  export type ServicePackageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
    /**
     * Filter which ServicePackage to delete.
     */
    where: ServicePackageWhereUniqueInput
  }

  /**
   * ServicePackage deleteMany
   */
  export type ServicePackageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServicePackages to delete
     */
    where?: ServicePackageWhereInput
    /**
     * Limit how many ServicePackages to delete.
     */
    limit?: number
  }

  /**
   * ServicePackage.appointmentServices
   */
  export type ServicePackage$appointmentServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    where?: AppointmentServiceWhereInput
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    cursor?: AppointmentServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentServiceScalarFieldEnum | AppointmentServiceScalarFieldEnum[]
  }

  /**
   * ServicePackage without action
   */
  export type ServicePackageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePackage
     */
    select?: ServicePackageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServicePackage
     */
    omit?: ServicePackageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicePackageInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentAvgAggregateOutputType = {
    totalPrice: number | null
  }

  export type AppointmentSumAggregateOutputType = {
    totalPrice: number | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    dateTime: Date | null
    status: $Enums.AppointmentStatus | null
    notes: string | null
    totalPrice: number | null
    clientId: string | null
    petId: string | null
    groomerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    dateTime: Date | null
    status: $Enums.AppointmentStatus | null
    notes: string | null
    totalPrice: number | null
    clientId: string | null
    petId: string | null
    groomerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    dateTime: number
    status: number
    notes: number
    totalPrice: number
    clientId: number
    petId: number
    groomerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentAvgAggregateInputType = {
    totalPrice?: true
  }

  export type AppointmentSumAggregateInputType = {
    totalPrice?: true
  }

  export type AppointmentMinAggregateInputType = {
    id?: true
    dateTime?: true
    status?: true
    notes?: true
    totalPrice?: true
    clientId?: true
    petId?: true
    groomerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    dateTime?: true
    status?: true
    notes?: true
    totalPrice?: true
    clientId?: true
    petId?: true
    groomerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    dateTime?: true
    status?: true
    notes?: true
    totalPrice?: true
    clientId?: true
    petId?: true
    groomerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _avg?: AppointmentAvgAggregateInputType
    _sum?: AppointmentSumAggregateInputType
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    dateTime: Date
    status: $Enums.AppointmentStatus
    notes: string | null
    totalPrice: number
    clientId: string
    petId: string
    groomerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dateTime?: boolean
    status?: boolean
    notes?: boolean
    totalPrice?: boolean
    clientId?: boolean
    petId?: boolean
    groomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
    appointmentServices?: boolean | Appointment$appointmentServicesArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dateTime?: boolean
    status?: boolean
    notes?: boolean
    totalPrice?: boolean
    clientId?: boolean
    petId?: boolean
    groomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dateTime?: boolean
    status?: boolean
    notes?: boolean
    totalPrice?: boolean
    clientId?: boolean
    petId?: boolean
    groomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    dateTime?: boolean
    status?: boolean
    notes?: boolean
    totalPrice?: boolean
    clientId?: boolean
    petId?: boolean
    groomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dateTime" | "status" | "notes" | "totalPrice" | "clientId" | "petId" | "groomerId" | "createdAt" | "updatedAt", ExtArgs["result"]["appointment"]>
  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
    appointmentServices?: boolean | Appointment$appointmentServicesArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
  }
  export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    pet?: boolean | PetDefaultArgs<ExtArgs>
    groomer?: boolean | Appointment$groomerArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
      pet: Prisma.$PetPayload<ExtArgs>
      groomer: Prisma.$GroomerPayload<ExtArgs> | null
      appointmentServices: Prisma.$AppointmentServicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dateTime: Date
      status: $Enums.AppointmentStatus
      notes: string | null
      totalPrice: number
      clientId: string
      petId: string
      groomerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {AppointmentUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pet<T extends PetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PetDefaultArgs<ExtArgs>>): Prisma__PetClient<$Result.GetResult<Prisma.$PetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    groomer<T extends Appointment$groomerArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$groomerArgs<ExtArgs>>): Prisma__GroomerClient<$Result.GetResult<Prisma.$GroomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    appointmentServices<T extends Appointment$appointmentServicesArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$appointmentServicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Appointment model
   */
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly dateTime: FieldRef<"Appointment", 'DateTime'>
    readonly status: FieldRef<"Appointment", 'AppointmentStatus'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly totalPrice: FieldRef<"Appointment", 'Float'>
    readonly clientId: FieldRef<"Appointment", 'String'>
    readonly petId: FieldRef<"Appointment", 'String'>
    readonly groomerId: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
  }

  /**
   * Appointment updateManyAndReturn
   */
  export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to delete.
     */
    limit?: number
  }

  /**
   * Appointment.groomer
   */
  export type Appointment$groomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Groomer
     */
    select?: GroomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Groomer
     */
    omit?: GroomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroomerInclude<ExtArgs> | null
    where?: GroomerWhereInput
  }

  /**
   * Appointment.appointmentServices
   */
  export type Appointment$appointmentServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    where?: AppointmentServiceWhereInput
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    cursor?: AppointmentServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentServiceScalarFieldEnum | AppointmentServiceScalarFieldEnum[]
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model AppointmentService
   */

  export type AggregateAppointmentService = {
    _count: AppointmentServiceCountAggregateOutputType | null
    _avg: AppointmentServiceAvgAggregateOutputType | null
    _sum: AppointmentServiceSumAggregateOutputType | null
    _min: AppointmentServiceMinAggregateOutputType | null
    _max: AppointmentServiceMaxAggregateOutputType | null
  }

  export type AppointmentServiceAvgAggregateOutputType = {
    priceAtTime: number | null
    quantity: number | null
  }

  export type AppointmentServiceSumAggregateOutputType = {
    priceAtTime: number | null
    quantity: number | null
  }

  export type AppointmentServiceMinAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    serviceId: string | null
    priceAtTime: number | null
    quantity: number | null
    createdAt: Date | null
  }

  export type AppointmentServiceMaxAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    serviceId: string | null
    priceAtTime: number | null
    quantity: number | null
    createdAt: Date | null
  }

  export type AppointmentServiceCountAggregateOutputType = {
    id: number
    appointmentId: number
    serviceId: number
    priceAtTime: number
    quantity: number
    createdAt: number
    _all: number
  }


  export type AppointmentServiceAvgAggregateInputType = {
    priceAtTime?: true
    quantity?: true
  }

  export type AppointmentServiceSumAggregateInputType = {
    priceAtTime?: true
    quantity?: true
  }

  export type AppointmentServiceMinAggregateInputType = {
    id?: true
    appointmentId?: true
    serviceId?: true
    priceAtTime?: true
    quantity?: true
    createdAt?: true
  }

  export type AppointmentServiceMaxAggregateInputType = {
    id?: true
    appointmentId?: true
    serviceId?: true
    priceAtTime?: true
    quantity?: true
    createdAt?: true
  }

  export type AppointmentServiceCountAggregateInputType = {
    id?: true
    appointmentId?: true
    serviceId?: true
    priceAtTime?: true
    quantity?: true
    createdAt?: true
    _all?: true
  }

  export type AppointmentServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppointmentService to aggregate.
     */
    where?: AppointmentServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppointmentServices to fetch.
     */
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppointmentServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppointmentServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppointmentServices
    **/
    _count?: true | AppointmentServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentServiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentServiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentServiceMaxAggregateInputType
  }

  export type GetAppointmentServiceAggregateType<T extends AppointmentServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointmentService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointmentService[P]>
      : GetScalarType<T[P], AggregateAppointmentService[P]>
  }




  export type AppointmentServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentServiceWhereInput
    orderBy?: AppointmentServiceOrderByWithAggregationInput | AppointmentServiceOrderByWithAggregationInput[]
    by: AppointmentServiceScalarFieldEnum[] | AppointmentServiceScalarFieldEnum
    having?: AppointmentServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentServiceCountAggregateInputType | true
    _avg?: AppointmentServiceAvgAggregateInputType
    _sum?: AppointmentServiceSumAggregateInputType
    _min?: AppointmentServiceMinAggregateInputType
    _max?: AppointmentServiceMaxAggregateInputType
  }

  export type AppointmentServiceGroupByOutputType = {
    id: string
    appointmentId: string
    serviceId: string
    priceAtTime: number
    quantity: number
    createdAt: Date
    _count: AppointmentServiceCountAggregateOutputType | null
    _avg: AppointmentServiceAvgAggregateOutputType | null
    _sum: AppointmentServiceSumAggregateOutputType | null
    _min: AppointmentServiceMinAggregateOutputType | null
    _max: AppointmentServiceMaxAggregateOutputType | null
  }

  type GetAppointmentServiceGroupByPayload<T extends AppointmentServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentServiceGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentServiceGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    serviceId?: boolean
    priceAtTime?: boolean
    quantity?: boolean
    createdAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointmentService"]>

  export type AppointmentServiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    serviceId?: boolean
    priceAtTime?: boolean
    quantity?: boolean
    createdAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointmentService"]>

  export type AppointmentServiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    serviceId?: boolean
    priceAtTime?: boolean
    quantity?: boolean
    createdAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointmentService"]>

  export type AppointmentServiceSelectScalar = {
    id?: boolean
    appointmentId?: boolean
    serviceId?: boolean
    priceAtTime?: boolean
    quantity?: boolean
    createdAt?: boolean
  }

  export type AppointmentServiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "appointmentId" | "serviceId" | "priceAtTime" | "quantity" | "createdAt", ExtArgs["result"]["appointmentService"]>
  export type AppointmentServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }
  export type AppointmentServiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }
  export type AppointmentServiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    service?: boolean | ServicePackageDefaultArgs<ExtArgs>
  }

  export type $AppointmentServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppointmentService"
    objects: {
      appointment: Prisma.$AppointmentPayload<ExtArgs>
      service: Prisma.$ServicePackagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      appointmentId: string
      serviceId: string
      priceAtTime: number
      quantity: number
      createdAt: Date
    }, ExtArgs["result"]["appointmentService"]>
    composites: {}
  }

  type AppointmentServiceGetPayload<S extends boolean | null | undefined | AppointmentServiceDefaultArgs> = $Result.GetResult<Prisma.$AppointmentServicePayload, S>

  type AppointmentServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentServiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentServiceCountAggregateInputType | true
    }

  export interface AppointmentServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppointmentService'], meta: { name: 'AppointmentService' } }
    /**
     * Find zero or one AppointmentService that matches the filter.
     * @param {AppointmentServiceFindUniqueArgs} args - Arguments to find a AppointmentService
     * @example
     * // Get one AppointmentService
     * const appointmentService = await prisma.appointmentService.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentServiceFindUniqueArgs>(args: SelectSubset<T, AppointmentServiceFindUniqueArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppointmentService that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentServiceFindUniqueOrThrowArgs} args - Arguments to find a AppointmentService
     * @example
     * // Get one AppointmentService
     * const appointmentService = await prisma.appointmentService.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppointmentService that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceFindFirstArgs} args - Arguments to find a AppointmentService
     * @example
     * // Get one AppointmentService
     * const appointmentService = await prisma.appointmentService.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentServiceFindFirstArgs>(args?: SelectSubset<T, AppointmentServiceFindFirstArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppointmentService that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceFindFirstOrThrowArgs} args - Arguments to find a AppointmentService
     * @example
     * // Get one AppointmentService
     * const appointmentService = await prisma.appointmentService.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppointmentServices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppointmentServices
     * const appointmentServices = await prisma.appointmentService.findMany()
     * 
     * // Get first 10 AppointmentServices
     * const appointmentServices = await prisma.appointmentService.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentServiceWithIdOnly = await prisma.appointmentService.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentServiceFindManyArgs>(args?: SelectSubset<T, AppointmentServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppointmentService.
     * @param {AppointmentServiceCreateArgs} args - Arguments to create a AppointmentService.
     * @example
     * // Create one AppointmentService
     * const AppointmentService = await prisma.appointmentService.create({
     *   data: {
     *     // ... data to create a AppointmentService
     *   }
     * })
     * 
     */
    create<T extends AppointmentServiceCreateArgs>(args: SelectSubset<T, AppointmentServiceCreateArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppointmentServices.
     * @param {AppointmentServiceCreateManyArgs} args - Arguments to create many AppointmentServices.
     * @example
     * // Create many AppointmentServices
     * const appointmentService = await prisma.appointmentService.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentServiceCreateManyArgs>(args?: SelectSubset<T, AppointmentServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppointmentServices and returns the data saved in the database.
     * @param {AppointmentServiceCreateManyAndReturnArgs} args - Arguments to create many AppointmentServices.
     * @example
     * // Create many AppointmentServices
     * const appointmentService = await prisma.appointmentService.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppointmentServices and only return the `id`
     * const appointmentServiceWithIdOnly = await prisma.appointmentService.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentServiceCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentServiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppointmentService.
     * @param {AppointmentServiceDeleteArgs} args - Arguments to delete one AppointmentService.
     * @example
     * // Delete one AppointmentService
     * const AppointmentService = await prisma.appointmentService.delete({
     *   where: {
     *     // ... filter to delete one AppointmentService
     *   }
     * })
     * 
     */
    delete<T extends AppointmentServiceDeleteArgs>(args: SelectSubset<T, AppointmentServiceDeleteArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppointmentService.
     * @param {AppointmentServiceUpdateArgs} args - Arguments to update one AppointmentService.
     * @example
     * // Update one AppointmentService
     * const appointmentService = await prisma.appointmentService.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentServiceUpdateArgs>(args: SelectSubset<T, AppointmentServiceUpdateArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppointmentServices.
     * @param {AppointmentServiceDeleteManyArgs} args - Arguments to filter AppointmentServices to delete.
     * @example
     * // Delete a few AppointmentServices
     * const { count } = await prisma.appointmentService.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentServiceDeleteManyArgs>(args?: SelectSubset<T, AppointmentServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppointmentServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppointmentServices
     * const appointmentService = await prisma.appointmentService.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentServiceUpdateManyArgs>(args: SelectSubset<T, AppointmentServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppointmentServices and returns the data updated in the database.
     * @param {AppointmentServiceUpdateManyAndReturnArgs} args - Arguments to update many AppointmentServices.
     * @example
     * // Update many AppointmentServices
     * const appointmentService = await prisma.appointmentService.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppointmentServices and only return the `id`
     * const appointmentServiceWithIdOnly = await prisma.appointmentService.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentServiceUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentServiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppointmentService.
     * @param {AppointmentServiceUpsertArgs} args - Arguments to update or create a AppointmentService.
     * @example
     * // Update or create a AppointmentService
     * const appointmentService = await prisma.appointmentService.upsert({
     *   create: {
     *     // ... data to create a AppointmentService
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppointmentService we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentServiceUpsertArgs>(args: SelectSubset<T, AppointmentServiceUpsertArgs<ExtArgs>>): Prisma__AppointmentServiceClient<$Result.GetResult<Prisma.$AppointmentServicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppointmentServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceCountArgs} args - Arguments to filter AppointmentServices to count.
     * @example
     * // Count the number of AppointmentServices
     * const count = await prisma.appointmentService.count({
     *   where: {
     *     // ... the filter for the AppointmentServices we want to count
     *   }
     * })
    **/
    count<T extends AppointmentServiceCountArgs>(
      args?: Subset<T, AppointmentServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppointmentService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentServiceAggregateArgs>(args: Subset<T, AppointmentServiceAggregateArgs>): Prisma.PrismaPromise<GetAppointmentServiceAggregateType<T>>

    /**
     * Group by AppointmentService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentServiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentServiceGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppointmentService model
   */
  readonly fields: AppointmentServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppointmentService.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointment<T extends AppointmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppointmentDefaultArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    service<T extends ServicePackageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServicePackageDefaultArgs<ExtArgs>>): Prisma__ServicePackageClient<$Result.GetResult<Prisma.$ServicePackagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppointmentService model
   */
  interface AppointmentServiceFieldRefs {
    readonly id: FieldRef<"AppointmentService", 'String'>
    readonly appointmentId: FieldRef<"AppointmentService", 'String'>
    readonly serviceId: FieldRef<"AppointmentService", 'String'>
    readonly priceAtTime: FieldRef<"AppointmentService", 'Float'>
    readonly quantity: FieldRef<"AppointmentService", 'Int'>
    readonly createdAt: FieldRef<"AppointmentService", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppointmentService findUnique
   */
  export type AppointmentServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter, which AppointmentService to fetch.
     */
    where: AppointmentServiceWhereUniqueInput
  }

  /**
   * AppointmentService findUniqueOrThrow
   */
  export type AppointmentServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter, which AppointmentService to fetch.
     */
    where: AppointmentServiceWhereUniqueInput
  }

  /**
   * AppointmentService findFirst
   */
  export type AppointmentServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter, which AppointmentService to fetch.
     */
    where?: AppointmentServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppointmentServices to fetch.
     */
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppointmentServices.
     */
    cursor?: AppointmentServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppointmentServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppointmentServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppointmentServices.
     */
    distinct?: AppointmentServiceScalarFieldEnum | AppointmentServiceScalarFieldEnum[]
  }

  /**
   * AppointmentService findFirstOrThrow
   */
  export type AppointmentServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter, which AppointmentService to fetch.
     */
    where?: AppointmentServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppointmentServices to fetch.
     */
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppointmentServices.
     */
    cursor?: AppointmentServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppointmentServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppointmentServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppointmentServices.
     */
    distinct?: AppointmentServiceScalarFieldEnum | AppointmentServiceScalarFieldEnum[]
  }

  /**
   * AppointmentService findMany
   */
  export type AppointmentServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter, which AppointmentServices to fetch.
     */
    where?: AppointmentServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppointmentServices to fetch.
     */
    orderBy?: AppointmentServiceOrderByWithRelationInput | AppointmentServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppointmentServices.
     */
    cursor?: AppointmentServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppointmentServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppointmentServices.
     */
    skip?: number
    distinct?: AppointmentServiceScalarFieldEnum | AppointmentServiceScalarFieldEnum[]
  }

  /**
   * AppointmentService create
   */
  export type AppointmentServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a AppointmentService.
     */
    data: XOR<AppointmentServiceCreateInput, AppointmentServiceUncheckedCreateInput>
  }

  /**
   * AppointmentService createMany
   */
  export type AppointmentServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppointmentServices.
     */
    data: AppointmentServiceCreateManyInput | AppointmentServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppointmentService createManyAndReturn
   */
  export type AppointmentServiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * The data used to create many AppointmentServices.
     */
    data: AppointmentServiceCreateManyInput | AppointmentServiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppointmentService update
   */
  export type AppointmentServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a AppointmentService.
     */
    data: XOR<AppointmentServiceUpdateInput, AppointmentServiceUncheckedUpdateInput>
    /**
     * Choose, which AppointmentService to update.
     */
    where: AppointmentServiceWhereUniqueInput
  }

  /**
   * AppointmentService updateMany
   */
  export type AppointmentServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppointmentServices.
     */
    data: XOR<AppointmentServiceUpdateManyMutationInput, AppointmentServiceUncheckedUpdateManyInput>
    /**
     * Filter which AppointmentServices to update
     */
    where?: AppointmentServiceWhereInput
    /**
     * Limit how many AppointmentServices to update.
     */
    limit?: number
  }

  /**
   * AppointmentService updateManyAndReturn
   */
  export type AppointmentServiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * The data used to update AppointmentServices.
     */
    data: XOR<AppointmentServiceUpdateManyMutationInput, AppointmentServiceUncheckedUpdateManyInput>
    /**
     * Filter which AppointmentServices to update
     */
    where?: AppointmentServiceWhereInput
    /**
     * Limit how many AppointmentServices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppointmentService upsert
   */
  export type AppointmentServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the AppointmentService to update in case it exists.
     */
    where: AppointmentServiceWhereUniqueInput
    /**
     * In case the AppointmentService found by the `where` argument doesn't exist, create a new AppointmentService with this data.
     */
    create: XOR<AppointmentServiceCreateInput, AppointmentServiceUncheckedCreateInput>
    /**
     * In case the AppointmentService was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentServiceUpdateInput, AppointmentServiceUncheckedUpdateInput>
  }

  /**
   * AppointmentService delete
   */
  export type AppointmentServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
    /**
     * Filter which AppointmentService to delete.
     */
    where: AppointmentServiceWhereUniqueInput
  }

  /**
   * AppointmentService deleteMany
   */
  export type AppointmentServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppointmentServices to delete
     */
    where?: AppointmentServiceWhereInput
    /**
     * Limit how many AppointmentServices to delete.
     */
    limit?: number
  }

  /**
   * AppointmentService without action
   */
  export type AppointmentServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentService
     */
    select?: AppointmentServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppointmentService
     */
    omit?: AppointmentServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentServiceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const PetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    species: 'species',
    breed: 'breed',
    birthDate: 'birthDate',
    clientId: 'clientId',
    observations: 'observations',
    foodType: 'foodType',
    lastTickMedicine: 'lastTickMedicine',
    rabiesVaccine: 'rabiesVaccine',
    vaccineHistory: 'vaccineHistory',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PetScalarFieldEnum = (typeof PetScalarFieldEnum)[keyof typeof PetScalarFieldEnum]


  export const GroomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    specialties: 'specialties',
    status: 'status',
    commissionPercentage: 'commissionPercentage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GroomerScalarFieldEnum = (typeof GroomerScalarFieldEnum)[keyof typeof GroomerScalarFieldEnum]


  export const PackageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    includesBaths: 'includesBaths',
    includesGrooming: 'includesGrooming',
    includesHydration: 'includesHydration',
    basePrice: 'basePrice',
    pickupPrice: 'pickupPrice',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PackageScalarFieldEnum = (typeof PackageScalarFieldEnum)[keyof typeof PackageScalarFieldEnum]


  export const ServicePackageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    durationMin: 'durationMin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ServicePackageScalarFieldEnum = (typeof ServicePackageScalarFieldEnum)[keyof typeof ServicePackageScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    dateTime: 'dateTime',
    status: 'status',
    notes: 'notes',
    totalPrice: 'totalPrice',
    clientId: 'clientId',
    petId: 'petId',
    groomerId: 'groomerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const AppointmentServiceScalarFieldEnum: {
    id: 'id',
    appointmentId: 'appointmentId',
    serviceId: 'serviceId',
    priceAtTime: 'priceAtTime',
    quantity: 'quantity',
    createdAt: 'createdAt'
  };

  export type AppointmentServiceScalarFieldEnum = (typeof AppointmentServiceScalarFieldEnum)[keyof typeof AppointmentServiceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Json[]'
   */
  export type ListJsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AppointmentStatus'
   */
  export type EnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus'>
    


  /**
   * Reference to a field of type 'AppointmentStatus[]'
   */
  export type ListEnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    email?: StringNullableFilter<"Client"> | string | null
    address?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    userId?: StringNullableFilter<"Client"> | string | null
    pets?: PetListRelationFilter
    appointments?: AppointmentListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    pets?: PetOrderByRelationAggregateInput
    appointments?: AppointmentOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    userId?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    name?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    address?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    pets?: PetListRelationFilter
    appointments?: AppointmentListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "email" | "userId">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    name?: StringWithAggregatesFilter<"Client"> | string
    phone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    email?: StringNullableWithAggregatesFilter<"Client"> | string | null
    address?: StringNullableWithAggregatesFilter<"Client"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Client"> | string | null
  }

  export type PetWhereInput = {
    AND?: PetWhereInput | PetWhereInput[]
    OR?: PetWhereInput[]
    NOT?: PetWhereInput | PetWhereInput[]
    id?: StringFilter<"Pet"> | string
    name?: StringFilter<"Pet"> | string
    species?: StringFilter<"Pet"> | string
    breed?: StringNullableFilter<"Pet"> | string | null
    birthDate?: StringNullableFilter<"Pet"> | string | null
    clientId?: StringFilter<"Pet"> | string
    observations?: StringNullableFilter<"Pet"> | string | null
    foodType?: StringNullableFilter<"Pet"> | string | null
    lastTickMedicine?: JsonNullableFilter<"Pet">
    rabiesVaccine?: JsonNullableFilter<"Pet">
    vaccineHistory?: JsonNullableListFilter<"Pet">
    createdAt?: DateTimeFilter<"Pet"> | Date | string
    updatedAt?: DateTimeFilter<"Pet"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    appointments?: AppointmentListRelationFilter
  }

  export type PetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    species?: SortOrder
    breed?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    clientId?: SortOrder
    observations?: SortOrderInput | SortOrder
    foodType?: SortOrderInput | SortOrder
    lastTickMedicine?: SortOrderInput | SortOrder
    rabiesVaccine?: SortOrderInput | SortOrder
    vaccineHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    client?: ClientOrderByWithRelationInput
    appointments?: AppointmentOrderByRelationAggregateInput
  }

  export type PetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PetWhereInput | PetWhereInput[]
    OR?: PetWhereInput[]
    NOT?: PetWhereInput | PetWhereInput[]
    name?: StringFilter<"Pet"> | string
    species?: StringFilter<"Pet"> | string
    breed?: StringNullableFilter<"Pet"> | string | null
    birthDate?: StringNullableFilter<"Pet"> | string | null
    clientId?: StringFilter<"Pet"> | string
    observations?: StringNullableFilter<"Pet"> | string | null
    foodType?: StringNullableFilter<"Pet"> | string | null
    lastTickMedicine?: JsonNullableFilter<"Pet">
    rabiesVaccine?: JsonNullableFilter<"Pet">
    vaccineHistory?: JsonNullableListFilter<"Pet">
    createdAt?: DateTimeFilter<"Pet"> | Date | string
    updatedAt?: DateTimeFilter<"Pet"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    appointments?: AppointmentListRelationFilter
  }, "id">

  export type PetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    species?: SortOrder
    breed?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    clientId?: SortOrder
    observations?: SortOrderInput | SortOrder
    foodType?: SortOrderInput | SortOrder
    lastTickMedicine?: SortOrderInput | SortOrder
    rabiesVaccine?: SortOrderInput | SortOrder
    vaccineHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PetCountOrderByAggregateInput
    _max?: PetMaxOrderByAggregateInput
    _min?: PetMinOrderByAggregateInput
  }

  export type PetScalarWhereWithAggregatesInput = {
    AND?: PetScalarWhereWithAggregatesInput | PetScalarWhereWithAggregatesInput[]
    OR?: PetScalarWhereWithAggregatesInput[]
    NOT?: PetScalarWhereWithAggregatesInput | PetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pet"> | string
    name?: StringWithAggregatesFilter<"Pet"> | string
    species?: StringWithAggregatesFilter<"Pet"> | string
    breed?: StringNullableWithAggregatesFilter<"Pet"> | string | null
    birthDate?: StringNullableWithAggregatesFilter<"Pet"> | string | null
    clientId?: StringWithAggregatesFilter<"Pet"> | string
    observations?: StringNullableWithAggregatesFilter<"Pet"> | string | null
    foodType?: StringNullableWithAggregatesFilter<"Pet"> | string | null
    lastTickMedicine?: JsonNullableWithAggregatesFilter<"Pet">
    rabiesVaccine?: JsonNullableWithAggregatesFilter<"Pet">
    vaccineHistory?: JsonNullableListFilter<"Pet">
    createdAt?: DateTimeWithAggregatesFilter<"Pet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pet"> | Date | string
  }

  export type GroomerWhereInput = {
    AND?: GroomerWhereInput | GroomerWhereInput[]
    OR?: GroomerWhereInput[]
    NOT?: GroomerWhereInput | GroomerWhereInput[]
    id?: StringFilter<"Groomer"> | string
    name?: StringFilter<"Groomer"> | string
    phone?: StringNullableFilter<"Groomer"> | string | null
    email?: StringNullableFilter<"Groomer"> | string | null
    specialties?: StringNullableListFilter<"Groomer">
    status?: StringFilter<"Groomer"> | string
    commissionPercentage?: FloatFilter<"Groomer"> | number
    createdAt?: DateTimeFilter<"Groomer"> | Date | string
    updatedAt?: DateTimeFilter<"Groomer"> | Date | string
    appointments?: AppointmentListRelationFilter
  }

  export type GroomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    specialties?: SortOrder
    status?: SortOrder
    commissionPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
  }

  export type GroomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: GroomerWhereInput | GroomerWhereInput[]
    OR?: GroomerWhereInput[]
    NOT?: GroomerWhereInput | GroomerWhereInput[]
    name?: StringFilter<"Groomer"> | string
    phone?: StringNullableFilter<"Groomer"> | string | null
    specialties?: StringNullableListFilter<"Groomer">
    status?: StringFilter<"Groomer"> | string
    commissionPercentage?: FloatFilter<"Groomer"> | number
    createdAt?: DateTimeFilter<"Groomer"> | Date | string
    updatedAt?: DateTimeFilter<"Groomer"> | Date | string
    appointments?: AppointmentListRelationFilter
  }, "id" | "email">

  export type GroomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    specialties?: SortOrder
    status?: SortOrder
    commissionPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GroomerCountOrderByAggregateInput
    _avg?: GroomerAvgOrderByAggregateInput
    _max?: GroomerMaxOrderByAggregateInput
    _min?: GroomerMinOrderByAggregateInput
    _sum?: GroomerSumOrderByAggregateInput
  }

  export type GroomerScalarWhereWithAggregatesInput = {
    AND?: GroomerScalarWhereWithAggregatesInput | GroomerScalarWhereWithAggregatesInput[]
    OR?: GroomerScalarWhereWithAggregatesInput[]
    NOT?: GroomerScalarWhereWithAggregatesInput | GroomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Groomer"> | string
    name?: StringWithAggregatesFilter<"Groomer"> | string
    phone?: StringNullableWithAggregatesFilter<"Groomer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Groomer"> | string | null
    specialties?: StringNullableListFilter<"Groomer">
    status?: StringWithAggregatesFilter<"Groomer"> | string
    commissionPercentage?: FloatWithAggregatesFilter<"Groomer"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Groomer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Groomer"> | Date | string
  }

  export type PackageWhereInput = {
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    id?: StringFilter<"Package"> | string
    name?: StringFilter<"Package"> | string
    description?: StringNullableFilter<"Package"> | string | null
    includesBaths?: IntFilter<"Package"> | number
    includesGrooming?: BoolFilter<"Package"> | boolean
    includesHydration?: BoolFilter<"Package"> | boolean
    basePrice?: FloatFilter<"Package"> | number
    pickupPrice?: FloatFilter<"Package"> | number
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
  }

  export type PackageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    includesBaths?: SortOrder
    includesGrooming?: SortOrder
    includesHydration?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    name?: StringFilter<"Package"> | string
    description?: StringNullableFilter<"Package"> | string | null
    includesBaths?: IntFilter<"Package"> | number
    includesGrooming?: BoolFilter<"Package"> | boolean
    includesHydration?: BoolFilter<"Package"> | boolean
    basePrice?: FloatFilter<"Package"> | number
    pickupPrice?: FloatFilter<"Package"> | number
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
  }, "id">

  export type PackageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    includesBaths?: SortOrder
    includesGrooming?: SortOrder
    includesHydration?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PackageCountOrderByAggregateInput
    _avg?: PackageAvgOrderByAggregateInput
    _max?: PackageMaxOrderByAggregateInput
    _min?: PackageMinOrderByAggregateInput
    _sum?: PackageSumOrderByAggregateInput
  }

  export type PackageScalarWhereWithAggregatesInput = {
    AND?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    OR?: PackageScalarWhereWithAggregatesInput[]
    NOT?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Package"> | string
    name?: StringWithAggregatesFilter<"Package"> | string
    description?: StringNullableWithAggregatesFilter<"Package"> | string | null
    includesBaths?: IntWithAggregatesFilter<"Package"> | number
    includesGrooming?: BoolWithAggregatesFilter<"Package"> | boolean
    includesHydration?: BoolWithAggregatesFilter<"Package"> | boolean
    basePrice?: FloatWithAggregatesFilter<"Package"> | number
    pickupPrice?: FloatWithAggregatesFilter<"Package"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
  }

  export type ServicePackageWhereInput = {
    AND?: ServicePackageWhereInput | ServicePackageWhereInput[]
    OR?: ServicePackageWhereInput[]
    NOT?: ServicePackageWhereInput | ServicePackageWhereInput[]
    id?: StringFilter<"ServicePackage"> | string
    name?: StringFilter<"ServicePackage"> | string
    description?: StringNullableFilter<"ServicePackage"> | string | null
    price?: FloatFilter<"ServicePackage"> | number
    durationMin?: IntFilter<"ServicePackage"> | number
    createdAt?: DateTimeFilter<"ServicePackage"> | Date | string
    updatedAt?: DateTimeFilter<"ServicePackage"> | Date | string
    appointmentServices?: AppointmentServiceListRelationFilter
  }

  export type ServicePackageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    durationMin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentServices?: AppointmentServiceOrderByRelationAggregateInput
  }

  export type ServicePackageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ServicePackageWhereInput | ServicePackageWhereInput[]
    OR?: ServicePackageWhereInput[]
    NOT?: ServicePackageWhereInput | ServicePackageWhereInput[]
    description?: StringNullableFilter<"ServicePackage"> | string | null
    price?: FloatFilter<"ServicePackage"> | number
    durationMin?: IntFilter<"ServicePackage"> | number
    createdAt?: DateTimeFilter<"ServicePackage"> | Date | string
    updatedAt?: DateTimeFilter<"ServicePackage"> | Date | string
    appointmentServices?: AppointmentServiceListRelationFilter
  }, "id" | "name">

  export type ServicePackageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    durationMin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ServicePackageCountOrderByAggregateInput
    _avg?: ServicePackageAvgOrderByAggregateInput
    _max?: ServicePackageMaxOrderByAggregateInput
    _min?: ServicePackageMinOrderByAggregateInput
    _sum?: ServicePackageSumOrderByAggregateInput
  }

  export type ServicePackageScalarWhereWithAggregatesInput = {
    AND?: ServicePackageScalarWhereWithAggregatesInput | ServicePackageScalarWhereWithAggregatesInput[]
    OR?: ServicePackageScalarWhereWithAggregatesInput[]
    NOT?: ServicePackageScalarWhereWithAggregatesInput | ServicePackageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServicePackage"> | string
    name?: StringWithAggregatesFilter<"ServicePackage"> | string
    description?: StringNullableWithAggregatesFilter<"ServicePackage"> | string | null
    price?: FloatWithAggregatesFilter<"ServicePackage"> | number
    durationMin?: IntWithAggregatesFilter<"ServicePackage"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ServicePackage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ServicePackage"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    totalPrice?: FloatFilter<"Appointment"> | number
    clientId?: StringFilter<"Appointment"> | string
    petId?: StringFilter<"Appointment"> | string
    groomerId?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    pet?: XOR<PetScalarRelationFilter, PetWhereInput>
    groomer?: XOR<GroomerNullableScalarRelationFilter, GroomerWhereInput> | null
    appointmentServices?: AppointmentServiceListRelationFilter
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    totalPrice?: SortOrder
    clientId?: SortOrder
    petId?: SortOrder
    groomerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    client?: ClientOrderByWithRelationInput
    pet?: PetOrderByWithRelationInput
    groomer?: GroomerOrderByWithRelationInput
    appointmentServices?: AppointmentServiceOrderByRelationAggregateInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    totalPrice?: FloatFilter<"Appointment"> | number
    clientId?: StringFilter<"Appointment"> | string
    petId?: StringFilter<"Appointment"> | string
    groomerId?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    pet?: XOR<PetScalarRelationFilter, PetWhereInput>
    groomer?: XOR<GroomerNullableScalarRelationFilter, GroomerWhereInput> | null
    appointmentServices?: AppointmentServiceListRelationFilter
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    totalPrice?: SortOrder
    clientId?: SortOrder
    petId?: SortOrder
    groomerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _avg?: AppointmentAvgOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
    _sum?: AppointmentSumOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    dateTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusWithAggregatesFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    totalPrice?: FloatWithAggregatesFilter<"Appointment"> | number
    clientId?: StringWithAggregatesFilter<"Appointment"> | string
    petId?: StringWithAggregatesFilter<"Appointment"> | string
    groomerId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type AppointmentServiceWhereInput = {
    AND?: AppointmentServiceWhereInput | AppointmentServiceWhereInput[]
    OR?: AppointmentServiceWhereInput[]
    NOT?: AppointmentServiceWhereInput | AppointmentServiceWhereInput[]
    id?: StringFilter<"AppointmentService"> | string
    appointmentId?: StringFilter<"AppointmentService"> | string
    serviceId?: StringFilter<"AppointmentService"> | string
    priceAtTime?: FloatFilter<"AppointmentService"> | number
    quantity?: IntFilter<"AppointmentService"> | number
    createdAt?: DateTimeFilter<"AppointmentService"> | Date | string
    appointment?: XOR<AppointmentScalarRelationFilter, AppointmentWhereInput>
    service?: XOR<ServicePackageScalarRelationFilter, ServicePackageWhereInput>
  }

  export type AppointmentServiceOrderByWithRelationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    serviceId?: SortOrder
    priceAtTime?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    appointment?: AppointmentOrderByWithRelationInput
    service?: ServicePackageOrderByWithRelationInput
  }

  export type AppointmentServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    appointmentId_serviceId?: AppointmentServiceAppointmentIdServiceIdCompoundUniqueInput
    AND?: AppointmentServiceWhereInput | AppointmentServiceWhereInput[]
    OR?: AppointmentServiceWhereInput[]
    NOT?: AppointmentServiceWhereInput | AppointmentServiceWhereInput[]
    appointmentId?: StringFilter<"AppointmentService"> | string
    serviceId?: StringFilter<"AppointmentService"> | string
    priceAtTime?: FloatFilter<"AppointmentService"> | number
    quantity?: IntFilter<"AppointmentService"> | number
    createdAt?: DateTimeFilter<"AppointmentService"> | Date | string
    appointment?: XOR<AppointmentScalarRelationFilter, AppointmentWhereInput>
    service?: XOR<ServicePackageScalarRelationFilter, ServicePackageWhereInput>
  }, "id" | "appointmentId_serviceId">

  export type AppointmentServiceOrderByWithAggregationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    serviceId?: SortOrder
    priceAtTime?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    _count?: AppointmentServiceCountOrderByAggregateInput
    _avg?: AppointmentServiceAvgOrderByAggregateInput
    _max?: AppointmentServiceMaxOrderByAggregateInput
    _min?: AppointmentServiceMinOrderByAggregateInput
    _sum?: AppointmentServiceSumOrderByAggregateInput
  }

  export type AppointmentServiceScalarWhereWithAggregatesInput = {
    AND?: AppointmentServiceScalarWhereWithAggregatesInput | AppointmentServiceScalarWhereWithAggregatesInput[]
    OR?: AppointmentServiceScalarWhereWithAggregatesInput[]
    NOT?: AppointmentServiceScalarWhereWithAggregatesInput | AppointmentServiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AppointmentService"> | string
    appointmentId?: StringWithAggregatesFilter<"AppointmentService"> | string
    serviceId?: StringWithAggregatesFilter<"AppointmentService"> | string
    priceAtTime?: FloatWithAggregatesFilter<"AppointmentService"> | number
    quantity?: IntWithAggregatesFilter<"AppointmentService"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AppointmentService"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    client?: ClientCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    client?: ClientUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pets?: PetCreateNestedManyWithoutClientInput
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    user?: UserCreateNestedOneWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    pets?: PetUncheckedCreateNestedManyWithoutClientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pets?: PetUpdateManyWithoutClientNestedInput
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    user?: UserUpdateOneWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pets?: PetUncheckedUpdateManyWithoutClientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PetCreateInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutPetsInput
    appointments?: AppointmentCreateNestedManyWithoutPetInput
  }

  export type PetUncheckedCreateInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    clientId: string
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPetInput
  }

  export type PetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutPetsNestedInput
    appointments?: AppointmentUpdateManyWithoutPetNestedInput
  }

  export type PetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: StringFieldUpdateOperationsInput | string
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPetNestedInput
  }

  export type PetCreateManyInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    clientId: string
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: StringFieldUpdateOperationsInput | string
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroomerCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    specialties?: GroomerCreatespecialtiesInput | string[]
    status?: string
    commissionPercentage?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutGroomerInput
  }

  export type GroomerUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    specialties?: GroomerCreatespecialtiesInput | string[]
    status?: string
    commissionPercentage?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutGroomerInput
  }

  export type GroomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutGroomerNestedInput
  }

  export type GroomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutGroomerNestedInput
  }

  export type GroomerCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    specialties?: GroomerCreatespecialtiesInput | string[]
    status?: string
    commissionPercentage?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateInput = {
    id?: string
    name: string
    description?: string | null
    includesBaths: number
    includesGrooming: boolean
    includesHydration: boolean
    basePrice: number
    pickupPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    includesBaths: number
    includesGrooming: boolean
    includesHydration: boolean
    basePrice: number
    pickupPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    includesBaths?: IntFieldUpdateOperationsInput | number
    includesGrooming?: BoolFieldUpdateOperationsInput | boolean
    includesHydration?: BoolFieldUpdateOperationsInput | boolean
    basePrice?: FloatFieldUpdateOperationsInput | number
    pickupPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    includesBaths?: IntFieldUpdateOperationsInput | number
    includesGrooming?: BoolFieldUpdateOperationsInput | boolean
    includesHydration?: BoolFieldUpdateOperationsInput | boolean
    basePrice?: FloatFieldUpdateOperationsInput | number
    pickupPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    includesBaths: number
    includesGrooming: boolean
    includesHydration: boolean
    basePrice: number
    pickupPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    includesBaths?: IntFieldUpdateOperationsInput | number
    includesGrooming?: BoolFieldUpdateOperationsInput | boolean
    includesHydration?: BoolFieldUpdateOperationsInput | boolean
    basePrice?: FloatFieldUpdateOperationsInput | number
    pickupPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    includesBaths?: IntFieldUpdateOperationsInput | number
    includesGrooming?: BoolFieldUpdateOperationsInput | boolean
    includesHydration?: BoolFieldUpdateOperationsInput | boolean
    basePrice?: FloatFieldUpdateOperationsInput | number
    pickupPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePackageCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    durationMin: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceCreateNestedManyWithoutServiceInput
  }

  export type ServicePackageUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    durationMin: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServicePackageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUpdateManyWithoutServiceNestedInput
  }

  export type ServicePackageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type ServicePackageCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    durationMin: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePackageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePackageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutAppointmentsInput
    pet: PetCreateNestedOneWithoutAppointmentsInput
    groomer?: GroomerCreateNestedOneWithoutAppointmentsInput
    appointmentServices?: AppointmentServiceCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    petId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    pet?: PetUpdateOneRequiredWithoutAppointmentsNestedInput
    groomer?: GroomerUpdateOneWithoutAppointmentsNestedInput
    appointmentServices?: AppointmentServiceUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    petId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentCreateManyInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    petId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    petId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceCreateInput = {
    id?: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutAppointmentServicesInput
    service: ServicePackageCreateNestedOneWithoutAppointmentServicesInput
  }

  export type AppointmentServiceUncheckedCreateInput = {
    id?: string
    appointmentId: string
    serviceId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutAppointmentServicesNestedInput
    service?: ServicePackageUpdateOneRequiredWithoutAppointmentServicesNestedInput
  }

  export type AppointmentServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceCreateManyInput = {
    id?: string
    appointmentId: string
    serviceId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ClientNullableScalarRelationFilter = {
    is?: ClientWhereInput | null
    isNot?: ClientWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PetListRelationFilter = {
    every?: PetWhereInput
    some?: PetWhereInput
    none?: PetWhereInput
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableListFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableListFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableListFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableListFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableListFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableListFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel> | null
    has?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    hasEvery?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    hasSome?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type PetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    species?: SortOrder
    breed?: SortOrder
    birthDate?: SortOrder
    clientId?: SortOrder
    observations?: SortOrder
    foodType?: SortOrder
    lastTickMedicine?: SortOrder
    rabiesVaccine?: SortOrder
    vaccineHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    species?: SortOrder
    breed?: SortOrder
    birthDate?: SortOrder
    clientId?: SortOrder
    observations?: SortOrder
    foodType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    species?: SortOrder
    breed?: SortOrder
    birthDate?: SortOrder
    clientId?: SortOrder
    observations?: SortOrder
    foodType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type GroomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    specialties?: SortOrder
    status?: SortOrder
    commissionPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroomerAvgOrderByAggregateInput = {
    commissionPercentage?: SortOrder
  }

  export type GroomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    status?: SortOrder
    commissionPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    status?: SortOrder
    commissionPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroomerSumOrderByAggregateInput = {
    commissionPercentage?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PackageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    includesBaths?: SortOrder
    includesGrooming?: SortOrder
    includesHydration?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageAvgOrderByAggregateInput = {
    includesBaths?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
  }

  export type PackageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    includesBaths?: SortOrder
    includesGrooming?: SortOrder
    includesHydration?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    includesBaths?: SortOrder
    includesGrooming?: SortOrder
    includesHydration?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageSumOrderByAggregateInput = {
    includesBaths?: SortOrder
    basePrice?: SortOrder
    pickupPrice?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AppointmentServiceListRelationFilter = {
    every?: AppointmentServiceWhereInput
    some?: AppointmentServiceWhereInput
    none?: AppointmentServiceWhereInput
  }

  export type AppointmentServiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServicePackageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    durationMin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePackageAvgOrderByAggregateInput = {
    price?: SortOrder
    durationMin?: SortOrder
  }

  export type ServicePackageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    durationMin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePackageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    durationMin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePackageSumOrderByAggregateInput = {
    price?: SortOrder
    durationMin?: SortOrder
  }

  export type EnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type PetScalarRelationFilter = {
    is?: PetWhereInput
    isNot?: PetWhereInput
  }

  export type GroomerNullableScalarRelationFilter = {
    is?: GroomerWhereInput | null
    isNot?: GroomerWhereInput | null
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    totalPrice?: SortOrder
    clientId?: SortOrder
    petId?: SortOrder
    groomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentAvgOrderByAggregateInput = {
    totalPrice?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    totalPrice?: SortOrder
    clientId?: SortOrder
    petId?: SortOrder
    groomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    totalPrice?: SortOrder
    clientId?: SortOrder
    petId?: SortOrder
    groomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentSumOrderByAggregateInput = {
    totalPrice?: SortOrder
  }

  export type EnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type AppointmentScalarRelationFilter = {
    is?: AppointmentWhereInput
    isNot?: AppointmentWhereInput
  }

  export type ServicePackageScalarRelationFilter = {
    is?: ServicePackageWhereInput
    isNot?: ServicePackageWhereInput
  }

  export type AppointmentServiceAppointmentIdServiceIdCompoundUniqueInput = {
    appointmentId: string
    serviceId: string
  }

  export type AppointmentServiceCountOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    serviceId?: SortOrder
    priceAtTime?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type AppointmentServiceAvgOrderByAggregateInput = {
    priceAtTime?: SortOrder
    quantity?: SortOrder
  }

  export type AppointmentServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    serviceId?: SortOrder
    priceAtTime?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type AppointmentServiceMinOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    serviceId?: SortOrder
    priceAtTime?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type AppointmentServiceSumOrderByAggregateInput = {
    priceAtTime?: SortOrder
    quantity?: SortOrder
  }

  export type ClientCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    connect?: ClientWhereUniqueInput
  }

  export type ClientUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    connect?: ClientWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ClientUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    upsert?: ClientUpsertWithoutUserInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutUserInput, ClientUpdateWithoutUserInput>, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    upsert?: ClientUpsertWithoutUserInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutUserInput, ClientUpdateWithoutUserInput>, ClientUncheckedUpdateWithoutUserInput>
  }

  export type PetCreateNestedManyWithoutClientInput = {
    create?: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput> | PetCreateWithoutClientInput[] | PetUncheckedCreateWithoutClientInput[]
    connectOrCreate?: PetCreateOrConnectWithoutClientInput | PetCreateOrConnectWithoutClientInput[]
    createMany?: PetCreateManyClientInputEnvelope
    connect?: PetWhereUniqueInput | PetWhereUniqueInput[]
  }

  export type AppointmentCreateNestedManyWithoutClientInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutClientInput = {
    create?: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientInput
    connect?: UserWhereUniqueInput
  }

  export type PetUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput> | PetCreateWithoutClientInput[] | PetUncheckedCreateWithoutClientInput[]
    connectOrCreate?: PetCreateOrConnectWithoutClientInput | PetCreateOrConnectWithoutClientInput[]
    createMany?: PetCreateManyClientInputEnvelope
    connect?: PetWhereUniqueInput | PetWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PetUpdateManyWithoutClientNestedInput = {
    create?: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput> | PetCreateWithoutClientInput[] | PetUncheckedCreateWithoutClientInput[]
    connectOrCreate?: PetCreateOrConnectWithoutClientInput | PetCreateOrConnectWithoutClientInput[]
    upsert?: PetUpsertWithWhereUniqueWithoutClientInput | PetUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: PetCreateManyClientInputEnvelope
    set?: PetWhereUniqueInput | PetWhereUniqueInput[]
    disconnect?: PetWhereUniqueInput | PetWhereUniqueInput[]
    delete?: PetWhereUniqueInput | PetWhereUniqueInput[]
    connect?: PetWhereUniqueInput | PetWhereUniqueInput[]
    update?: PetUpdateWithWhereUniqueWithoutClientInput | PetUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: PetUpdateManyWithWhereWithoutClientInput | PetUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: PetScalarWhereInput | PetScalarWhereInput[]
  }

  export type AppointmentUpdateManyWithoutClientNestedInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutClientInput | AppointmentUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutClientInput | AppointmentUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutClientInput | AppointmentUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type UserUpdateOneWithoutClientNestedInput = {
    create?: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientInput
    upsert?: UserUpsertWithoutClientInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutClientInput, UserUpdateWithoutClientInput>, UserUncheckedUpdateWithoutClientInput>
  }

  export type PetUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput> | PetCreateWithoutClientInput[] | PetUncheckedCreateWithoutClientInput[]
    connectOrCreate?: PetCreateOrConnectWithoutClientInput | PetCreateOrConnectWithoutClientInput[]
    upsert?: PetUpsertWithWhereUniqueWithoutClientInput | PetUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: PetCreateManyClientInputEnvelope
    set?: PetWhereUniqueInput | PetWhereUniqueInput[]
    disconnect?: PetWhereUniqueInput | PetWhereUniqueInput[]
    delete?: PetWhereUniqueInput | PetWhereUniqueInput[]
    connect?: PetWhereUniqueInput | PetWhereUniqueInput[]
    update?: PetUpdateWithWhereUniqueWithoutClientInput | PetUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: PetUpdateManyWithWhereWithoutClientInput | PetUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: PetScalarWhereInput | PetScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutClientInput | AppointmentUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutClientInput | AppointmentUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutClientInput | AppointmentUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PetCreatevaccineHistoryInput = {
    set: InputJsonValue[]
  }

  export type ClientCreateNestedOneWithoutPetsInput = {
    create?: XOR<ClientCreateWithoutPetsInput, ClientUncheckedCreateWithoutPetsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutPetsInput
    connect?: ClientWhereUniqueInput
  }

  export type AppointmentCreateNestedManyWithoutPetInput = {
    create?: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput> | AppointmentCreateWithoutPetInput[] | AppointmentUncheckedCreateWithoutPetInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPetInput | AppointmentCreateOrConnectWithoutPetInput[]
    createMany?: AppointmentCreateManyPetInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPetInput = {
    create?: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput> | AppointmentCreateWithoutPetInput[] | AppointmentUncheckedCreateWithoutPetInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPetInput | AppointmentCreateOrConnectWithoutPetInput[]
    createMany?: AppointmentCreateManyPetInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PetUpdatevaccineHistoryInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type ClientUpdateOneRequiredWithoutPetsNestedInput = {
    create?: XOR<ClientCreateWithoutPetsInput, ClientUncheckedCreateWithoutPetsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutPetsInput
    upsert?: ClientUpsertWithoutPetsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutPetsInput, ClientUpdateWithoutPetsInput>, ClientUncheckedUpdateWithoutPetsInput>
  }

  export type AppointmentUpdateManyWithoutPetNestedInput = {
    create?: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput> | AppointmentCreateWithoutPetInput[] | AppointmentUncheckedCreateWithoutPetInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPetInput | AppointmentCreateOrConnectWithoutPetInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPetInput | AppointmentUpsertWithWhereUniqueWithoutPetInput[]
    createMany?: AppointmentCreateManyPetInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPetInput | AppointmentUpdateWithWhereUniqueWithoutPetInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPetInput | AppointmentUpdateManyWithWhereWithoutPetInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPetNestedInput = {
    create?: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput> | AppointmentCreateWithoutPetInput[] | AppointmentUncheckedCreateWithoutPetInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPetInput | AppointmentCreateOrConnectWithoutPetInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPetInput | AppointmentUpsertWithWhereUniqueWithoutPetInput[]
    createMany?: AppointmentCreateManyPetInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPetInput | AppointmentUpdateWithWhereUniqueWithoutPetInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPetInput | AppointmentUpdateManyWithWhereWithoutPetInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type GroomerCreatespecialtiesInput = {
    set: string[]
  }

  export type AppointmentCreateNestedManyWithoutGroomerInput = {
    create?: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput> | AppointmentCreateWithoutGroomerInput[] | AppointmentUncheckedCreateWithoutGroomerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutGroomerInput | AppointmentCreateOrConnectWithoutGroomerInput[]
    createMany?: AppointmentCreateManyGroomerInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutGroomerInput = {
    create?: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput> | AppointmentCreateWithoutGroomerInput[] | AppointmentUncheckedCreateWithoutGroomerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutGroomerInput | AppointmentCreateOrConnectWithoutGroomerInput[]
    createMany?: AppointmentCreateManyGroomerInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type GroomerUpdatespecialtiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AppointmentUpdateManyWithoutGroomerNestedInput = {
    create?: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput> | AppointmentCreateWithoutGroomerInput[] | AppointmentUncheckedCreateWithoutGroomerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutGroomerInput | AppointmentCreateOrConnectWithoutGroomerInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutGroomerInput | AppointmentUpsertWithWhereUniqueWithoutGroomerInput[]
    createMany?: AppointmentCreateManyGroomerInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutGroomerInput | AppointmentUpdateWithWhereUniqueWithoutGroomerInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutGroomerInput | AppointmentUpdateManyWithWhereWithoutGroomerInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutGroomerNestedInput = {
    create?: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput> | AppointmentCreateWithoutGroomerInput[] | AppointmentUncheckedCreateWithoutGroomerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutGroomerInput | AppointmentCreateOrConnectWithoutGroomerInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutGroomerInput | AppointmentUpsertWithWhereUniqueWithoutGroomerInput[]
    createMany?: AppointmentCreateManyGroomerInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutGroomerInput | AppointmentUpdateWithWhereUniqueWithoutGroomerInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutGroomerInput | AppointmentUpdateManyWithWhereWithoutGroomerInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AppointmentServiceCreateNestedManyWithoutServiceInput = {
    create?: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput> | AppointmentServiceCreateWithoutServiceInput[] | AppointmentServiceUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutServiceInput | AppointmentServiceCreateOrConnectWithoutServiceInput[]
    createMany?: AppointmentServiceCreateManyServiceInputEnvelope
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
  }

  export type AppointmentServiceUncheckedCreateNestedManyWithoutServiceInput = {
    create?: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput> | AppointmentServiceCreateWithoutServiceInput[] | AppointmentServiceUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutServiceInput | AppointmentServiceCreateOrConnectWithoutServiceInput[]
    createMany?: AppointmentServiceCreateManyServiceInputEnvelope
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
  }

  export type AppointmentServiceUpdateManyWithoutServiceNestedInput = {
    create?: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput> | AppointmentServiceCreateWithoutServiceInput[] | AppointmentServiceUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutServiceInput | AppointmentServiceCreateOrConnectWithoutServiceInput[]
    upsert?: AppointmentServiceUpsertWithWhereUniqueWithoutServiceInput | AppointmentServiceUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: AppointmentServiceCreateManyServiceInputEnvelope
    set?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    disconnect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    delete?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    update?: AppointmentServiceUpdateWithWhereUniqueWithoutServiceInput | AppointmentServiceUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: AppointmentServiceUpdateManyWithWhereWithoutServiceInput | AppointmentServiceUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
  }

  export type AppointmentServiceUncheckedUpdateManyWithoutServiceNestedInput = {
    create?: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput> | AppointmentServiceCreateWithoutServiceInput[] | AppointmentServiceUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutServiceInput | AppointmentServiceCreateOrConnectWithoutServiceInput[]
    upsert?: AppointmentServiceUpsertWithWhereUniqueWithoutServiceInput | AppointmentServiceUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: AppointmentServiceCreateManyServiceInputEnvelope
    set?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    disconnect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    delete?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    update?: AppointmentServiceUpdateWithWhereUniqueWithoutServiceInput | AppointmentServiceUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: AppointmentServiceUpdateManyWithWhereWithoutServiceInput | AppointmentServiceUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
  }

  export type ClientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAppointmentsInput
    connect?: ClientWhereUniqueInput
  }

  export type PetCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PetCreateWithoutAppointmentsInput, PetUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PetCreateOrConnectWithoutAppointmentsInput
    connect?: PetWhereUniqueInput
  }

  export type GroomerCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<GroomerCreateWithoutAppointmentsInput, GroomerUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: GroomerCreateOrConnectWithoutAppointmentsInput
    connect?: GroomerWhereUniqueInput
  }

  export type AppointmentServiceCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput> | AppointmentServiceCreateWithoutAppointmentInput[] | AppointmentServiceUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutAppointmentInput | AppointmentServiceCreateOrConnectWithoutAppointmentInput[]
    createMany?: AppointmentServiceCreateManyAppointmentInputEnvelope
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
  }

  export type AppointmentServiceUncheckedCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput> | AppointmentServiceCreateWithoutAppointmentInput[] | AppointmentServiceUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutAppointmentInput | AppointmentServiceCreateOrConnectWithoutAppointmentInput[]
    createMany?: AppointmentServiceCreateManyAppointmentInputEnvelope
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
  }

  export type EnumAppointmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentStatus
  }

  export type ClientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAppointmentsInput
    upsert?: ClientUpsertWithoutAppointmentsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutAppointmentsInput, ClientUpdateWithoutAppointmentsInput>, ClientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PetUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PetCreateWithoutAppointmentsInput, PetUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PetCreateOrConnectWithoutAppointmentsInput
    upsert?: PetUpsertWithoutAppointmentsInput
    connect?: PetWhereUniqueInput
    update?: XOR<XOR<PetUpdateToOneWithWhereWithoutAppointmentsInput, PetUpdateWithoutAppointmentsInput>, PetUncheckedUpdateWithoutAppointmentsInput>
  }

  export type GroomerUpdateOneWithoutAppointmentsNestedInput = {
    create?: XOR<GroomerCreateWithoutAppointmentsInput, GroomerUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: GroomerCreateOrConnectWithoutAppointmentsInput
    upsert?: GroomerUpsertWithoutAppointmentsInput
    disconnect?: GroomerWhereInput | boolean
    delete?: GroomerWhereInput | boolean
    connect?: GroomerWhereUniqueInput
    update?: XOR<XOR<GroomerUpdateToOneWithWhereWithoutAppointmentsInput, GroomerUpdateWithoutAppointmentsInput>, GroomerUncheckedUpdateWithoutAppointmentsInput>
  }

  export type AppointmentServiceUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput> | AppointmentServiceCreateWithoutAppointmentInput[] | AppointmentServiceUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutAppointmentInput | AppointmentServiceCreateOrConnectWithoutAppointmentInput[]
    upsert?: AppointmentServiceUpsertWithWhereUniqueWithoutAppointmentInput | AppointmentServiceUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: AppointmentServiceCreateManyAppointmentInputEnvelope
    set?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    disconnect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    delete?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    update?: AppointmentServiceUpdateWithWhereUniqueWithoutAppointmentInput | AppointmentServiceUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: AppointmentServiceUpdateManyWithWhereWithoutAppointmentInput | AppointmentServiceUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
  }

  export type AppointmentServiceUncheckedUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput> | AppointmentServiceCreateWithoutAppointmentInput[] | AppointmentServiceUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: AppointmentServiceCreateOrConnectWithoutAppointmentInput | AppointmentServiceCreateOrConnectWithoutAppointmentInput[]
    upsert?: AppointmentServiceUpsertWithWhereUniqueWithoutAppointmentInput | AppointmentServiceUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: AppointmentServiceCreateManyAppointmentInputEnvelope
    set?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    disconnect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    delete?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    connect?: AppointmentServiceWhereUniqueInput | AppointmentServiceWhereUniqueInput[]
    update?: AppointmentServiceUpdateWithWhereUniqueWithoutAppointmentInput | AppointmentServiceUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: AppointmentServiceUpdateManyWithWhereWithoutAppointmentInput | AppointmentServiceUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
  }

  export type AppointmentCreateNestedOneWithoutAppointmentServicesInput = {
    create?: XOR<AppointmentCreateWithoutAppointmentServicesInput, AppointmentUncheckedCreateWithoutAppointmentServicesInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutAppointmentServicesInput
    connect?: AppointmentWhereUniqueInput
  }

  export type ServicePackageCreateNestedOneWithoutAppointmentServicesInput = {
    create?: XOR<ServicePackageCreateWithoutAppointmentServicesInput, ServicePackageUncheckedCreateWithoutAppointmentServicesInput>
    connectOrCreate?: ServicePackageCreateOrConnectWithoutAppointmentServicesInput
    connect?: ServicePackageWhereUniqueInput
  }

  export type AppointmentUpdateOneRequiredWithoutAppointmentServicesNestedInput = {
    create?: XOR<AppointmentCreateWithoutAppointmentServicesInput, AppointmentUncheckedCreateWithoutAppointmentServicesInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutAppointmentServicesInput
    upsert?: AppointmentUpsertWithoutAppointmentServicesInput
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutAppointmentServicesInput, AppointmentUpdateWithoutAppointmentServicesInput>, AppointmentUncheckedUpdateWithoutAppointmentServicesInput>
  }

  export type ServicePackageUpdateOneRequiredWithoutAppointmentServicesNestedInput = {
    create?: XOR<ServicePackageCreateWithoutAppointmentServicesInput, ServicePackageUncheckedCreateWithoutAppointmentServicesInput>
    connectOrCreate?: ServicePackageCreateOrConnectWithoutAppointmentServicesInput
    upsert?: ServicePackageUpsertWithoutAppointmentServicesInput
    connect?: ServicePackageWhereUniqueInput
    update?: XOR<XOR<ServicePackageUpdateToOneWithWhereWithoutAppointmentServicesInput, ServicePackageUpdateWithoutAppointmentServicesInput>, ServicePackageUncheckedUpdateWithoutAppointmentServicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type ClientCreateWithoutUserInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pets?: PetCreateNestedManyWithoutClientInput
    appointments?: AppointmentCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pets?: PetUncheckedCreateNestedManyWithoutClientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutUserInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
  }

  export type ClientUpsertWithoutUserInput = {
    update: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutUserInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pets?: PetUpdateManyWithoutClientNestedInput
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pets?: PetUncheckedUpdateManyWithoutClientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
  }

  export type PetCreateWithoutClientInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPetInput
  }

  export type PetUncheckedCreateWithoutClientInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPetInput
  }

  export type PetCreateOrConnectWithoutClientInput = {
    where: PetWhereUniqueInput
    create: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput>
  }

  export type PetCreateManyClientInputEnvelope = {
    data: PetCreateManyClientInput | PetCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentCreateWithoutClientInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pet: PetCreateNestedOneWithoutAppointmentsInput
    groomer?: GroomerCreateNestedOneWithoutAppointmentsInput
    appointmentServices?: AppointmentServiceCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutClientInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    petId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput>
  }

  export type AppointmentCreateManyClientInputEnvelope = {
    data: AppointmentCreateManyClientInput | AppointmentCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutClientInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutClientInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutClientInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
  }

  export type PetUpsertWithWhereUniqueWithoutClientInput = {
    where: PetWhereUniqueInput
    update: XOR<PetUpdateWithoutClientInput, PetUncheckedUpdateWithoutClientInput>
    create: XOR<PetCreateWithoutClientInput, PetUncheckedCreateWithoutClientInput>
  }

  export type PetUpdateWithWhereUniqueWithoutClientInput = {
    where: PetWhereUniqueInput
    data: XOR<PetUpdateWithoutClientInput, PetUncheckedUpdateWithoutClientInput>
  }

  export type PetUpdateManyWithWhereWithoutClientInput = {
    where: PetScalarWhereInput
    data: XOR<PetUpdateManyMutationInput, PetUncheckedUpdateManyWithoutClientInput>
  }

  export type PetScalarWhereInput = {
    AND?: PetScalarWhereInput | PetScalarWhereInput[]
    OR?: PetScalarWhereInput[]
    NOT?: PetScalarWhereInput | PetScalarWhereInput[]
    id?: StringFilter<"Pet"> | string
    name?: StringFilter<"Pet"> | string
    species?: StringFilter<"Pet"> | string
    breed?: StringNullableFilter<"Pet"> | string | null
    birthDate?: StringNullableFilter<"Pet"> | string | null
    clientId?: StringFilter<"Pet"> | string
    observations?: StringNullableFilter<"Pet"> | string | null
    foodType?: StringNullableFilter<"Pet"> | string | null
    lastTickMedicine?: JsonNullableFilter<"Pet">
    rabiesVaccine?: JsonNullableFilter<"Pet">
    vaccineHistory?: JsonNullableListFilter<"Pet">
    createdAt?: DateTimeFilter<"Pet"> | Date | string
    updatedAt?: DateTimeFilter<"Pet"> | Date | string
  }

  export type AppointmentUpsertWithWhereUniqueWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutClientInput, AppointmentUncheckedUpdateWithoutClientInput>
    create: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutClientInput, AppointmentUncheckedUpdateWithoutClientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutClientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutClientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    totalPrice?: FloatFilter<"Appointment"> | number
    clientId?: StringFilter<"Appointment"> | string
    petId?: StringFilter<"Appointment"> | string
    groomerId?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
  }

  export type UserUpsertWithoutClientInput = {
    update: XOR<UserUpdateWithoutClientInput, UserUncheckedUpdateWithoutClientInput>
    create: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutClientInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutClientInput, UserUncheckedUpdateWithoutClientInput>
  }

  export type UserUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateWithoutPetsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    user?: UserCreateNestedOneWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutPetsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutPetsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutPetsInput, ClientUncheckedCreateWithoutPetsInput>
  }

  export type AppointmentCreateWithoutPetInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutAppointmentsInput
    groomer?: GroomerCreateNestedOneWithoutAppointmentsInput
    appointmentServices?: AppointmentServiceCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutPetInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutPetInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput>
  }

  export type AppointmentCreateManyPetInputEnvelope = {
    data: AppointmentCreateManyPetInput | AppointmentCreateManyPetInput[]
    skipDuplicates?: boolean
  }

  export type ClientUpsertWithoutPetsInput = {
    update: XOR<ClientUpdateWithoutPetsInput, ClientUncheckedUpdateWithoutPetsInput>
    create: XOR<ClientCreateWithoutPetsInput, ClientUncheckedCreateWithoutPetsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutPetsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutPetsInput, ClientUncheckedUpdateWithoutPetsInput>
  }

  export type ClientUpdateWithoutPetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    user?: UserUpdateOneWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutPetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPetInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPetInput, AppointmentUncheckedUpdateWithoutPetInput>
    create: XOR<AppointmentCreateWithoutPetInput, AppointmentUncheckedCreateWithoutPetInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPetInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPetInput, AppointmentUncheckedUpdateWithoutPetInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPetInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPetInput>
  }

  export type AppointmentCreateWithoutGroomerInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutAppointmentsInput
    pet: PetCreateNestedOneWithoutAppointmentsInput
    appointmentServices?: AppointmentServiceCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutGroomerInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    petId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentServices?: AppointmentServiceUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutGroomerInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput>
  }

  export type AppointmentCreateManyGroomerInputEnvelope = {
    data: AppointmentCreateManyGroomerInput | AppointmentCreateManyGroomerInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutGroomerInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutGroomerInput, AppointmentUncheckedUpdateWithoutGroomerInput>
    create: XOR<AppointmentCreateWithoutGroomerInput, AppointmentUncheckedCreateWithoutGroomerInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutGroomerInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutGroomerInput, AppointmentUncheckedUpdateWithoutGroomerInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutGroomerInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutGroomerInput>
  }

  export type AppointmentServiceCreateWithoutServiceInput = {
    id?: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutAppointmentServicesInput
  }

  export type AppointmentServiceUncheckedCreateWithoutServiceInput = {
    id?: string
    appointmentId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceCreateOrConnectWithoutServiceInput = {
    where: AppointmentServiceWhereUniqueInput
    create: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput>
  }

  export type AppointmentServiceCreateManyServiceInputEnvelope = {
    data: AppointmentServiceCreateManyServiceInput | AppointmentServiceCreateManyServiceInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentServiceUpsertWithWhereUniqueWithoutServiceInput = {
    where: AppointmentServiceWhereUniqueInput
    update: XOR<AppointmentServiceUpdateWithoutServiceInput, AppointmentServiceUncheckedUpdateWithoutServiceInput>
    create: XOR<AppointmentServiceCreateWithoutServiceInput, AppointmentServiceUncheckedCreateWithoutServiceInput>
  }

  export type AppointmentServiceUpdateWithWhereUniqueWithoutServiceInput = {
    where: AppointmentServiceWhereUniqueInput
    data: XOR<AppointmentServiceUpdateWithoutServiceInput, AppointmentServiceUncheckedUpdateWithoutServiceInput>
  }

  export type AppointmentServiceUpdateManyWithWhereWithoutServiceInput = {
    where: AppointmentServiceScalarWhereInput
    data: XOR<AppointmentServiceUpdateManyMutationInput, AppointmentServiceUncheckedUpdateManyWithoutServiceInput>
  }

  export type AppointmentServiceScalarWhereInput = {
    AND?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
    OR?: AppointmentServiceScalarWhereInput[]
    NOT?: AppointmentServiceScalarWhereInput | AppointmentServiceScalarWhereInput[]
    id?: StringFilter<"AppointmentService"> | string
    appointmentId?: StringFilter<"AppointmentService"> | string
    serviceId?: StringFilter<"AppointmentService"> | string
    priceAtTime?: FloatFilter<"AppointmentService"> | number
    quantity?: IntFilter<"AppointmentService"> | number
    createdAt?: DateTimeFilter<"AppointmentService"> | Date | string
  }

  export type ClientCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pets?: PetCreateNestedManyWithoutClientInput
    user?: UserCreateNestedOneWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    pets?: PetUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutAppointmentsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
  }

  export type PetCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutPetsInput
  }

  export type PetUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    clientId: string
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PetCreateOrConnectWithoutAppointmentsInput = {
    where: PetWhereUniqueInput
    create: XOR<PetCreateWithoutAppointmentsInput, PetUncheckedCreateWithoutAppointmentsInput>
  }

  export type GroomerCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    specialties?: GroomerCreatespecialtiesInput | string[]
    status?: string
    commissionPercentage?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroomerUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    specialties?: GroomerCreatespecialtiesInput | string[]
    status?: string
    commissionPercentage?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroomerCreateOrConnectWithoutAppointmentsInput = {
    where: GroomerWhereUniqueInput
    create: XOR<GroomerCreateWithoutAppointmentsInput, GroomerUncheckedCreateWithoutAppointmentsInput>
  }

  export type AppointmentServiceCreateWithoutAppointmentInput = {
    id?: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
    service: ServicePackageCreateNestedOneWithoutAppointmentServicesInput
  }

  export type AppointmentServiceUncheckedCreateWithoutAppointmentInput = {
    id?: string
    serviceId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceCreateOrConnectWithoutAppointmentInput = {
    where: AppointmentServiceWhereUniqueInput
    create: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput>
  }

  export type AppointmentServiceCreateManyAppointmentInputEnvelope = {
    data: AppointmentServiceCreateManyAppointmentInput | AppointmentServiceCreateManyAppointmentInput[]
    skipDuplicates?: boolean
  }

  export type ClientUpsertWithoutAppointmentsInput = {
    update: XOR<ClientUpdateWithoutAppointmentsInput, ClientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutAppointmentsInput, ClientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ClientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pets?: PetUpdateManyWithoutClientNestedInput
    user?: UserUpdateOneWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pets?: PetUncheckedUpdateManyWithoutClientNestedInput
  }

  export type PetUpsertWithoutAppointmentsInput = {
    update: XOR<PetUpdateWithoutAppointmentsInput, PetUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PetCreateWithoutAppointmentsInput, PetUncheckedCreateWithoutAppointmentsInput>
    where?: PetWhereInput
  }

  export type PetUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PetWhereInput
    data: XOR<PetUpdateWithoutAppointmentsInput, PetUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PetUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutPetsNestedInput
  }

  export type PetUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: StringFieldUpdateOperationsInput | string
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroomerUpsertWithoutAppointmentsInput = {
    update: XOR<GroomerUpdateWithoutAppointmentsInput, GroomerUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<GroomerCreateWithoutAppointmentsInput, GroomerUncheckedCreateWithoutAppointmentsInput>
    where?: GroomerWhereInput
  }

  export type GroomerUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: GroomerWhereInput
    data: XOR<GroomerUpdateWithoutAppointmentsInput, GroomerUncheckedUpdateWithoutAppointmentsInput>
  }

  export type GroomerUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroomerUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: GroomerUpdatespecialtiesInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    commissionPercentage?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceUpsertWithWhereUniqueWithoutAppointmentInput = {
    where: AppointmentServiceWhereUniqueInput
    update: XOR<AppointmentServiceUpdateWithoutAppointmentInput, AppointmentServiceUncheckedUpdateWithoutAppointmentInput>
    create: XOR<AppointmentServiceCreateWithoutAppointmentInput, AppointmentServiceUncheckedCreateWithoutAppointmentInput>
  }

  export type AppointmentServiceUpdateWithWhereUniqueWithoutAppointmentInput = {
    where: AppointmentServiceWhereUniqueInput
    data: XOR<AppointmentServiceUpdateWithoutAppointmentInput, AppointmentServiceUncheckedUpdateWithoutAppointmentInput>
  }

  export type AppointmentServiceUpdateManyWithWhereWithoutAppointmentInput = {
    where: AppointmentServiceScalarWhereInput
    data: XOR<AppointmentServiceUpdateManyMutationInput, AppointmentServiceUncheckedUpdateManyWithoutAppointmentInput>
  }

  export type AppointmentCreateWithoutAppointmentServicesInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutAppointmentsInput
    pet: PetCreateNestedOneWithoutAppointmentsInput
    groomer?: GroomerCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutAppointmentServicesInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    petId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutAppointmentServicesInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutAppointmentServicesInput, AppointmentUncheckedCreateWithoutAppointmentServicesInput>
  }

  export type ServicePackageCreateWithoutAppointmentServicesInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    durationMin: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePackageUncheckedCreateWithoutAppointmentServicesInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    durationMin: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePackageCreateOrConnectWithoutAppointmentServicesInput = {
    where: ServicePackageWhereUniqueInput
    create: XOR<ServicePackageCreateWithoutAppointmentServicesInput, ServicePackageUncheckedCreateWithoutAppointmentServicesInput>
  }

  export type AppointmentUpsertWithoutAppointmentServicesInput = {
    update: XOR<AppointmentUpdateWithoutAppointmentServicesInput, AppointmentUncheckedUpdateWithoutAppointmentServicesInput>
    create: XOR<AppointmentCreateWithoutAppointmentServicesInput, AppointmentUncheckedCreateWithoutAppointmentServicesInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutAppointmentServicesInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutAppointmentServicesInput, AppointmentUncheckedUpdateWithoutAppointmentServicesInput>
  }

  export type AppointmentUpdateWithoutAppointmentServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    pet?: PetUpdateOneRequiredWithoutAppointmentsNestedInput
    groomer?: GroomerUpdateOneWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutAppointmentServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    petId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePackageUpsertWithoutAppointmentServicesInput = {
    update: XOR<ServicePackageUpdateWithoutAppointmentServicesInput, ServicePackageUncheckedUpdateWithoutAppointmentServicesInput>
    create: XOR<ServicePackageCreateWithoutAppointmentServicesInput, ServicePackageUncheckedCreateWithoutAppointmentServicesInput>
    where?: ServicePackageWhereInput
  }

  export type ServicePackageUpdateToOneWithWhereWithoutAppointmentServicesInput = {
    where?: ServicePackageWhereInput
    data: XOR<ServicePackageUpdateWithoutAppointmentServicesInput, ServicePackageUncheckedUpdateWithoutAppointmentServicesInput>
  }

  export type ServicePackageUpdateWithoutAppointmentServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePackageUncheckedUpdateWithoutAppointmentServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    durationMin?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PetCreateManyClientInput = {
    id?: string
    name: string
    species: string
    breed?: string | null
    birthDate?: string | null
    observations?: string | null
    foodType?: string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetCreatevaccineHistoryInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateManyClientInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    petId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PetUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPetNestedInput
  }

  export type PetUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPetNestedInput
  }

  export type PetUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    species?: StringFieldUpdateOperationsInput | string
    breed?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableStringFieldUpdateOperationsInput | string | null
    observations?: NullableStringFieldUpdateOperationsInput | string | null
    foodType?: NullableStringFieldUpdateOperationsInput | string | null
    lastTickMedicine?: NullableJsonNullValueInput | InputJsonValue
    rabiesVaccine?: NullableJsonNullValueInput | InputJsonValue
    vaccineHistory?: PetUpdatevaccineHistoryInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pet?: PetUpdateOneRequiredWithoutAppointmentsNestedInput
    groomer?: GroomerUpdateOneWithoutAppointmentsNestedInput
    appointmentServices?: AppointmentServiceUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    petId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    petId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyPetInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    groomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutPetInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    groomer?: GroomerUpdateOneWithoutAppointmentsNestedInput
    appointmentServices?: AppointmentServiceUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPetInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutPetInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    groomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyGroomerInput = {
    id?: string
    dateTime: Date | string
    status?: $Enums.AppointmentStatus
    notes?: string | null
    totalPrice: number
    clientId: string
    petId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutGroomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    pet?: PetUpdateOneRequiredWithoutAppointmentsNestedInput
    appointmentServices?: AppointmentServiceUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutGroomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    petId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentServices?: AppointmentServiceUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutGroomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    clientId?: StringFieldUpdateOperationsInput | string
    petId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceCreateManyServiceInput = {
    id?: string
    appointmentId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutAppointmentServicesNestedInput
  }

  export type AppointmentServiceUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceCreateManyAppointmentInput = {
    id?: string
    serviceId: string
    priceAtTime: number
    quantity?: number
    createdAt?: Date | string
  }

  export type AppointmentServiceUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    service?: ServicePackageUpdateOneRequiredWithoutAppointmentServicesNestedInput
  }

  export type AppointmentServiceUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentServiceUncheckedUpdateManyWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    priceAtTime?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}