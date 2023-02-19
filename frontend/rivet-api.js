var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/core/schemas/Schema.ts
var SchemaType;
var init_Schema = __esm({
  "src/core/schemas/Schema.ts"() {
    "use strict";
    SchemaType = {
      DATE: "date",
      ENUM: "enum",
      LIST: "list",
      STRING_LITERAL: "stringLiteral",
      OBJECT: "object",
      ANY: "any",
      BOOLEAN: "boolean",
      NUMBER: "number",
      STRING: "string",
      UNKNOWN: "unknown",
      RECORD: "record",
      SET: "set",
      UNION: "union",
      OPTIONAL: "optional"
    };
  }
});

// src/core/schemas/builders/schema-utils/stringifyValidationErrors.ts
function stringifyValidationError(error) {
  if (error.path.length === 0) {
    return error.message;
  }
  return `${error.path.join(" -> ")}: ${error.message}`;
}
var init_stringifyValidationErrors = __esm({
  "src/core/schemas/builders/schema-utils/stringifyValidationErrors.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/schema-utils/JsonError.ts
var JsonError;
var init_JsonError = __esm({
  "src/core/schemas/builders/schema-utils/JsonError.ts"() {
    "use strict";
    init_stringifyValidationErrors();
    JsonError = class extends Error {
      constructor(errors) {
        super(errors.map(stringifyValidationError).join("; "));
        this.errors = errors;
        Object.setPrototypeOf(this, JsonError.prototype);
      }
    };
  }
});

// src/core/schemas/builders/schema-utils/ParseError.ts
var ParseError;
var init_ParseError = __esm({
  "src/core/schemas/builders/schema-utils/ParseError.ts"() {
    "use strict";
    init_stringifyValidationErrors();
    ParseError = class extends Error {
      constructor(errors) {
        super(errors.map(stringifyValidationError).join("; "));
        this.errors = errors;
        Object.setPrototypeOf(this, ParseError.prototype);
      }
    };
  }
});

// src/core/schemas/builders/schema-utils/getSchemaUtils.ts
function getSchemaUtils(schema) {
  return {
    optional: () => optional(schema),
    transform: (transformer) => transform(schema, transformer),
    parseOrThrow: async (raw, opts) => {
      const parsed = await schema.parse(raw, opts);
      if (parsed.ok) {
        return parsed.value;
      }
      throw new ParseError(parsed.errors);
    },
    jsonOrThrow: async (parsed, opts) => {
      const raw = await schema.json(parsed, opts);
      if (raw.ok) {
        return raw.value;
      }
      throw new JsonError(raw.errors);
    }
  };
}
function optional(schema) {
  const baseSchema = {
    parse: (raw, opts) => {
      if (raw == null) {
        return {
          ok: true,
          value: void 0
        };
      }
      return schema.parse(raw, opts);
    },
    json: (parsed, opts) => {
      if (parsed == null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.json(parsed, opts);
    },
    getType: () => SchemaType.OPTIONAL
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
function transform(schema, transformer) {
  const baseSchema = {
    parse: async (raw, opts) => {
      const parsed = await schema.parse(raw, opts);
      if (!parsed.ok) {
        return parsed;
      }
      return {
        ok: true,
        value: transformer.transform(parsed.value)
      };
    },
    json: async (transformed, opts) => {
      const parsed = await transformer.untransform(transformed);
      return schema.json(parsed, opts);
    },
    getType: () => schema.getType()
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var init_getSchemaUtils = __esm({
  "src/core/schemas/builders/schema-utils/getSchemaUtils.ts"() {
    "use strict";
    init_Schema();
    init_JsonError();
    init_ParseError();
  }
});

// src/core/schemas/builders/schema-utils/index.ts
var init_schema_utils = __esm({
  "src/core/schemas/builders/schema-utils/index.ts"() {
    "use strict";
    init_getSchemaUtils();
    init_JsonError();
    init_ParseError();
  }
});

// src/core/schemas/builders/date/date.ts
function date() {
  const baseSchema = {
    parse: (raw) => {
      if (typeof raw === "string" && ISO_8601_REGEX.test(raw)) {
        return {
          ok: true,
          value: new Date(raw)
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not an ISO 8601 date string"
            }
          ]
        };
      }
    },
    json: (date2) => {
      if (date2 instanceof Date) {
        return {
          ok: true,
          value: date2.toISOString()
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a Date object"
            }
          ]
        };
      }
    },
    getType: () => SchemaType.DATE
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var ISO_8601_REGEX;
var init_date = __esm({
  "src/core/schemas/builders/date/date.ts"() {
    "use strict";
    init_Schema();
    init_schema_utils();
    ISO_8601_REGEX = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  }
});

// src/core/schemas/builders/date/index.ts
var init_date2 = __esm({
  "src/core/schemas/builders/date/index.ts"() {
    "use strict";
    init_date();
  }
});

// src/core/schemas/utils/createIdentitySchemaCreator.ts
function createIdentitySchemaCreator(schemaType, validate) {
  return () => {
    const baseSchema = {
      parse: validate,
      json: validate,
      getType: () => schemaType
    };
    return {
      ...baseSchema,
      ...getSchemaUtils(baseSchema)
    };
  };
}
var init_createIdentitySchemaCreator = __esm({
  "src/core/schemas/utils/createIdentitySchemaCreator.ts"() {
    "use strict";
    init_schema_utils();
  }
});

// src/core/schemas/builders/enum/enum.ts
function enum_(values) {
  const validValues = new Set(values);
  const schemaCreator = createIdentitySchemaCreator(SchemaType.ENUM, (value, { allowUnknownKeys = false } = {}) => {
    if (typeof value === "string" && (validValues.has(value) || allowUnknownKeys)) {
      return {
        ok: true,
        value
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [],
            message: "Not one of the allowed values"
          }
        ]
      };
    }
  });
  return schemaCreator();
}
var init_enum = __esm({
  "src/core/schemas/builders/enum/enum.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
  }
});

// src/core/schemas/builders/enum/index.ts
var init_enum2 = __esm({
  "src/core/schemas/builders/enum/index.ts"() {
    "use strict";
    init_enum();
  }
});

// src/core/schemas/builders/lazy/lazy.ts
function lazy(getter) {
  const baseSchema = constructLazyBaseSchema(getter);
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
function constructLazyBaseSchema(getter) {
  return {
    parse: async (raw, opts) => (await getMemoizedSchema(getter)).parse(raw, opts),
    json: async (parsed, opts) => (await getMemoizedSchema(getter)).json(parsed, opts),
    getType: async () => (await getMemoizedSchema(getter)).getType()
  };
}
async function getMemoizedSchema(getter) {
  const castedGetter = getter;
  if (castedGetter.__zurg_memoized == null) {
    castedGetter.__zurg_memoized = await getter();
  }
  return castedGetter.__zurg_memoized;
}
var init_lazy = __esm({
  "src/core/schemas/builders/lazy/lazy.ts"() {
    "use strict";
    init_schema_utils();
  }
});

// src/core/schemas/utils/entries.ts
function entries(object2) {
  return Object.entries(object2);
}
var init_entries = __esm({
  "src/core/schemas/utils/entries.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/filterObject.ts
function filterObject(obj, keysToInclude) {
  const keysToIncludeSet = new Set(keysToInclude);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keysToIncludeSet.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
var init_filterObject = __esm({
  "src/core/schemas/utils/filterObject.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/isPlainObject.ts
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
var NOT_AN_OBJECT_ERROR_MESSAGE;
var init_isPlainObject = __esm({
  "src/core/schemas/utils/isPlainObject.ts"() {
    "use strict";
    NOT_AN_OBJECT_ERROR_MESSAGE = "Not an object";
  }
});

// src/core/schemas/utils/keys.ts
function keys(object2) {
  return Object.keys(object2);
}
var init_keys = __esm({
  "src/core/schemas/utils/keys.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/partition.ts
function partition(items, predicate) {
  const trueItems = [], falseItems = [];
  for (const item of items) {
    if (predicate(item)) {
      trueItems.push(item);
    } else {
      falseItems.push(item);
    }
  }
  return [trueItems, falseItems];
}
var init_partition = __esm({
  "src/core/schemas/utils/partition.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/object-like/getObjectLikeUtils.ts
function getObjectLikeUtils(schema) {
  return {
    withParsedProperties: (properties) => withParsedProperties(schema, properties)
  };
}
function withParsedProperties(objectLike, properties) {
  const objectSchema = {
    parse: async (raw, opts) => {
      const parsedObject = await objectLike.parse(raw, opts);
      if (!parsedObject.ok) {
        return parsedObject;
      }
      const additionalProperties = Object.entries(properties).reduce(
        (processed, [key, value]) => {
          return {
            ...processed,
            [key]: typeof value === "function" ? value(parsedObject.value) : value
          };
        },
        {}
      );
      return {
        ok: true,
        value: {
          ...parsedObject.value,
          ...additionalProperties
        }
      };
    },
    json: (parsed, opts) => {
      if (!isPlainObject(parsed)) {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: NOT_AN_OBJECT_ERROR_MESSAGE
            }
          ]
        };
      }
      const addedPropertyKeys = new Set(Object.keys(properties));
      const parsedWithoutAddedProperties = filterObject(
        parsed,
        Object.keys(parsed).filter((key) => !addedPropertyKeys.has(key))
      );
      return objectLike.json(parsedWithoutAddedProperties, opts);
    },
    getType: () => objectLike.getType()
  };
  return {
    ...objectSchema,
    ...getSchemaUtils(objectSchema),
    ...getObjectLikeUtils(objectSchema)
  };
}
var init_getObjectLikeUtils = __esm({
  "src/core/schemas/builders/object-like/getObjectLikeUtils.ts"() {
    "use strict";
    init_filterObject();
    init_isPlainObject();
    init_schema_utils();
  }
});

// src/core/schemas/builders/object-like/index.ts
var init_object_like = __esm({
  "src/core/schemas/builders/object-like/index.ts"() {
    "use strict";
    init_getObjectLikeUtils();
  }
});

// src/core/schemas/builders/object/property.ts
function property(rawKey, valueSchema) {
  return {
    rawKey,
    valueSchema,
    isProperty: true
  };
}
function isProperty(maybeProperty) {
  return maybeProperty.isProperty;
}
var init_property = __esm({
  "src/core/schemas/builders/object/property.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/object/object.ts
function object(schemas) {
  const baseSchema = {
    _getRawProperties: () => Promise.resolve(
      Object.entries(schemas).map(
        ([parsedKey, propertySchema]) => isProperty(propertySchema) ? propertySchema.rawKey : parsedKey
      )
    ),
    _getParsedProperties: () => Promise.resolve(keys(schemas)),
    parse: async (raw, opts) => {
      const rawKeyToProperty = {};
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const rawKey = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.rawKey : parsedKey;
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        const property2 = {
          rawKey,
          parsedKey,
          valueSchema
        };
        rawKeyToProperty[rawKey] = property2;
        if (await isSchemaRequired(valueSchema)) {
          requiredKeys.push(rawKey);
        }
      }
      return validateAndTransformObject({
        value: raw,
        requiredKeys,
        getProperty: (rawKey) => {
          const property2 = rawKeyToProperty[rawKey];
          if (property2 == null) {
            return void 0;
          }
          return {
            transformedKey: property2.parsedKey,
            transform: (propertyValue) => property2.valueSchema.parse(propertyValue, opts)
          };
        },
        allowUnknownKeys: opts?.allowUnknownKeys ?? false
      });
    },
    json: async (parsed, opts) => {
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        if (await isSchemaRequired(valueSchema)) {
          requiredKeys.push(parsedKey);
        }
      }
      return validateAndTransformObject({
        value: parsed,
        requiredKeys,
        getProperty: (parsedKey) => {
          const property2 = schemas[parsedKey];
          if (property2 == null) {
            return void 0;
          }
          if (isProperty(property2)) {
            return {
              transformedKey: property2.rawKey,
              transform: (propertyValue) => property2.valueSchema.json(propertyValue, opts)
            };
          } else {
            return {
              transformedKey: parsedKey,
              transform: (propertyValue) => property2.json(propertyValue, opts)
            };
          }
        },
        allowUnknownKeys: opts?.allowUnknownKeys ?? false
      });
    },
    getType: () => SchemaType.OBJECT
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema),
    ...getObjectUtils(baseSchema)
  };
}
async function validateAndTransformObject({
  value,
  requiredKeys,
  getProperty,
  allowUnknownKeys
}) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  const missingRequiredKeys = new Set(requiredKeys);
  const errors = [];
  const transformed = {};
  for (const [preTransformedKey, preTransformedItemValue] of Object.entries(value)) {
    const property2 = getProperty(preTransformedKey);
    if (property2 != null) {
      missingRequiredKeys.delete(preTransformedKey);
      const value2 = await property2.transform(preTransformedItemValue);
      if (value2.ok) {
        transformed[property2.transformedKey] = value2.value;
      } else {
        errors.push(
          ...value2.errors.map((error) => ({
            path: [preTransformedKey, ...error.path],
            message: error.message
          }))
        );
      }
    } else if (allowUnknownKeys) {
      transformed[preTransformedKey] = preTransformedItemValue;
    } else {
      errors.push({
        path: [preTransformedKey],
        message: `Unrecognized key "${preTransformedKey}"`
      });
    }
  }
  errors.push(
    ...requiredKeys.filter((key) => missingRequiredKeys.has(key)).map((key) => ({
      path: [],
      message: `Missing required key "${key}"`
    }))
  );
  if (errors.length === 0) {
    return {
      ok: true,
      value: transformed
    };
  } else {
    return {
      ok: false,
      errors
    };
  }
}
function getObjectUtils(schema) {
  return {
    extend: (extension) => {
      const baseSchema = {
        _getParsedProperties: async () => [
          ...await schema._getParsedProperties(),
          ...await extension._getParsedProperties()
        ],
        _getRawProperties: async () => [
          ...await schema._getRawProperties(),
          ...await extension._getRawProperties()
        ],
        parse: async (raw, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: await extension._getRawProperties(),
            value: raw,
            transformBase: (rawBase) => schema.parse(rawBase, opts),
            transformExtension: (rawExtension) => extension.parse(rawExtension, opts)
          });
        },
        json: async (parsed, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: await extension._getParsedProperties(),
            value: parsed,
            transformBase: (parsedBase) => schema.json(parsedBase, opts),
            transformExtension: (parsedExtension) => extension.json(parsedExtension, opts)
          });
        },
        getType: () => SchemaType.OBJECT
      };
      return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
        ...getObjectLikeUtils(baseSchema),
        ...getObjectUtils(baseSchema)
      };
    }
  };
}
async function validateAndTransformExtendedObject({
  extensionKeys,
  value,
  transformBase,
  transformExtension
}) {
  const extensionPropertiesSet = new Set(extensionKeys);
  const [extensionProperties, baseProperties] = partition(
    keys(value),
    (key) => extensionPropertiesSet.has(key)
  );
  const transformedBase = await transformBase(filterObject(value, baseProperties));
  const transformedExtension = await transformExtension(filterObject(value, extensionProperties));
  if (transformedBase.ok && transformedExtension.ok) {
    return {
      ok: true,
      value: {
        ...transformedBase.value,
        ...transformedExtension.value
      }
    };
  } else {
    return {
      ok: false,
      errors: [
        ...transformedBase.ok ? [] : transformedBase.errors,
        ...transformedExtension.ok ? [] : transformedExtension.errors
      ]
    };
  }
}
async function isSchemaRequired(schema) {
  return !await isSchemaOptional(schema);
}
async function isSchemaOptional(schema) {
  switch (await schema.getType()) {
    case SchemaType.ANY:
    case SchemaType.UNKNOWN:
    case SchemaType.OPTIONAL:
      return true;
    default:
      return false;
  }
}
var init_object = __esm({
  "src/core/schemas/builders/object/object.ts"() {
    "use strict";
    init_Schema();
    init_entries();
    init_filterObject();
    init_isPlainObject();
    init_keys();
    init_partition();
    init_object_like();
    init_schema_utils();
    init_property();
  }
});

// src/core/schemas/builders/object/index.ts
var init_object2 = __esm({
  "src/core/schemas/builders/object/index.ts"() {
    "use strict";
    init_object();
    init_property();
  }
});

// src/core/schemas/builders/lazy/lazyObject.ts
function lazyObject(getter) {
  const baseSchema = {
    ...constructLazyBaseSchema(getter),
    _getRawProperties: async () => (await getMemoizedSchema(getter))._getRawProperties(),
    _getParsedProperties: async () => (await getMemoizedSchema(getter))._getParsedProperties()
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema),
    ...getObjectUtils(baseSchema)
  };
}
var init_lazyObject = __esm({
  "src/core/schemas/builders/lazy/lazyObject.ts"() {
    "use strict";
    init_object2();
    init_object_like();
    init_schema_utils();
    init_lazy();
  }
});

// src/core/schemas/builders/lazy/index.ts
var init_lazy2 = __esm({
  "src/core/schemas/builders/lazy/index.ts"() {
    "use strict";
    init_lazy();
    init_lazyObject();
  }
});

// src/core/schemas/builders/list/list.ts
function list(schema) {
  const baseSchema = {
    parse: async (raw, opts) => validateAndTransformArray(raw, (item) => schema.parse(item, opts)),
    json: (parsed, opts) => validateAndTransformArray(parsed, (item) => schema.json(item, opts)),
    getType: () => SchemaType.LIST
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
async function validateAndTransformArray(value, transformItem) {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      errors: [
        {
          message: "Not a list",
          path: []
        }
      ]
    };
  }
  const maybeValidItems = await Promise.all(value.map((item) => transformItem(item)));
  return maybeValidItems.reduce(
    (acc, item, index) => {
      if (acc.ok && item.ok) {
        return {
          ok: true,
          value: [...acc.value, item.value]
        };
      }
      const errors = [];
      if (!acc.ok) {
        errors.push(...acc.errors);
      }
      if (!item.ok) {
        errors.push(
          ...item.errors.map((error) => ({
            path: [`[${index}]`, ...error.path],
            message: error.message
          }))
        );
      }
      return {
        ok: false,
        errors
      };
    },
    { ok: true, value: [] }
  );
}
var init_list = __esm({
  "src/core/schemas/builders/list/list.ts"() {
    "use strict";
    init_Schema();
    init_schema_utils();
  }
});

// src/core/schemas/builders/list/index.ts
var init_list2 = __esm({
  "src/core/schemas/builders/list/index.ts"() {
    "use strict";
    init_list();
  }
});

// src/core/schemas/builders/literals/stringLiteral.ts
function stringLiteral(literal) {
  const schemaCreator = createIdentitySchemaCreator(SchemaType.STRING_LITERAL, (value) => {
    if (value === literal) {
      return {
        ok: true,
        value: literal
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [],
            message: `Not equal to "${literal}"`
          }
        ]
      };
    }
  });
  return schemaCreator();
}
var init_stringLiteral = __esm({
  "src/core/schemas/builders/literals/stringLiteral.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
  }
});

// src/core/schemas/builders/literals/index.ts
var init_literals = __esm({
  "src/core/schemas/builders/literals/index.ts"() {
    "use strict";
    init_stringLiteral();
  }
});

// src/core/schemas/builders/primitives/any.ts
var any;
var init_any = __esm({
  "src/core/schemas/builders/primitives/any.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    any = createIdentitySchemaCreator(SchemaType.ANY, (value) => ({ ok: true, value }));
  }
});

// src/core/schemas/builders/primitives/boolean.ts
var boolean;
var init_boolean = __esm({
  "src/core/schemas/builders/primitives/boolean.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    boolean = createIdentitySchemaCreator(SchemaType.BOOLEAN, (value) => {
      if (typeof value === "boolean") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a boolean"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/number.ts
var number;
var init_number = __esm({
  "src/core/schemas/builders/primitives/number.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    number = createIdentitySchemaCreator(SchemaType.NUMBER, (value) => {
      if (typeof value === "number") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a number"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/string.ts
var string;
var init_string = __esm({
  "src/core/schemas/builders/primitives/string.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    string = createIdentitySchemaCreator(SchemaType.STRING, (value) => {
      if (typeof value === "string") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a string"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/unknown.ts
var unknown;
var init_unknown = __esm({
  "src/core/schemas/builders/primitives/unknown.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    unknown = createIdentitySchemaCreator(SchemaType.UNKNOWN, (value) => ({ ok: true, value }));
  }
});

// src/core/schemas/builders/primitives/index.ts
var init_primitives = __esm({
  "src/core/schemas/builders/primitives/index.ts"() {
    "use strict";
    init_any();
    init_boolean();
    init_number();
    init_string();
    init_unknown();
  }
});

// src/core/schemas/builders/record/record.ts
function record(keySchema, valueSchema) {
  const baseSchema = {
    parse: async (raw, opts) => {
      return validateAndTransformRecord({
        value: raw,
        isKeyNumeric: await keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => keySchema.parse(key, opts),
        transformValue: (value) => valueSchema.parse(value, opts)
      });
    },
    json: async (parsed, opts) => {
      return validateAndTransformRecord({
        value: parsed,
        isKeyNumeric: await keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => keySchema.json(key, opts),
        transformValue: (value) => valueSchema.json(value, opts)
      });
    },
    getType: () => SchemaType.RECORD
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
async function validateAndTransformRecord({
  value,
  isKeyNumeric,
  transformKey,
  transformValue
}) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  return entries(value).reduce(
    async (accPromise, [stringKey, value2]) => {
      if (value2 == null) {
        return accPromise;
      }
      const acc = await accPromise;
      let key = stringKey;
      if (isKeyNumeric) {
        const numberKey = stringKey.length > 0 ? Number(stringKey) : NaN;
        if (!isNaN(numberKey)) {
          key = numberKey;
        }
      }
      const transformedKey = await transformKey(key);
      const transformedValue = await transformValue(value2);
      if (acc.ok && transformedKey.ok && transformedValue.ok) {
        return {
          ok: true,
          value: {
            ...acc.value,
            [transformedKey.value]: transformedValue.value
          }
        };
      }
      const errors = [];
      if (!acc.ok) {
        errors.push(...acc.errors);
      }
      if (!transformedKey.ok) {
        errors.push(
          ...transformedKey.errors.map((error) => ({
            path: [`${key} (key)`, ...error.path],
            message: error.message
          }))
        );
      }
      if (!transformedValue.ok) {
        errors.push(
          ...transformedValue.errors.map((error) => ({
            path: [stringKey, ...error.path],
            message: error.message
          }))
        );
      }
      return {
        ok: false,
        errors
      };
    },
    Promise.resolve({ ok: true, value: {} })
  );
}
var init_record = __esm({
  "src/core/schemas/builders/record/record.ts"() {
    "use strict";
    init_Schema();
    init_entries();
    init_isPlainObject();
    init_schema_utils();
  }
});

// src/core/schemas/builders/record/index.ts
var init_record2 = __esm({
  "src/core/schemas/builders/record/index.ts"() {
    "use strict";
    init_record();
  }
});

// src/core/schemas/builders/set/set.ts
function set(schema) {
  const listSchema = list(schema);
  const baseSchema = {
    parse: async (raw, opts) => {
      const parsedList = await listSchema.parse(raw, opts);
      if (parsedList.ok) {
        return {
          ok: true,
          value: new Set(parsedList.value)
        };
      } else {
        return parsedList;
      }
    },
    json: async (parsed, opts) => {
      if (!(parsed instanceof Set)) {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a Set"
            }
          ]
        };
      }
      const jsonList = await listSchema.json([...parsed], opts);
      return jsonList;
    },
    getType: () => SchemaType.SET
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var init_set = __esm({
  "src/core/schemas/builders/set/set.ts"() {
    "use strict";
    init_Schema();
    init_list2();
    init_schema_utils();
  }
});

// src/core/schemas/builders/set/index.ts
var init_set2 = __esm({
  "src/core/schemas/builders/set/index.ts"() {
    "use strict";
    init_set();
  }
});

// src/core/schemas/builders/union/discriminant.ts
function discriminant(parsedDiscriminant, rawDiscriminant) {
  return {
    parsedDiscriminant,
    rawDiscriminant
  };
}
var init_discriminant = __esm({
  "src/core/schemas/builders/union/discriminant.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/union/union.ts
function union(discriminant2, union2) {
  const rawDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.rawDiscriminant;
  const parsedDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.parsedDiscriminant;
  const discriminantValueSchema = enum_(keys(union2));
  const baseSchema = {
    parse: async (raw, opts) => {
      return transformAndValidateUnion(
        raw,
        rawDiscriminant,
        parsedDiscriminant,
        (discriminantValue) => discriminantValueSchema.parse(discriminantValue, opts),
        (discriminantValue) => union2[discriminantValue],
        opts?.allowUnknownKeys ?? false,
        (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.parse(additionalProperties, opts)
      );
    },
    json: async (parsed, opts) => {
      return transformAndValidateUnion(
        parsed,
        parsedDiscriminant,
        rawDiscriminant,
        (discriminantValue) => discriminantValueSchema.json(discriminantValue, opts),
        (discriminantValue) => union2[discriminantValue],
        opts?.allowUnknownKeys ?? false,
        (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.json(additionalProperties, opts)
      );
    },
    getType: () => SchemaType.UNION
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema)
  };
}
async function transformAndValidateUnion(value, discriminant2, transformedDiscriminant, transformDiscriminantValue, getAdditionalPropertiesSchema, allowUnknownKeys, transformAdditionalProperties) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  const { [discriminant2]: discriminantValue, ...additionalProperties } = value;
  if (discriminantValue == null) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: `Missing discriminant ("${discriminant2}")`
        }
      ]
    };
  }
  const transformedDiscriminantValue = await transformDiscriminantValue(discriminantValue);
  if (!transformedDiscriminantValue.ok) {
    return {
      ok: false,
      errors: transformedDiscriminantValue.errors.map((error) => ({
        path: [discriminant2, ...error.path],
        message: error.message
      }))
    };
  }
  const additionalPropertiesSchema = getAdditionalPropertiesSchema(transformedDiscriminantValue.value);
  if (additionalPropertiesSchema == null) {
    if (allowUnknownKeys) {
      return {
        ok: true,
        value: {
          [transformedDiscriminant]: transformedDiscriminantValue.value,
          ...additionalProperties
        }
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [discriminant2],
            message: "Unrecognized discriminant value"
          }
        ]
      };
    }
  }
  const transformedAdditionalProperties = await transformAdditionalProperties(
    additionalProperties,
    additionalPropertiesSchema
  );
  if (!transformedAdditionalProperties.ok) {
    return transformedAdditionalProperties;
  }
  return {
    ok: true,
    value: {
      [transformedDiscriminant]: discriminantValue,
      ...transformedAdditionalProperties.value
    }
  };
}
var init_union = __esm({
  "src/core/schemas/builders/union/union.ts"() {
    "use strict";
    init_Schema();
    init_isPlainObject();
    init_keys();
    init_enum2();
    init_object_like();
    init_schema_utils();
  }
});

// src/core/schemas/builders/union/index.ts
var init_union2 = __esm({
  "src/core/schemas/builders/union/index.ts"() {
    "use strict";
    init_discriminant();
    init_union();
  }
});

// src/core/schemas/builders/index.ts
var init_builders = __esm({
  "src/core/schemas/builders/index.ts"() {
    "use strict";
    init_date2();
    init_enum2();
    init_lazy2();
    init_list2();
    init_literals();
    init_object2();
    init_object_like();
    init_primitives();
    init_record2();
    init_schema_utils();
    init_set2();
    init_union2();
  }
});

// src/core/schemas/index.ts
var schemas_exports = {};
__export(schemas_exports, {
  JsonError: () => JsonError,
  ParseError: () => ParseError,
  any: () => any,
  boolean: () => boolean,
  date: () => date,
  discriminant: () => discriminant,
  enum_: () => enum_,
  getObjectLikeUtils: () => getObjectLikeUtils,
  getObjectUtils: () => getObjectUtils,
  getSchemaUtils: () => getSchemaUtils,
  isProperty: () => isProperty,
  lazy: () => lazy,
  lazyObject: () => lazyObject,
  list: () => list,
  number: () => number,
  object: () => object,
  optional: () => optional,
  property: () => property,
  record: () => record,
  set: () => set,
  string: () => string,
  stringLiteral: () => stringLiteral,
  transform: () => transform,
  union: () => union,
  unknown: () => unknown,
  withParsedProperties: () => withParsedProperties
});
var init_schemas = __esm({
  "src/core/schemas/index.ts"() {
    "use strict";
    init_builders();
    init_Schema();
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer2.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b)
        return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string2, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string2, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string2, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array))
        a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array))
        b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b)
        return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list2, length) {
      if (!Array.isArray(list2)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list2.length === 0) {
        return Buffer2.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list2.length; ++i) {
          length += list2[i].length;
        }
      }
      const buffer = Buffer2.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list2.length; ++i) {
        let buf = list2[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer2.isBuffer(buf))
              buf = Buffer2.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string2, encoding) {
      if (Buffer2.isBuffer(string2)) {
        return string2.length;
      }
      if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
        return string2.byteLength;
      }
      if (typeof string2 !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
        );
      }
      const len = string2.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0)
        return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string2).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string2).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max)
        str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i;
            if (i - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found)
            return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string2, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string2.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string2.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string2, offset, length) {
      return blitBuffer(utf8ToBytes(string2, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string2, offset, length) {
      return blitBuffer(asciiToBytes(string2), buf, offset, length);
    }
    function base64Write(buf, string2, offset, length) {
      return blitBuffer(base64ToBytes(string2), buf, offset, length);
    }
    function ucs2Write(buf, string2, offset, length) {
      return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string2, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string2, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string2, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string2, offset, length);
          case "base64":
            return base64Write(this, string2, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string2, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target))
        throw new TypeError("argument should be a Buffer");
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("Index out of range");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string2, units) {
      units = units || Infinity;
      let codePoint;
      const length = string2.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string2.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length)
          break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = require_buffer();
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/basic-auth/index.js
var require_basic_auth = __commonJS({
  "node_modules/basic-auth/index.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    module.exports = auth;
    module.exports.parse = parse2;
    var CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
    var USER_PASS_REGEXP = /^([^:]*):(.*)$/;
    function auth(req) {
      if (!req) {
        throw new TypeError("argument req is required");
      }
      if (typeof req !== "object") {
        throw new TypeError("argument req is required to be an object");
      }
      var header = getAuthorization(req);
      return parse2(header);
    }
    function decodeBase64(str) {
      return Buffer2.from(str, "base64").toString();
    }
    function getAuthorization(req) {
      if (!req.headers || typeof req.headers !== "object") {
        throw new TypeError("argument req is required to have headers property");
      }
      return req.headers.authorization;
    }
    function parse2(string2) {
      if (typeof string2 !== "string") {
        return void 0;
      }
      var match = CREDENTIALS_REGEXP.exec(string2);
      if (!match) {
        return void 0;
      }
      var userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]));
      if (!userPass) {
        return void 0;
      }
      return new Credentials(userPass[1], userPass[2]);
    }
    function Credentials(name, pass) {
      this.name = name;
      this.pass = pass;
    }
  }
});

// src/core/auth/BasicAuth.ts
var import_basic_auth;
var init_BasicAuth = __esm({
  "src/core/auth/BasicAuth.ts"() {
    "use strict";
    import_basic_auth = __toESM(require_basic_auth());
  }
});

// src/core/auth/BearerToken.ts
var BEARER_AUTH_HEADER_PREFIX, BearerToken;
var init_BearerToken = __esm({
  "src/core/auth/BearerToken.ts"() {
    "use strict";
    BEARER_AUTH_HEADER_PREFIX = /^Bearer /i;
    BearerToken = {
      toAuthorizationHeader: (token) => {
        if (token == null) {
          return void 0;
        }
        return `Bearer ${token}`;
      },
      fromAuthorizationHeader: (header) => {
        return header.replace(BEARER_AUTH_HEADER_PREFIX, "").trim();
      }
    };
  }
});

// src/core/auth/index.ts
var init_auth = __esm({
  "src/core/auth/index.ts"() {
    "use strict";
    init_BasicAuth();
    init_BearerToken();
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module) {
    "use strict";
    module.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    var kindOf = function(cache) {
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    }(/* @__PURE__ */ Object.create(null));
    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }
    function isArray(val) {
      return Array.isArray(val);
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    var isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject2(val) {
      if (kindOf(val) !== "object") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    var isDate = kindOfTest("Date");
    var isFile = kindOfTest("File");
    var isBlob = kindOfTest("Blob");
    var isFileList = kindOfTest("FileList");
    function isFunction(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isFormData(thing) {
      var pattern = "[object FormData]";
      return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
    }
    var isURLSearchParams = kindOfTest("URLSearchParams");
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject2(result[key]) && isPlainObject2(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject2(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }
    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};
      destObj = destObj || {};
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    }
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
    function toArray(thing) {
      if (!thing)
        return null;
      var i = thing.length;
      if (isUndefined(i))
        return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }
    var isTypedArray = function(TypedArray) {
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
    module.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject: isPlainObject2,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      isTypedArray,
      isFileList
    };
  }
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/axios/lib/core/AxiosError.js
var require_AxiosError = __commonJS({
  "node_modules/axios/lib/core/AxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function AxiosError2(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }
    utils.inherits(AxiosError2, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });
    var prototype = AxiosError2.prototype;
    var descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED"
      // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError2, descriptors);
    Object.defineProperty(prototype, "isAxiosError", { value: true });
    AxiosError2.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);
      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });
      AxiosError2.call(axiosError, error.message, code, config, request, response);
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    module.exports = AxiosError2;
  }
});

// node_modules/axios/lib/defaults/transitional.js
var require_transitional = __commonJS({
  "node_modules/axios/lib/defaults/transitional.js"(exports, module) {
    "use strict";
    module.exports = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
  }
});

// node_modules/axios/lib/helpers/toFormData.js
var require_toFormData = __commonJS({
  "node_modules/axios/lib/helpers/toFormData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function toFormData(obj, formData) {
      formData = formData || new FormData();
      var stack = [];
      function convertValue(value) {
        if (value === null)
          return "";
        if (utils.isDate(value)) {
          return value.toISOString();
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
        }
        return value;
      }
      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error("Circular reference detected in " + parentKey);
          }
          stack.push(data);
          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value))
              return;
            var fullKey = parentKey ? parentKey + "." + key : key;
            var arr;
            if (value && !parentKey && typeof value === "object") {
              if (utils.endsWith(key, "{}")) {
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, "[]") && (arr = utils.toArray(value))) {
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }
            build(value, fullKey);
          });
          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }
      build(obj);
      return formData;
    }
    module.exports = toFormData;
  }
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module) {
    "use strict";
    var AxiosError2 = require_AxiosError();
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError2(
          "Request failed with status code " + response.status,
          [AxiosError2.ERR_BAD_REQUEST, AxiosError2.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
    "use strict";
    module.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
    "use strict";
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i = line.indexOf(":");
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});

// node_modules/axios/lib/cancel/CanceledError.js
var require_CanceledError = __commonJS({
  "node_modules/axios/lib/cancel/CanceledError.js"(exports, module) {
    "use strict";
    var AxiosError2 = require_AxiosError();
    var utils = require_utils();
    function CanceledError(message) {
      AxiosError2.call(this, message == null ? "canceled" : message, AxiosError2.ERR_CANCELED);
      this.name = "CanceledError";
    }
    utils.inherits(CanceledError, AxiosError2, {
      __CANCEL__: true
    });
    module.exports = CanceledError;
  }
});

// node_modules/axios/lib/helpers/parseProtocol.js
var require_parseProtocol = __commonJS({
  "node_modules/axios/lib/helpers/parseProtocol.js"(exports, module) {
    "use strict";
    module.exports = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
  }
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var transitionalDefaults = require_transitional();
    var AxiosError2 = require_AxiosError();
    var CanceledError = require_CanceledError();
    var parseProtocol = require_parseProtocol();
    module.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError2("Request aborted", AxiosError2.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(new AxiosError2("Network Error", AxiosError2.ERR_NETWORK, config, request, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError2(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError2.ETIMEDOUT : AxiosError2.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new CanceledError() : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        var protocol = parseProtocol(fullPath);
        if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
          reject(new AxiosError2("Unsupported protocol " + protocol + ":", AxiosError2.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/axios/lib/helpers/null.js
var require_null = __commonJS({
  "node_modules/axios/lib/helpers/null.js"(exports, module) {
    module.exports = null;
  }
});

// node_modules/axios/lib/defaults/index.js
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults/index.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var AxiosError2 = require_AxiosError();
    var transitionalDefaults = require_transitional();
    var toFormData = require_toFormData();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_xhr();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: transitionalDefaults,
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers["Content-Type"];
        var isFileList;
        if ((isFileList = utils.isFileList(data)) || isObjectPayload && contentType === "multipart/form-data") {
          var _FormData = this.env && this.env.FormData;
          return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError2.from(e, AxiosError2.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data;
      }],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: require_null()
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var defaults = require_defaults();
    module.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform2(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
    "use strict";
    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    var CanceledError = require_CanceledError();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError();
      }
    }
    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );
      utils.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "beforeRedirect": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module) {
    module.exports = {
      "version": "0.27.2"
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module) {
    "use strict";
    var VERSION = require_data().version;
    var AxiosError2 = require_AxiosError();
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError2(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError2.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError2("options must be an object", AxiosError2.ERR_BAD_OPTION_VALUE);
      }
      var keys2 = Object.keys(options);
      var i = keys2.length;
      while (i-- > 0) {
        var opt = keys2[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError2("option " + opt + " must be " + result, AxiosError2.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError2("Unknown option " + opt, AxiosError2.ERR_BAD_OPTION);
        }
      }
    }
    module.exports = {
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var buildFullPath = require_buildFullPath();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    module.exports = Axios;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
    "use strict";
    var CanceledError = require_CanceledError();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    module.exports = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports, module) {
    "use strict";
    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance(defaults);
    axios2.Axios = Axios;
    axios2.CanceledError = require_CanceledError();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.toFormData = require_toFormData();
    axios2.AxiosError = require_AxiosError();
    axios2.Cancel = axios2.CanceledError;
    axios2.all = function all(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module.exports = axios2;
    module.exports.default = axios2;
  }
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module) {
    module.exports = require_axios();
  }
});

// src/core/fetcher/Fetcher.ts
var import_axios, fetcher;
var init_Fetcher = __esm({
  "src/core/fetcher/Fetcher.ts"() {
    "use strict";
    import_axios = __toESM(require_axios2());
    fetcher = async (args) => {
      const headers = {
        "Content-Type": "application/json"
      };
      if (args.headers != null) {
        for (const [key, value] of Object.entries(args.headers)) {
          if (value != null) {
            headers[key] = value;
          }
        }
      }
      try {
        const response = await (0, import_axios.default)({
          url: args.url,
          params: args.queryParameters,
          method: args.method,
          headers,
          data: args.body,
          validateStatus: () => true,
          transformResponse: (response2) => response2,
          timeout: args.timeoutMs ?? 6e4,
          transitional: {
            clarifyTimeoutError: true
          },
          withCredentials: args.withCredentials
        });
        let body;
        if (response.data != null && response.data.length > 0) {
          try {
            body = JSON.parse(response.data) ?? void 0;
          } catch {
            return {
              ok: false,
              error: {
                reason: "non-json",
                statusCode: response.status,
                rawBody: response.data
              }
            };
          }
        }
        if (response.status >= 200 && response.status < 300) {
          return {
            ok: true,
            body
          };
        } else {
          return {
            ok: false,
            error: {
              reason: "status-code",
              statusCode: response.status,
              body
            }
          };
        }
      } catch (error) {
        if (error.code === "ETIMEDOUT") {
          return {
            ok: false,
            error: {
              reason: "timeout"
            }
          };
        }
        return {
          ok: false,
          error: {
            reason: "unknown",
            errorMessage: error.message
          }
        };
      }
    };
  }
});

// src/core/fetcher/Supplier.ts
var Supplier;
var init_Supplier = __esm({
  "src/core/fetcher/Supplier.ts"() {
    "use strict";
    Supplier = {
      get: async (supplier) => {
        if (typeof supplier === "function") {
          return supplier();
        } else {
          return supplier;
        }
      }
    };
  }
});

// src/core/fetcher/index.ts
var init_fetcher = __esm({
  "src/core/fetcher/index.ts"() {
    "use strict";
    init_Fetcher();
    init_Supplier();
  }
});

// src/core/index.ts
var init_core = __esm({
  "src/core/index.ts"() {
    "use strict";
    init_schemas();
    init_auth();
    init_fetcher();
  }
});

// node_modules/url-join/lib/url-join.js
var require_url_join = __commonJS({
  "node_modules/url-join/lib/url-join.js"(exports, module) {
    (function(name, context, definition) {
      if (typeof module !== "undefined" && module.exports)
        module.exports = definition();
      else if (typeof define === "function" && define.amd)
        define(definition);
      else
        context[name] = definition();
    })("urljoin", exports, function() {
      function normalize(strArray) {
        var resultArray = [];
        if (strArray.length === 0) {
          return "";
        }
        if (typeof strArray[0] !== "string") {
          throw new TypeError("Url must be a string. Received " + strArray[0]);
        }
        if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
          var first = strArray.shift();
          strArray[0] = first + strArray[0];
        }
        if (strArray[0].match(/^file:\/\/\//)) {
          strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
        } else {
          strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
        }
        for (var i = 0; i < strArray.length; i++) {
          var component = strArray[i];
          if (typeof component !== "string") {
            throw new TypeError("Url must be a string. Received " + component);
          }
          if (component === "") {
            continue;
          }
          if (i > 0) {
            component = component.replace(/^[\/]+/, "");
          }
          if (i < strArray.length - 1) {
            component = component.replace(/[\/]+$/, "");
          } else {
            component = component.replace(/[\/]+$/, "/");
          }
          resultArray.push(component);
        }
        var str = resultArray.join("/");
        str = str.replace(/\/(\?|&|#[^!])/g, "$1");
        var parts = str.split("?");
        str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
        return str;
      }
      return function() {
        var input;
        if (typeof arguments[0] === "object") {
          input = arguments[0];
        } else {
          input = [].slice.call(arguments);
        }
        return normalize(input);
      };
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/Config.ts
var Config;
var init_Config = __esm({
  "src/serialization/resources/captcha/resources/config/types/Config.ts"() {
    "use strict";
    init_core();
    Config = schemas_exports.object({
      hcaptcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.ConfigHcaptcha).optional(),
      turnstile: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.ConfigTurnstile).optional()
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/ConfigHcaptcha.ts
var ConfigHcaptcha;
var init_ConfigHcaptcha = __esm({
  "src/serialization/resources/captcha/resources/config/types/ConfigHcaptcha.ts"() {
    "use strict";
    init_core();
    ConfigHcaptcha = schemas_exports.object({
      clientResponse: schemas_exports.property("client_response", schemas_exports.string())
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/ConfigTurnstile.ts
var ConfigTurnstile;
var init_ConfigTurnstile = __esm({
  "src/serialization/resources/captcha/resources/config/types/ConfigTurnstile.ts"() {
    "use strict";
    init_core();
    ConfigTurnstile = schemas_exports.object({
      clientResponse: schemas_exports.property("client_response", schemas_exports.string())
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/index.ts
var init_types = __esm({
  "src/serialization/resources/captcha/resources/config/types/index.ts"() {
    "use strict";
    init_Config();
    init_ConfigHcaptcha();
    init_ConfigTurnstile();
  }
});

// src/serialization/resources/captcha/resources/config/index.ts
var config_exports2 = {};
__export(config_exports2, {
  Config: () => Config,
  ConfigHcaptcha: () => ConfigHcaptcha,
  ConfigTurnstile: () => ConfigTurnstile
});
var init_config = __esm({
  "src/serialization/resources/captcha/resources/config/index.ts"() {
    "use strict";
    init_types();
  }
});

// src/serialization/resources/captcha/resources/index.ts
var init_resources = __esm({
  "src/serialization/resources/captcha/resources/index.ts"() {
    "use strict";
    init_config();
    init_types();
  }
});

// src/serialization/resources/captcha/index.ts
var captcha_exports2 = {};
__export(captcha_exports2, {
  Config: () => Config,
  ConfigHcaptcha: () => ConfigHcaptcha,
  ConfigTurnstile: () => ConfigTurnstile,
  config: () => config_exports2
});
var init_captcha = __esm({
  "src/serialization/resources/captcha/index.ts"() {
    "use strict";
    init_resources();
  }
});

// src/serialization/resources/chat/resources/common/types/SendTopic.ts
var SendTopic;
var init_SendTopic = __esm({
  "src/serialization/resources/chat/resources/common/types/SendTopic.ts"() {
    "use strict";
    init_core();
    SendTopic = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
      groupId: schemas_exports.property("group_id", schemas_exports.string().optional()),
      partyId: schemas_exports.property("party_id", schemas_exports.string().optional()),
      identityId: schemas_exports.property("identity_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBody.ts
var SendMessageBody;
var init_SendMessageBody = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBody.ts"() {
    "use strict";
    init_core();
    SendMessageBody = schemas_exports.object({
      text: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBodyText).optional(),
      partyInvite: schemas_exports.property(
        "party_invite",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBodyPartyInvite).optional()
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBodyText.ts
var SendMessageBodyText;
var init_SendMessageBodyText = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBodyText.ts"() {
    "use strict";
    init_core();
    SendMessageBodyText = schemas_exports.object({
      body: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBodyPartyInvite.ts
var SendMessageBodyPartyInvite;
var init_SendMessageBodyPartyInvite = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBodyPartyInvite.ts"() {
    "use strict";
    init_core();
    SendMessageBodyPartyInvite = schemas_exports.object({
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/QueryDirection.ts
var QueryDirection2;
var init_QueryDirection = __esm({
  "src/serialization/resources/chat/resources/common/types/QueryDirection.ts"() {
    "use strict";
    init_core();
    QueryDirection2 = schemas_exports.enum_(["before", "after", "before_and_after"]);
  }
});

// src/serialization/resources/chat/resources/common/types/Thread.ts
var Thread;
var init_Thread = __esm({
  "src/serialization/resources/chat/resources/common/types/Thread.ts"() {
    "use strict";
    init_core();
    Thread = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      createTs: schemas_exports.property(
        "create_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Topic),
      tailMessage: schemas_exports.property(
        "tail_message",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message).optional()
      ),
      lastReadTs: schemas_exports.property(
        "last_read_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      unreadCount: schemas_exports.property("unread_count", schemas_exports.number()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.ThreadExternalLinks)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/Message.ts
var Message;
var init_Message = __esm({
  "src/serialization/resources/chat/resources/common/types/Message.ts"() {
    "use strict";
    init_core();
    Message = schemas_exports.object({
      chatMessageId: schemas_exports.property("chat_message_id", schemas_exports.string()),
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      sendTs: schemas_exports.property(
        "send_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/Topic.ts
var Topic;
var init_Topic = __esm({
  "src/serialization/resources/chat/resources/common/types/Topic.ts"() {
    "use strict";
    init_core();
    Topic = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicGroup).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicParty).optional(),
      direct: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicDirect).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicGroup.ts
var TopicGroup;
var init_TopicGroup = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicGroup.ts"() {
    "use strict";
    init_core();
    TopicGroup = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicParty.ts
var TopicParty;
var init_TopicParty = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicParty.ts"() {
    "use strict";
    init_core();
    TopicParty = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicDirect.ts
var TopicDirect;
var init_TopicDirect = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicDirect.ts"() {
    "use strict";
    init_core();
    TopicDirect = schemas_exports.object({
      identityA: schemas_exports.property(
        "identity_a",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      identityB: schemas_exports.property(
        "identity_b",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopic.ts
var SimpleTopic;
var init_SimpleTopic = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopic.ts"() {
    "use strict";
    init_core();
    SimpleTopic = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicGroup).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicParty).optional(),
      direct: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicDirect).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicGroup.ts
var SimpleTopicGroup;
var init_SimpleTopicGroup = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicGroup.ts"() {
    "use strict";
    init_core();
    SimpleTopicGroup = schemas_exports.object({
      group: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicParty.ts
var SimpleTopicParty;
var init_SimpleTopicParty = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicParty.ts"() {
    "use strict";
    init_core();
    SimpleTopicParty = schemas_exports.object({
      party: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicDirect.ts
var SimpleTopicDirect;
var init_SimpleTopicDirect = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicDirect.ts"() {
    "use strict";
    init_core();
    SimpleTopicDirect = schemas_exports.object({
      identityA: schemas_exports.property("identity_a", schemas_exports.string()),
      identityB: schemas_exports.property("identity_b", schemas_exports.string())
    });
  }
});

// src/serialization/resources/chat/resources/common/types/ThreadExternalLinks.ts
var ThreadExternalLinks;
var init_ThreadExternalLinks = __esm({
  "src/serialization/resources/chat/resources/common/types/ThreadExternalLinks.ts"() {
    "use strict";
    init_core();
    ThreadExternalLinks = schemas_exports.object({
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TypingStatus.ts
var TypingStatus;
var init_TypingStatus = __esm({
  "src/serialization/resources/chat/resources/common/types/TypingStatus.ts"() {
    "use strict";
    init_core();
    TypingStatus = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      typing: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/IdentityTypingStatus.ts
var IdentityTypingStatus;
var init_IdentityTypingStatus = __esm({
  "src/serialization/resources/chat/resources/common/types/IdentityTypingStatus.ts"() {
    "use strict";
    init_core();
    IdentityTypingStatus = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TypingStatus)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/index.ts
var init_types2 = __esm({
  "src/serialization/resources/chat/resources/common/types/index.ts"() {
    "use strict";
    init_SendTopic();
    init_SendMessageBody();
    init_SendMessageBodyText();
    init_SendMessageBodyPartyInvite();
    init_QueryDirection();
    init_Thread();
    init_Message();
    init_Topic();
    init_TopicGroup();
    init_TopicParty();
    init_TopicDirect();
    init_SimpleTopic();
    init_SimpleTopicGroup();
    init_SimpleTopicParty();
    init_SimpleTopicDirect();
    init_ThreadExternalLinks();
    init_TypingStatus();
    init_IdentityTypingStatus();
  }
});

// src/serialization/resources/chat/resources/common/index.ts
var common_exports13 = {};
__export(common_exports13, {
  IdentityTypingStatus: () => IdentityTypingStatus,
  Message: () => Message,
  QueryDirection: () => QueryDirection2,
  SendMessageBody: () => SendMessageBody,
  SendMessageBodyPartyInvite: () => SendMessageBodyPartyInvite,
  SendMessageBodyText: () => SendMessageBodyText,
  SendTopic: () => SendTopic,
  SimpleTopic: () => SimpleTopic,
  SimpleTopicDirect: () => SimpleTopicDirect,
  SimpleTopicGroup: () => SimpleTopicGroup,
  SimpleTopicParty: () => SimpleTopicParty,
  Thread: () => Thread,
  ThreadExternalLinks: () => ThreadExternalLinks,
  Topic: () => Topic,
  TopicDirect: () => TopicDirect,
  TopicGroup: () => TopicGroup,
  TopicParty: () => TopicParty,
  TypingStatus: () => TypingStatus
});
var init_common = __esm({
  "src/serialization/resources/chat/resources/common/index.ts"() {
    "use strict";
    init_types2();
  }
});

// src/serialization/resources/chat/resources/identity/types/GetDirectThreadOutput.ts
var GetDirectThreadOutput;
var init_GetDirectThreadOutput = __esm({
  "src/serialization/resources/chat/resources/identity/types/GetDirectThreadOutput.ts"() {
    "use strict";
    init_core();
    GetDirectThreadOutput = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle).optional()
    });
  }
});

// src/serialization/resources/chat/resources/identity/types/index.ts
var init_types3 = __esm({
  "src/serialization/resources/chat/resources/identity/types/index.ts"() {
    "use strict";
    init_GetDirectThreadOutput();
  }
});

// src/serialization/resources/chat/resources/identity/index.ts
var identity_exports4 = {};
__export(identity_exports4, {
  GetDirectThreadOutput: () => GetDirectThreadOutput
});
var init_identity = __esm({
  "src/serialization/resources/chat/resources/identity/index.ts"() {
    "use strict";
    init_types3();
  }
});

// src/serialization/resources/chat/resources/index.ts
var init_resources2 = __esm({
  "src/serialization/resources/chat/resources/index.ts"() {
    "use strict";
    init_common();
    init_types2();
    init_identity();
    init_types3();
  }
});

// src/serialization/resources/chat/types/SendMessageInput.ts
var SendMessageInput;
var init_SendMessageInput = __esm({
  "src/serialization/resources/chat/types/SendMessageInput.ts"() {
    "use strict";
    init_core();
    SendMessageInput = schemas_exports.object({
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendTopic),
      messageBody: schemas_exports.property(
        "message_body",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBody)
      )
    });
  }
});

// src/serialization/resources/chat/types/SendMessageOutput.ts
var SendMessageOutput;
var init_SendMessageOutput = __esm({
  "src/serialization/resources/chat/types/SendMessageOutput.ts"() {
    "use strict";
    init_core();
    SendMessageOutput = schemas_exports.object({
      chatMessageId: schemas_exports.property("chat_message_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/chat/types/GetThreadHistoryOutput.ts
var GetThreadHistoryOutput;
var init_GetThreadHistoryOutput = __esm({
  "src/serialization/resources/chat/types/GetThreadHistoryOutput.ts"() {
    "use strict";
    init_core();
    GetThreadHistoryOutput = schemas_exports.object({
      chatMessages: schemas_exports.property(
        "chat_messages",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message))
      )
    });
  }
});

// src/serialization/resources/chat/types/WatchThreadOutput.ts
var WatchThreadOutput;
var init_WatchThreadOutput = __esm({
  "src/serialization/resources/chat/types/WatchThreadOutput.ts"() {
    "use strict";
    init_core();
    WatchThreadOutput = schemas_exports.object({
      chatMessages: schemas_exports.property(
        "chat_messages",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message))
      ),
      typingStatuses: schemas_exports.property(
        "typing_statuses",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.IdentityTypingStatus)).optional()
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/chat/types/SetThreadReadInput.ts
var SetThreadReadInput;
var init_SetThreadReadInput = __esm({
  "src/serialization/resources/chat/types/SetThreadReadInput.ts"() {
    "use strict";
    init_core();
    SetThreadReadInput = schemas_exports.object({
      lastReadTs: schemas_exports.property("last_read_ts", schemas_exports.string())
    });
  }
});

// src/serialization/resources/chat/types/GetThreadTopicOutput.ts
var GetThreadTopicOutput;
var init_GetThreadTopicOutput = __esm({
  "src/serialization/resources/chat/types/GetThreadTopicOutput.ts"() {
    "use strict";
    init_core();
    GetThreadTopicOutput = schemas_exports.object({
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopic)
    });
  }
});

// src/serialization/resources/chat/types/SetTypingStatusInput.ts
var SetTypingStatusInput;
var init_SetTypingStatusInput = __esm({
  "src/serialization/resources/chat/types/SetTypingStatusInput.ts"() {
    "use strict";
    init_core();
    SetTypingStatusInput = schemas_exports.object({
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TypingStatus)
    });
  }
});

// src/serialization/resources/chat/types/index.ts
var init_types4 = __esm({
  "src/serialization/resources/chat/types/index.ts"() {
    "use strict";
    init_SendMessageInput();
    init_SendMessageOutput();
    init_GetThreadHistoryOutput();
    init_WatchThreadOutput();
    init_SetThreadReadInput();
    init_GetThreadTopicOutput();
    init_SetTypingStatusInput();
  }
});

// src/serialization/resources/chat/index.ts
var chat_exports2 = {};
__export(chat_exports2, {
  GetDirectThreadOutput: () => GetDirectThreadOutput,
  GetThreadHistoryOutput: () => GetThreadHistoryOutput,
  GetThreadTopicOutput: () => GetThreadTopicOutput,
  IdentityTypingStatus: () => IdentityTypingStatus,
  Message: () => Message,
  QueryDirection: () => QueryDirection2,
  SendMessageBody: () => SendMessageBody,
  SendMessageBodyPartyInvite: () => SendMessageBodyPartyInvite,
  SendMessageBodyText: () => SendMessageBodyText,
  SendMessageInput: () => SendMessageInput,
  SendMessageOutput: () => SendMessageOutput,
  SendTopic: () => SendTopic,
  SetThreadReadInput: () => SetThreadReadInput,
  SetTypingStatusInput: () => SetTypingStatusInput,
  SimpleTopic: () => SimpleTopic,
  SimpleTopicDirect: () => SimpleTopicDirect,
  SimpleTopicGroup: () => SimpleTopicGroup,
  SimpleTopicParty: () => SimpleTopicParty,
  Thread: () => Thread,
  ThreadExternalLinks: () => ThreadExternalLinks,
  Topic: () => Topic,
  TopicDirect: () => TopicDirect,
  TopicGroup: () => TopicGroup,
  TopicParty: () => TopicParty,
  TypingStatus: () => TypingStatus,
  WatchThreadOutput: () => WatchThreadOutput,
  common: () => common_exports13,
  identity: () => identity_exports4
});
var init_chat = __esm({
  "src/serialization/resources/chat/index.ts"() {
    "use strict";
    init_resources2();
    init_types4();
  }
});

// src/serialization/resources/cloud/resources/auth/types/InspectOutput.ts
var InspectOutput;
var init_InspectOutput = __esm({
  "src/serialization/resources/cloud/resources/auth/types/InspectOutput.ts"() {
    "use strict";
    init_core();
    InspectOutput = schemas_exports.object({
      agent: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgent)
    });
  }
});

// src/serialization/resources/cloud/resources/auth/types/index.ts
var init_types5 = __esm({
  "src/serialization/resources/cloud/resources/auth/types/index.ts"() {
    "use strict";
    init_InspectOutput();
  }
});

// src/serialization/resources/cloud/resources/auth/index.ts
var auth_exports2 = {};
__export(auth_exports2, {
  InspectOutput: () => InspectOutput
});
var init_auth2 = __esm({
  "src/serialization/resources/cloud/resources/auth/index.ts"() {
    "use strict";
    init_types5();
  }
});

// src/serialization/resources/cloud/resources/common/types/SvcPerf.ts
var SvcPerf;
var init_SvcPerf = __esm({
  "src/serialization/resources/cloud/resources/common/types/SvcPerf.ts"() {
    "use strict";
    init_core();
    SvcPerf = schemas_exports.object({
      svcName: schemas_exports.property("svc_name", schemas_exports.string()),
      ts: schemas_exports.date(),
      duration: schemas_exports.number(),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional()),
      spans: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsPerfSpan)
      ),
      marks: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsPerfMark)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsPerfSpan.ts
var LogsPerfSpan;
var init_LogsPerfSpan = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsPerfSpan.ts"() {
    "use strict";
    init_core();
    LogsPerfSpan = schemas_exports.object({
      label: schemas_exports.string(),
      startTs: schemas_exports.property("start_ts", schemas_exports.date()),
      finishTs: schemas_exports.property("finish_ts", schemas_exports.date().optional()),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsPerfMark.ts
var LogsPerfMark;
var init_LogsPerfMark = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsPerfMark.ts"() {
    "use strict";
    init_core();
    LogsPerfMark = schemas_exports.object({
      label: schemas_exports.string(),
      ts: schemas_exports.date(),
      rayId: schemas_exports.property("ray_id", schemas_exports.string().optional()),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AnalyticsLobbySummary.ts
var AnalyticsLobbySummary;
var init_AnalyticsLobbySummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/AnalyticsLobbySummary.ts"() {
    "use strict";
    init_core();
    AnalyticsLobbySummary = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      lobbyGroupId: schemas_exports.property("lobby_group_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      isReady: schemas_exports.property("is_ready", schemas_exports.boolean()),
      isIdle: schemas_exports.property("is_idle", schemas_exports.boolean()),
      isClosed: schemas_exports.property("is_closed", schemas_exports.boolean()),
      isOutdated: schemas_exports.property("is_outdated", schemas_exports.boolean()),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number()),
      registeredPlayerCount: schemas_exports.property("registered_player_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbySummary.ts
var LogsLobbySummary;
var init_LogsLobbySummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbySummary.ts"() {
    "use strict";
    init_core();
    LogsLobbySummary = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      startTs: schemas_exports.property("start_ts", schemas_exports.date().optional()),
      readyTs: schemas_exports.property("ready_ts", schemas_exports.date().optional()),
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbyStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbyStatus.ts
var LogsLobbyStatus;
var init_LogsLobbyStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbyStatus.ts"() {
    "use strict";
    init_core();
    LogsLobbyStatus = schemas_exports.object({
      running: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject),
      stopped: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbyStatusStopped).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbyStatusStopped.ts
var LogsLobbyStatusStopped;
var init_LogsLobbyStatusStopped = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbyStatusStopped.ts"() {
    "use strict";
    init_core();
    LogsLobbyStatusStopped = schemas_exports.object({
      stopTs: schemas_exports.property("stop_ts", schemas_exports.date()),
      failed: schemas_exports.boolean(),
      exitCode: schemas_exports.property("exit_code", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/SvcMetrics.ts
var SvcMetrics;
var init_SvcMetrics = __esm({
  "src/serialization/resources/cloud/resources/common/types/SvcMetrics.ts"() {
    "use strict";
    init_core();
    SvcMetrics = schemas_exports.object({
      job: schemas_exports.string(),
      cpu: schemas_exports.list(schemas_exports.number()),
      memory: schemas_exports.list(schemas_exports.number()),
      memoryMax: schemas_exports.property("memory_max", schemas_exports.list(schemas_exports.number())),
      allocatedMemory: schemas_exports.property("allocated_memory", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgent.ts
var AuthAgent;
var init_AuthAgent = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgent.ts"() {
    "use strict";
    init_core();
    AuthAgent = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgentIdentity).optional(),
      gameCloud: schemas_exports.property(
        "game_cloud",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgentGameCloud).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgentIdentity.ts
var AuthAgentIdentity;
var init_AuthAgentIdentity = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgentIdentity.ts"() {
    "use strict";
    init_core();
    AuthAgentIdentity = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgentGameCloud.ts
var AuthAgentGameCloud;
var init_AuthAgentGameCloud = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgentGameCloud.ts"() {
    "use strict";
    init_core();
    AuthAgentGameCloud = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CustomAvatarSummary.ts
var CustomAvatarSummary;
var init_CustomAvatarSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/CustomAvatarSummary.ts"() {
    "use strict";
    init_core();
    CustomAvatarSummary = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      url: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/BuildSummary.ts
var BuildSummary;
var init_BuildSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/BuildSummary.ts"() {
    "use strict";
    init_core();
    BuildSummary = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnSiteSummary.ts
var CdnSiteSummary;
var init_CdnSiteSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnSiteSummary.ts"() {
    "use strict";
    init_core();
    CdnSiteSummary = schemas_exports.object({
      siteId: schemas_exports.property("site_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GameFull.ts
var GameFull;
var init_GameFull = __esm({
  "src/serialization/resources/cloud/resources/common/types/GameFull.ts"() {
    "use strict";
    init_core();
    GameFull = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number()),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string().optional()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string().optional()),
      namespaces: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceSummary)
      ),
      versions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Summary)
      ),
      availableRegions: schemas_exports.property(
        "available_regions",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceSummary.ts
var NamespaceSummary;
var init_NamespaceSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceSummary.ts"() {
    "use strict";
    init_core();
    NamespaceSummary = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionSummary.ts
var RegionSummary;
var init_RegionSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionSummary.ts"() {
    "use strict";
    init_core();
    RegionSummary = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      regionNameId: schemas_exports.property("region_name_id", schemas_exports.string()),
      provider: schemas_exports.string(),
      universalRegion: schemas_exports.property("universal_region", schemas_exports.number()),
      providerDisplayName: schemas_exports.property("provider_display_name", schemas_exports.string()),
      regionDisplayName: schemas_exports.property("region_display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingSummary.ts
var GroupBillingSummary;
var init_GroupBillingSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingSummary.ts"() {
    "use strict";
    init_core();
    GroupBillingSummary = schemas_exports.object({
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GameLobbyExpenses)
      ),
      balance: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GameLobbyExpenses.ts
var GameLobbyExpenses;
var init_GameLobbyExpenses = __esm({
  "src/serialization/resources/cloud/resources/common/types/GameLobbyExpenses.ts"() {
    "use strict";
    init_core();
    GameLobbyExpenses = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      namespaces: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceSummary)
      ),
      expenses: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionTierExpenses)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionTierExpenses.ts
var RegionTierExpenses;
var init_RegionTierExpenses = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionTierExpenses.ts"() {
    "use strict";
    init_core();
    RegionTierExpenses = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      uptime: schemas_exports.number(),
      expenses: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBankSource.ts
var GroupBankSource;
var init_GroupBankSource = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBankSource.ts"() {
    "use strict";
    init_core();
    GroupBankSource = schemas_exports.object({
      accountNumber: schemas_exports.property("account_number", schemas_exports.string()),
      routingNumber: schemas_exports.property("routing_number", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingInvoice.ts
var GroupBillingInvoice;
var init_GroupBillingInvoice = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingInvoice.ts"() {
    "use strict";
    init_core();
    GroupBillingInvoice = schemas_exports.object({
      csvUrl: schemas_exports.property("csv_url", schemas_exports.string()),
      pdfUrl: schemas_exports.property("pdf_url", schemas_exports.string()),
      periodStartTs: schemas_exports.property("period_start_ts", schemas_exports.date()),
      periodEndTs: schemas_exports.property("period_end_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingPayment.ts
var GroupBillingPayment;
var init_GroupBillingPayment = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingPayment.ts"() {
    "use strict";
    init_core();
    GroupBillingPayment = schemas_exports.object({
      amount: schemas_exports.number(),
      description: schemas_exports.string().optional(),
      fromInvoice: schemas_exports.property("from_invoice", schemas_exports.boolean()),
      createdTs: schemas_exports.property("created_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingStatus.ts
var GroupBillingStatus2;
var init_GroupBillingStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingStatus.ts"() {
    "use strict";
    init_core();
    GroupBillingStatus2 = schemas_exports.enum_(["succeeded", "processing", "refunded"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingTransfer.ts
var GroupBillingTransfer;
var init_GroupBillingTransfer = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingTransfer.ts"() {
    "use strict";
    init_core();
    GroupBillingTransfer = schemas_exports.object({
      amount: schemas_exports.number(),
      description: schemas_exports.string().optional(),
      createdTs: schemas_exports.property("created_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionTier.ts
var RegionTier;
var init_RegionTier = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionTier.ts"() {
    "use strict";
    init_core();
    RegionTier = schemas_exports.object({
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      rivetCoresNumerator: schemas_exports.property("rivet_cores_numerator", schemas_exports.number()),
      rivetCoresDenominator: schemas_exports.property("rivet_cores_denominator", schemas_exports.number()),
      cpu: schemas_exports.number(),
      memory: schemas_exports.number(),
      disk: schemas_exports.number(),
      bandwidth: schemas_exports.number(),
      pricePerSecond: schemas_exports.property("price_per_second", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceFull.ts
var NamespaceFull;
var init_NamespaceFull = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceFull.ts"() {
    "use strict";
    init_core();
    NamespaceFull = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceConfig)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceConfig.ts
var NamespaceConfig;
var init_NamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceConfig.ts"() {
    "use strict";
    init_core();
    NamespaceConfig = schemas_exports.object({
      cdn: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceConfig),
      matchmaker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.MatchmakerNamespaceConfig
      ),
      kv: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.KvNamespaceConfig),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.IdentityNamespaceConfig)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceConfig.ts
var CdnNamespaceConfig;
var init_CdnNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceConfig.ts"() {
    "use strict";
    init_core();
    CdnNamespaceConfig = schemas_exports.object({
      enableDomainPublicAuth: schemas_exports.property("enable_domain_public_auth", schemas_exports.boolean()),
      domains: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomain)
      ),
      authType: schemas_exports.property(
        "auth_type",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnAuthType)
      ),
      authUserList: schemas_exports.property(
        "auth_user_list",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceAuthUser)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/MatchmakerNamespaceConfig.ts
var MatchmakerNamespaceConfig;
var init_MatchmakerNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/MatchmakerNamespaceConfig.ts"() {
    "use strict";
    init_core();
    MatchmakerNamespaceConfig = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayersPerClient: schemas_exports.property("max_players_per_client", schemas_exports.number()),
      maxPlayersPerClientVpn: schemas_exports.property("max_players_per_client_vpn", schemas_exports.number()),
      maxPlayersPerClientProxy: schemas_exports.property("max_players_per_client_proxy", schemas_exports.number()),
      maxPlayersPerClientTor: schemas_exports.property("max_players_per_client_tor", schemas_exports.number()),
      maxPlayersPerClientHosting: schemas_exports.property(
        "max_players_per_client_hosting",
        schemas_exports.number()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/KvNamespaceConfig.ts
var KvNamespaceConfig;
var init_KvNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/KvNamespaceConfig.ts"() {
    "use strict";
    init_core();
    KvNamespaceConfig = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/common/types/IdentityNamespaceConfig.ts
var IdentityNamespaceConfig;
var init_IdentityNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/IdentityNamespaceConfig.ts"() {
    "use strict";
    init_core();
    IdentityNamespaceConfig = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnAuthType.ts
var CdnAuthType2;
var init_CdnAuthType = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnAuthType.ts"() {
    "use strict";
    init_core();
    CdnAuthType2 = schemas_exports.enum_(["none", "basic"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomain.ts
var CdnNamespaceDomain;
var init_CdnNamespaceDomain = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomain.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomain = schemas_exports.object({
      domain: schemas_exports.string(),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      verificationStatus: schemas_exports.property(
        "verification_status",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationStatus)
      ),
      verificationMethod: schemas_exports.property(
        "verification_method",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationMethod
        )
      ),
      verificationErrors: schemas_exports.property(
        "verification_errors",
        schemas_exports.list(schemas_exports.string())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethod.ts
var CdnNamespaceDomainVerificationMethod;
var init_CdnNamespaceDomainVerificationMethod = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethod.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationMethod = schemas_exports.object({
      invalid: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      http: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationMethodHttp).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethodHttp.ts
var CdnNamespaceDomainVerificationMethodHttp;
var init_CdnNamespaceDomainVerificationMethodHttp = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethodHttp.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationMethodHttp = schemas_exports.object({
      cnameRecord: schemas_exports.property("cname_record", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts
var CdnNamespaceDomainVerificationStatus2;
var init_CdnNamespaceDomainVerificationStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationStatus2 = schemas_exports.enum_(["active", "pending", "failed"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceAuthUser.ts
var CdnNamespaceAuthUser;
var init_CdnNamespaceAuthUser = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceAuthUser.ts"() {
    "use strict";
    init_core();
    CdnNamespaceAuthUser = schemas_exports.object({
      user: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/MatchmakerDevelopmentPort.ts
var MatchmakerDevelopmentPort;
var init_MatchmakerDevelopmentPort = __esm({
  "src/serialization/resources/cloud/resources/common/types/MatchmakerDevelopmentPort.ts"() {
    "use strict";
    init_core();
    MatchmakerDevelopmentPort = schemas_exports.object({
      port: schemas_exports.number(),
      protocol: schemas_exports.lazy(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.ProxyProtocol
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/index.ts
var init_types6 = __esm({
  "src/serialization/resources/cloud/resources/common/types/index.ts"() {
    "use strict";
    init_SvcPerf();
    init_LogsPerfSpan();
    init_LogsPerfMark();
    init_AnalyticsLobbySummary();
    init_LogsLobbySummary();
    init_LogsLobbyStatus();
    init_LogsLobbyStatusStopped();
    init_SvcMetrics();
    init_AuthAgent();
    init_AuthAgentIdentity();
    init_AuthAgentGameCloud();
    init_CustomAvatarSummary();
    init_BuildSummary();
    init_CdnSiteSummary();
    init_GameFull();
    init_NamespaceSummary();
    init_RegionSummary();
    init_GroupBillingSummary();
    init_GameLobbyExpenses();
    init_RegionTierExpenses();
    init_GroupBankSource();
    init_GroupBillingInvoice();
    init_GroupBillingPayment();
    init_GroupBillingStatus();
    init_GroupBillingTransfer();
    init_RegionTier();
    init_NamespaceFull();
    init_NamespaceConfig();
    init_CdnNamespaceConfig();
    init_MatchmakerNamespaceConfig();
    init_KvNamespaceConfig();
    init_IdentityNamespaceConfig();
    init_CdnAuthType();
    init_CdnNamespaceDomain();
    init_CdnNamespaceDomainVerificationMethod();
    init_CdnNamespaceDomainVerificationMethodHttp();
    init_CdnNamespaceDomainVerificationStatus();
    init_CdnNamespaceAuthUser();
    init_MatchmakerDevelopmentPort();
  }
});

// src/serialization/resources/cloud/resources/common/index.ts
var common_exports14 = {};
__export(common_exports14, {
  AnalyticsLobbySummary: () => AnalyticsLobbySummary,
  AuthAgent: () => AuthAgent,
  AuthAgentGameCloud: () => AuthAgentGameCloud,
  AuthAgentIdentity: () => AuthAgentIdentity,
  BuildSummary: () => BuildSummary,
  CdnAuthType: () => CdnAuthType2,
  CdnNamespaceAuthUser: () => CdnNamespaceAuthUser,
  CdnNamespaceConfig: () => CdnNamespaceConfig,
  CdnNamespaceDomain: () => CdnNamespaceDomain,
  CdnNamespaceDomainVerificationMethod: () => CdnNamespaceDomainVerificationMethod,
  CdnNamespaceDomainVerificationMethodHttp: () => CdnNamespaceDomainVerificationMethodHttp,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus2,
  CdnSiteSummary: () => CdnSiteSummary,
  CustomAvatarSummary: () => CustomAvatarSummary,
  GameFull: () => GameFull,
  GameLobbyExpenses: () => GameLobbyExpenses,
  GroupBankSource: () => GroupBankSource,
  GroupBillingInvoice: () => GroupBillingInvoice,
  GroupBillingPayment: () => GroupBillingPayment,
  GroupBillingStatus: () => GroupBillingStatus2,
  GroupBillingSummary: () => GroupBillingSummary,
  GroupBillingTransfer: () => GroupBillingTransfer,
  IdentityNamespaceConfig: () => IdentityNamespaceConfig,
  KvNamespaceConfig: () => KvNamespaceConfig,
  LogsLobbyStatus: () => LogsLobbyStatus,
  LogsLobbyStatusStopped: () => LogsLobbyStatusStopped,
  LogsLobbySummary: () => LogsLobbySummary,
  LogsPerfMark: () => LogsPerfMark,
  LogsPerfSpan: () => LogsPerfSpan,
  MatchmakerDevelopmentPort: () => MatchmakerDevelopmentPort,
  MatchmakerNamespaceConfig: () => MatchmakerNamespaceConfig,
  NamespaceConfig: () => NamespaceConfig,
  NamespaceFull: () => NamespaceFull,
  NamespaceSummary: () => NamespaceSummary,
  RegionSummary: () => RegionSummary,
  RegionTier: () => RegionTier,
  RegionTierExpenses: () => RegionTierExpenses,
  SvcMetrics: () => SvcMetrics,
  SvcPerf: () => SvcPerf
});
var init_common2 = __esm({
  "src/serialization/resources/cloud/resources/common/index.ts"() {
    "use strict";
    init_types6();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/PrepareDeviceLinkOutput.ts
var PrepareDeviceLinkOutput;
var init_PrepareDeviceLinkOutput = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/PrepareDeviceLinkOutput.ts"() {
    "use strict";
    init_core();
    PrepareDeviceLinkOutput = schemas_exports.object({
      deviceLinkId: schemas_exports.property("device_link_id", schemas_exports.string()),
      deviceLinkToken: schemas_exports.property("device_link_token", schemas_exports.string()),
      deviceLinkUrl: schemas_exports.property("device_link_url", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/GetDeviceLinkOutput.ts
var GetDeviceLinkOutput;
var init_GetDeviceLinkOutput = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/GetDeviceLinkOutput.ts"() {
    "use strict";
    init_core();
    GetDeviceLinkOutput = schemas_exports.object({
      cloudToken: schemas_exports.property("cloud_token", schemas_exports.string().optional()),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/index.ts
var init_types7 = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/index.ts"() {
    "use strict";
    init_PrepareDeviceLinkOutput();
    init_GetDeviceLinkOutput();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/index.ts
var links_exports3 = {};
__export(links_exports3, {
  GetDeviceLinkOutput: () => GetDeviceLinkOutput,
  PrepareDeviceLinkOutput: () => PrepareDeviceLinkOutput
});
var init_links = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/index.ts"() {
    "use strict";
    init_types7();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/index.ts
var init_resources3 = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/index.ts"() {
    "use strict";
    init_links();
    init_types7();
  }
});

// src/serialization/resources/cloud/resources/devices/index.ts
var devices_exports2 = {};
__export(devices_exports2, {
  GetDeviceLinkOutput: () => GetDeviceLinkOutput,
  PrepareDeviceLinkOutput: () => PrepareDeviceLinkOutput,
  links: () => links_exports3
});
var init_devices = __esm({
  "src/serialization/resources/cloud/resources/devices/index.ts"() {
    "use strict";
    init_resources3();
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/ListGameCustomAvatarsOutput.ts
var ListGameCustomAvatarsOutput;
var init_ListGameCustomAvatarsOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/ListGameCustomAvatarsOutput.ts"() {
    "use strict";
    init_core();
    ListGameCustomAvatarsOutput = schemas_exports.object({
      customAvatars: schemas_exports.property(
        "custom_avatars",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CustomAvatarSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadInput.ts
var PrepareCustomAvatarUploadInput;
var init_PrepareCustomAvatarUploadInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadInput.ts"() {
    "use strict";
    init_core();
    PrepareCustomAvatarUploadInput = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadOutput.ts
var PrepareCustomAvatarUploadOutput;
var init_PrepareCustomAvatarUploadOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadOutput.ts"() {
    "use strict";
    init_core();
    PrepareCustomAvatarUploadOutput = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/index.ts
var init_types8 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/index.ts"() {
    "use strict";
    init_ListGameCustomAvatarsOutput();
    init_PrepareCustomAvatarUploadInput();
    init_PrepareCustomAvatarUploadOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/index.ts
var avatars_exports2 = {};
__export(avatars_exports2, {
  ListGameCustomAvatarsOutput: () => ListGameCustomAvatarsOutput,
  PrepareCustomAvatarUploadInput: () => PrepareCustomAvatarUploadInput,
  PrepareCustomAvatarUploadOutput: () => PrepareCustomAvatarUploadOutput
});
var init_avatars = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/index.ts"() {
    "use strict";
    init_types8();
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/ListGameBuildsOutput.ts
var ListGameBuildsOutput;
var init_ListGameBuildsOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/ListGameBuildsOutput.ts"() {
    "use strict";
    init_core();
    ListGameBuildsOutput = schemas_exports.object({
      builds: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.BuildSummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildInput.ts
var CreateGameBuildInput;
var init_CreateGameBuildInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildInput.ts"() {
    "use strict";
    init_core();
    CreateGameBuildInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      imageTag: schemas_exports.property("image_tag", schemas_exports.string()),
      imageFile: schemas_exports.property(
        "image_file",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PrepareFile)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildOutput.ts
var CreateGameBuildOutput;
var init_CreateGameBuildOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildOutput.ts"() {
    "use strict";
    init_core();
    CreateGameBuildOutput = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      imagePresignedRequest: schemas_exports.property(
        "image_presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/index.ts
var init_types9 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/index.ts"() {
    "use strict";
    init_ListGameBuildsOutput();
    init_CreateGameBuildInput();
    init_CreateGameBuildOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/index.ts
var builds_exports2 = {};
__export(builds_exports2, {
  CreateGameBuildInput: () => CreateGameBuildInput,
  CreateGameBuildOutput: () => CreateGameBuildOutput,
  ListGameBuildsOutput: () => ListGameBuildsOutput
});
var init_builds = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/index.ts"() {
    "use strict";
    init_types9();
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/ListGameCdnSitesOutput.ts
var ListGameCdnSitesOutput;
var init_ListGameCdnSitesOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/ListGameCdnSitesOutput.ts"() {
    "use strict";
    init_core();
    ListGameCdnSitesOutput = schemas_exports.object({
      sites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnSiteSummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteInput.ts
var CreateGameCdnSiteInput;
var init_CreateGameCdnSiteInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteInput.ts"() {
    "use strict";
    init_core();
    CreateGameCdnSiteInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      files: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PrepareFile)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteOutput.ts
var CreateGameCdnSiteOutput;
var init_CreateGameCdnSiteOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteOutput.ts"() {
    "use strict";
    init_core();
    CreateGameCdnSiteOutput = schemas_exports.object({
      siteId: schemas_exports.property("site_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequests: schemas_exports.property(
        "presigned_requests",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/index.ts
var init_types10 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/index.ts"() {
    "use strict";
    init_ListGameCdnSitesOutput();
    init_CreateGameCdnSiteInput();
    init_CreateGameCdnSiteOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/index.ts
var cdn_exports3 = {};
__export(cdn_exports3, {
  CreateGameCdnSiteInput: () => CreateGameCdnSiteInput,
  CreateGameCdnSiteOutput: () => CreateGameCdnSiteOutput,
  ListGameCdnSitesOutput: () => ListGameCdnSitesOutput
});
var init_cdn = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/index.ts"() {
    "use strict";
    init_types10();
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GetGamesOutput.ts
var GetGamesOutput;
var init_GetGamesOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GetGamesOutput.ts"() {
    "use strict";
    init_core();
    GetGamesOutput = schemas_exports.object({
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.games.GameSummary)
      ),
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameInput.ts
var CreateGameInput;
var init_CreateGameInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameInput.ts"() {
    "use strict";
    init_core();
    CreateGameInput = schemas_exports.object({
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameOutput.ts
var CreateGameOutput;
var init_CreateGameOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameOutput.ts"() {
    "use strict";
    init_core();
    CreateGameOutput = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameInput.ts
var ValidateGameInput;
var init_ValidateGameInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameInput.ts"() {
    "use strict";
    init_core();
    ValidateGameInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameOutput.ts
var ValidateGameOutput;
var init_ValidateGameOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameOutput.ts"() {
    "use strict";
    init_core();
    ValidateGameOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GetGameByIdOutput.ts
var GetGameByIdOutput;
var init_GetGameByIdOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GetGameByIdOutput.ts"() {
    "use strict";
    init_core();
    GetGameByIdOutput = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GameFull),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareInput.ts
var GameBannerUploadPrepareInput;
var init_GameBannerUploadPrepareInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareInput.ts"() {
    "use strict";
    init_core();
    GameBannerUploadPrepareInput = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareOutput.ts
var GameBannerUploadPrepareOutput;
var init_GameBannerUploadPrepareOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareOutput.ts"() {
    "use strict";
    init_core();
    GameBannerUploadPrepareOutput = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareInput.ts
var GameLogoUploadPrepareInput;
var init_GameLogoUploadPrepareInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareInput.ts"() {
    "use strict";
    init_core();
    GameLogoUploadPrepareInput = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareOutput.ts
var GameLogoUploadPrepareOutput;
var init_GameLogoUploadPrepareOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareOutput.ts"() {
    "use strict";
    init_core();
    GameLogoUploadPrepareOutput = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameSummary.ts
var GameSummary;
var init_GameSummary = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameSummary.ts"() {
    "use strict";
    init_core();
    GameSummary = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number().optional()),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string().optional()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/index.ts
var init_types11 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/index.ts"() {
    "use strict";
    init_GetGamesOutput();
    init_CreateGameInput();
    init_CreateGameOutput();
    init_ValidateGameInput();
    init_ValidateGameOutput();
    init_GetGameByIdOutput();
    init_GameBannerUploadPrepareInput();
    init_GameBannerUploadPrepareOutput();
    init_GameLogoUploadPrepareInput();
    init_GameLogoUploadPrepareOutput();
    init_GameSummary();
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/index.ts
var games_exports3 = {};
__export(games_exports3, {
  CreateGameInput: () => CreateGameInput,
  CreateGameOutput: () => CreateGameOutput,
  GameBannerUploadPrepareInput: () => GameBannerUploadPrepareInput,
  GameBannerUploadPrepareOutput: () => GameBannerUploadPrepareOutput,
  GameLogoUploadPrepareInput: () => GameLogoUploadPrepareInput,
  GameLogoUploadPrepareOutput: () => GameLogoUploadPrepareOutput,
  GameSummary: () => GameSummary,
  GetGameByIdOutput: () => GetGameByIdOutput,
  GetGamesOutput: () => GetGamesOutput,
  ValidateGameInput: () => ValidateGameInput,
  ValidateGameOutput: () => ValidateGameOutput
});
var init_games = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/index.ts"() {
    "use strict";
    init_types11();
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryInput.ts
var ExportMatchmakerLobbyHistoryInput;
var init_ExportMatchmakerLobbyHistoryInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryInput.ts"() {
    "use strict";
    init_core();
    ExportMatchmakerLobbyHistoryInput = schemas_exports.object({
      queryStart: schemas_exports.property("query_start", schemas_exports.number().optional()),
      queryEnd: schemas_exports.property("query_end", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryOutput.ts
var ExportMatchmakerLobbyHistoryOutput;
var init_ExportMatchmakerLobbyHistoryOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryOutput.ts"() {
    "use strict";
    init_core();
    ExportMatchmakerLobbyHistoryOutput = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/DeleteMatchmakerLobbyOutput.ts
var DeleteMatchmakerLobbyOutput;
var init_DeleteMatchmakerLobbyOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/DeleteMatchmakerLobbyOutput.ts"() {
    "use strict";
    init_core();
    DeleteMatchmakerLobbyOutput = schemas_exports.object({
      didRemove: schemas_exports.property("did_remove", schemas_exports.boolean().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/GetLobbyLogsOutput.ts
var GetLobbyLogsOutput;
var init_GetLobbyLogsOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/GetLobbyLogsOutput.ts"() {
    "use strict";
    init_core();
    GetLobbyLogsOutput = schemas_exports.object({
      lines: schemas_exports.list(schemas_exports.string()),
      timestamps: schemas_exports.list(schemas_exports.string()),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsInput.ts
var ExportLobbyLogsInput;
var init_ExportLobbyLogsInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsInput.ts"() {
    "use strict";
    init_core();
    ExportLobbyLogsInput = schemas_exports.object({
      stream: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.games.LogStream)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsOutput.ts
var ExportLobbyLogsOutput;
var init_ExportLobbyLogsOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsOutput.ts"() {
    "use strict";
    init_core();
    ExportLobbyLogsOutput = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts
var LogStream2;
var init_LogStream = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts"() {
    "use strict";
    init_core();
    LogStream2 = schemas_exports.enum_(["std_out", "std_err"]);
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/index.ts
var init_types12 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_ExportMatchmakerLobbyHistoryInput();
    init_ExportMatchmakerLobbyHistoryOutput();
    init_DeleteMatchmakerLobbyOutput();
    init_GetLobbyLogsOutput();
    init_ExportLobbyLogsInput();
    init_ExportLobbyLogsOutput();
    init_LogStream();
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/index.ts
var matchmaker_exports5 = {};
__export(matchmaker_exports5, {
  DeleteMatchmakerLobbyOutput: () => DeleteMatchmakerLobbyOutput,
  ExportLobbyLogsInput: () => ExportLobbyLogsInput,
  ExportLobbyLogsOutput: () => ExportLobbyLogsOutput,
  ExportMatchmakerLobbyHistoryInput: () => ExportMatchmakerLobbyHistoryInput,
  ExportMatchmakerLobbyHistoryOutput: () => ExportMatchmakerLobbyHistoryOutput,
  GetLobbyLogsOutput: () => GetLobbyLogsOutput,
  LogStream: () => LogStream2
});
var init_matchmaker = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/index.ts"() {
    "use strict";
    init_types12();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/GetNamespaceAnalyticsMatchmakerLiveOutput.ts
var GetNamespaceAnalyticsMatchmakerLiveOutput;
var init_GetNamespaceAnalyticsMatchmakerLiveOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/GetNamespaceAnalyticsMatchmakerLiveOutput.ts"() {
    "use strict";
    init_core();
    GetNamespaceAnalyticsMatchmakerLiveOutput = schemas_exports.object({
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AnalyticsLobbySummary
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/index.ts
var init_types13 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/index.ts"() {
    "use strict";
    init_GetNamespaceAnalyticsMatchmakerLiveOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts
var analytics_exports2 = {};
__export(analytics_exports2, {
  GetNamespaceAnalyticsMatchmakerLiveOutput: () => GetNamespaceAnalyticsMatchmakerLiveOutput
});
var init_analytics = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts"() {
    "use strict";
    init_types13();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/ListNamespaceLobbiesOutput.ts
var ListNamespaceLobbiesOutput;
var init_ListNamespaceLobbiesOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/ListNamespaceLobbiesOutput.ts"() {
    "use strict";
    init_core();
    ListNamespaceLobbiesOutput = schemas_exports.object({
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbySummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/GetNamespaceLobbyOutput.ts
var GetNamespaceLobbyOutput;
var init_GetNamespaceLobbyOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/GetNamespaceLobbyOutput.ts"() {
    "use strict";
    init_core();
    GetNamespaceLobbyOutput = schemas_exports.object({
      lobby: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbySummary
      ),
      metrics: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcMetrics).optional(),
      stdoutPresignedUrls: schemas_exports.property(
        "stdout_presigned_urls",
        schemas_exports.list(schemas_exports.string())
      ),
      stderrPresignedUrls: schemas_exports.property(
        "stderr_presigned_urls",
        schemas_exports.list(schemas_exports.string())
      ),
      perfLists: schemas_exports.property(
        "perf_lists",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcPerf)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/index.ts
var init_types14 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/index.ts"() {
    "use strict";
    init_ListNamespaceLobbiesOutput();
    init_GetNamespaceLobbyOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts
var logs_exports3 = {};
__export(logs_exports3, {
  GetNamespaceLobbyOutput: () => GetNamespaceLobbyOutput,
  ListNamespaceLobbiesOutput: () => ListNamespaceLobbiesOutput
});
var init_logs = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts"() {
    "use strict";
    init_types14();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/index.ts
var init_resources4 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/index.ts"() {
    "use strict";
    init_analytics();
    init_types13();
    init_logs();
    init_types14();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceInput.ts
var CreateGameNamespaceInput;
var init_CreateGameNamespaceInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceInput.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceOutput.ts
var CreateGameNamespaceOutput;
var init_CreateGameNamespaceOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceOutput.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceOutput = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceInput.ts
var ValidateGameNamespaceInput;
var init_ValidateGameNamespaceInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceInput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceOutput.ts
var ValidateGameNamespaceOutput;
var init_ValidateGameNamespaceOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceOutput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceByIdOutput.ts
var GetGameNamespaceByIdOutput;
var init_GetGameNamespaceByIdOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceByIdOutput.ts"() {
    "use strict";
    init_core();
    GetGameNamespaceByIdOutput = schemas_exports.object({
      namespace: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceFull)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateNamespaceCdnAuthUserInput.ts
var UpdateNamespaceCdnAuthUserInput;
var init_UpdateNamespaceCdnAuthUserInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateNamespaceCdnAuthUserInput.ts"() {
    "use strict";
    init_core();
    UpdateNamespaceCdnAuthUserInput = schemas_exports.object({
      user: schemas_exports.string(),
      password: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/SetNamespaceCdnAuthTypeInput.ts
var SetNamespaceCdnAuthTypeInput;
var init_SetNamespaceCdnAuthTypeInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/SetNamespaceCdnAuthTypeInput.ts"() {
    "use strict";
    init_core();
    SetNamespaceCdnAuthTypeInput = schemas_exports.object({
      authType: schemas_exports.property(
        "auth_type",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnAuthType)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ToggleNamespaceDomainPublicAuthInput.ts
var ToggleNamespaceDomainPublicAuthInput;
var init_ToggleNamespaceDomainPublicAuthInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ToggleNamespaceDomainPublicAuthInput.ts"() {
    "use strict";
    init_core();
    ToggleNamespaceDomainPublicAuthInput = schemas_exports.object({
      enabled: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/AddNamespaceDomainInput.ts
var AddNamespaceDomainInput;
var init_AddNamespaceDomainInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/AddNamespaceDomainInput.ts"() {
    "use strict";
    init_core();
    AddNamespaceDomainInput = schemas_exports.object({
      domain: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceMatchmakerConfigInput.ts
var UpdateGameNamespaceMatchmakerConfigInput;
var init_UpdateGameNamespaceMatchmakerConfigInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceMatchmakerConfigInput.ts"() {
    "use strict";
    init_core();
    UpdateGameNamespaceMatchmakerConfigInput = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigInput.ts
var ValidateGameNamespaceMatchmakerConfigInput;
var init_ValidateGameNamespaceMatchmakerConfigInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigInput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceMatchmakerConfigInput = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigOutput.ts
var ValidateGameNamespaceMatchmakerConfigOutput;
var init_ValidateGameNamespaceMatchmakerConfigOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigOutput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceMatchmakerConfigOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentInput.ts
var CreateGameNamespaceTokenDevelopmentInput;
var init_CreateGameNamespaceTokenDevelopmentInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentInput.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenDevelopmentInput = schemas_exports.object({
      hostname: schemas_exports.string(),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.MatchmakerDevelopmentPort).optional()
      ).optional(),
      lobbyPorts: schemas_exports.property(
        "lobby_ports",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentOutput.ts
var CreateGameNamespaceTokenDevelopmentOutput;
var init_CreateGameNamespaceTokenDevelopmentOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentOutput.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenDevelopmentOutput = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentInput.ts
var ValidateGameNamespaceTokenDevelopmentInput;
var init_ValidateGameNamespaceTokenDevelopmentInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentInput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceTokenDevelopmentInput = schemas_exports.object({
      hostname: schemas_exports.string(),
      lobbyPorts: schemas_exports.property(
        "lobby_ports",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
          )
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentOutput.ts
var ValidateGameNamespaceTokenDevelopmentOutput;
var init_ValidateGameNamespaceTokenDevelopmentOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentOutput.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceTokenDevelopmentOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenPublicOutput.ts
var CreateGameNamespaceTokenPublicOutput;
var init_CreateGameNamespaceTokenPublicOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenPublicOutput.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenPublicOutput = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceVersionInput.ts
var UpdateGameNamespaceVersionInput;
var init_UpdateGameNamespaceVersionInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceVersionInput.ts"() {
    "use strict";
    init_core();
    UpdateGameNamespaceVersionInput = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/index.ts
var init_types15 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/index.ts"() {
    "use strict";
    init_CreateGameNamespaceInput();
    init_CreateGameNamespaceOutput();
    init_ValidateGameNamespaceInput();
    init_ValidateGameNamespaceOutput();
    init_GetGameNamespaceByIdOutput();
    init_UpdateNamespaceCdnAuthUserInput();
    init_SetNamespaceCdnAuthTypeInput();
    init_ToggleNamespaceDomainPublicAuthInput();
    init_AddNamespaceDomainInput();
    init_UpdateGameNamespaceMatchmakerConfigInput();
    init_ValidateGameNamespaceMatchmakerConfigInput();
    init_ValidateGameNamespaceMatchmakerConfigOutput();
    init_CreateGameNamespaceTokenDevelopmentInput();
    init_CreateGameNamespaceTokenDevelopmentOutput();
    init_ValidateGameNamespaceTokenDevelopmentInput();
    init_ValidateGameNamespaceTokenDevelopmentOutput();
    init_CreateGameNamespaceTokenPublicOutput();
    init_UpdateGameNamespaceVersionInput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/index.ts
var namespaces_exports2 = {};
__export(namespaces_exports2, {
  AddNamespaceDomainInput: () => AddNamespaceDomainInput,
  CreateGameNamespaceInput: () => CreateGameNamespaceInput,
  CreateGameNamespaceOutput: () => CreateGameNamespaceOutput,
  CreateGameNamespaceTokenDevelopmentInput: () => CreateGameNamespaceTokenDevelopmentInput,
  CreateGameNamespaceTokenDevelopmentOutput: () => CreateGameNamespaceTokenDevelopmentOutput,
  CreateGameNamespaceTokenPublicOutput: () => CreateGameNamespaceTokenPublicOutput,
  GetGameNamespaceByIdOutput: () => GetGameNamespaceByIdOutput,
  GetNamespaceAnalyticsMatchmakerLiveOutput: () => GetNamespaceAnalyticsMatchmakerLiveOutput,
  GetNamespaceLobbyOutput: () => GetNamespaceLobbyOutput,
  ListNamespaceLobbiesOutput: () => ListNamespaceLobbiesOutput,
  SetNamespaceCdnAuthTypeInput: () => SetNamespaceCdnAuthTypeInput,
  ToggleNamespaceDomainPublicAuthInput: () => ToggleNamespaceDomainPublicAuthInput,
  UpdateGameNamespaceMatchmakerConfigInput: () => UpdateGameNamespaceMatchmakerConfigInput,
  UpdateGameNamespaceVersionInput: () => UpdateGameNamespaceVersionInput,
  UpdateNamespaceCdnAuthUserInput: () => UpdateNamespaceCdnAuthUserInput,
  ValidateGameNamespaceInput: () => ValidateGameNamespaceInput,
  ValidateGameNamespaceMatchmakerConfigInput: () => ValidateGameNamespaceMatchmakerConfigInput,
  ValidateGameNamespaceMatchmakerConfigOutput: () => ValidateGameNamespaceMatchmakerConfigOutput,
  ValidateGameNamespaceOutput: () => ValidateGameNamespaceOutput,
  ValidateGameNamespaceTokenDevelopmentInput: () => ValidateGameNamespaceTokenDevelopmentInput,
  ValidateGameNamespaceTokenDevelopmentOutput: () => ValidateGameNamespaceTokenDevelopmentOutput,
  analytics: () => analytics_exports2,
  logs: () => logs_exports3
});
var init_namespaces = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/index.ts"() {
    "use strict";
    init_resources4();
    init_types15();
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/types/CreateCloudTokenOutput.ts
var CreateCloudTokenOutput;
var init_CreateCloudTokenOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/types/CreateCloudTokenOutput.ts"() {
    "use strict";
    init_core();
    CreateCloudTokenOutput = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/types/index.ts
var init_types16 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/types/index.ts"() {
    "use strict";
    init_CreateCloudTokenOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/index.ts
var tokens_exports2 = {};
__export(tokens_exports2, {
  CreateCloudTokenOutput: () => CreateCloudTokenOutput
});
var init_tokens = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/index.ts"() {
    "use strict";
    init_types16();
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionInput.ts
var CreateGameVersionInput;
var init_CreateGameVersionInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionInput.ts"() {
    "use strict";
    init_core();
    CreateGameVersionInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionOutput.ts
var CreateGameVersionOutput;
var init_CreateGameVersionOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionOutput.ts"() {
    "use strict";
    init_core();
    CreateGameVersionOutput = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionInput.ts
var ValidateGameVersionInput;
var init_ValidateGameVersionInput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionInput.ts"() {
    "use strict";
    init_core();
    ValidateGameVersionInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionOutput.ts
var ValidateGameVersionOutput;
var init_ValidateGameVersionOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionOutput.ts"() {
    "use strict";
    init_core();
    ValidateGameVersionOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/GetGameVersionByIdOutput.ts
var GetGameVersionByIdOutput;
var init_GetGameVersionByIdOutput = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/GetGameVersionByIdOutput.ts"() {
    "use strict";
    init_core();
    GetGameVersionByIdOutput = schemas_exports.object({
      version: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Full)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/index.ts
var init_types17 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/index.ts"() {
    "use strict";
    init_CreateGameVersionInput();
    init_CreateGameVersionOutput();
    init_ValidateGameVersionInput();
    init_ValidateGameVersionOutput();
    init_GetGameVersionByIdOutput();
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/index.ts
var versions_exports2 = {};
__export(versions_exports2, {
  CreateGameVersionInput: () => CreateGameVersionInput,
  CreateGameVersionOutput: () => CreateGameVersionOutput,
  GetGameVersionByIdOutput: () => GetGameVersionByIdOutput,
  ValidateGameVersionInput: () => ValidateGameVersionInput,
  ValidateGameVersionOutput: () => ValidateGameVersionOutput
});
var init_versions = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/index.ts"() {
    "use strict";
    init_types17();
  }
});

// src/serialization/resources/cloud/resources/games/resources/index.ts
var init_resources5 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/index.ts"() {
    "use strict";
    init_avatars();
    init_types8();
    init_builds();
    init_types9();
    init_cdn();
    init_types10();
    init_games();
    init_types11();
    init_matchmaker();
    init_types12();
    init_namespaces();
    init_tokens();
    init_types16();
    init_versions();
    init_types17();
  }
});

// src/serialization/resources/cloud/resources/games/index.ts
var games_exports4 = {};
__export(games_exports4, {
  CreateCloudTokenOutput: () => CreateCloudTokenOutput,
  CreateGameBuildInput: () => CreateGameBuildInput,
  CreateGameBuildOutput: () => CreateGameBuildOutput,
  CreateGameCdnSiteInput: () => CreateGameCdnSiteInput,
  CreateGameCdnSiteOutput: () => CreateGameCdnSiteOutput,
  CreateGameInput: () => CreateGameInput,
  CreateGameOutput: () => CreateGameOutput,
  CreateGameVersionInput: () => CreateGameVersionInput,
  CreateGameVersionOutput: () => CreateGameVersionOutput,
  DeleteMatchmakerLobbyOutput: () => DeleteMatchmakerLobbyOutput,
  ExportLobbyLogsInput: () => ExportLobbyLogsInput,
  ExportLobbyLogsOutput: () => ExportLobbyLogsOutput,
  ExportMatchmakerLobbyHistoryInput: () => ExportMatchmakerLobbyHistoryInput,
  ExportMatchmakerLobbyHistoryOutput: () => ExportMatchmakerLobbyHistoryOutput,
  GameBannerUploadPrepareInput: () => GameBannerUploadPrepareInput,
  GameBannerUploadPrepareOutput: () => GameBannerUploadPrepareOutput,
  GameLogoUploadPrepareInput: () => GameLogoUploadPrepareInput,
  GameLogoUploadPrepareOutput: () => GameLogoUploadPrepareOutput,
  GameSummary: () => GameSummary,
  GetGameByIdOutput: () => GetGameByIdOutput,
  GetGameVersionByIdOutput: () => GetGameVersionByIdOutput,
  GetGamesOutput: () => GetGamesOutput,
  GetLobbyLogsOutput: () => GetLobbyLogsOutput,
  ListGameBuildsOutput: () => ListGameBuildsOutput,
  ListGameCdnSitesOutput: () => ListGameCdnSitesOutput,
  ListGameCustomAvatarsOutput: () => ListGameCustomAvatarsOutput,
  LogStream: () => LogStream2,
  PrepareCustomAvatarUploadInput: () => PrepareCustomAvatarUploadInput,
  PrepareCustomAvatarUploadOutput: () => PrepareCustomAvatarUploadOutput,
  ValidateGameInput: () => ValidateGameInput,
  ValidateGameOutput: () => ValidateGameOutput,
  ValidateGameVersionInput: () => ValidateGameVersionInput,
  ValidateGameVersionOutput: () => ValidateGameVersionOutput,
  avatars: () => avatars_exports2,
  builds: () => builds_exports2,
  cdn: () => cdn_exports3,
  games: () => games_exports3,
  matchmaker: () => matchmaker_exports5,
  namespaces: () => namespaces_exports2,
  tokens: () => tokens_exports2,
  versions: () => versions_exports2
});
var init_games2 = __esm({
  "src/serialization/resources/cloud/resources/games/index.ts"() {
    "use strict";
    init_resources5();
  }
});

// src/serialization/resources/cloud/resources/groups/types/ValidateGroupInput.ts
var ValidateGroupInput;
var init_ValidateGroupInput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/ValidateGroupInput.ts"() {
    "use strict";
    init_core();
    ValidateGroupInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/ValidateGroupOutput.ts
var ValidateGroupOutput;
var init_ValidateGroupOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/ValidateGroupOutput.ts"() {
    "use strict";
    init_core();
    ValidateGroupOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetGroupBillingOutput.ts
var GetGroupBillingOutput;
var init_GetGroupBillingOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetGroupBillingOutput.ts"() {
    "use strict";
    init_core();
    GetGroupBillingOutput = schemas_exports.object({
      billing: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingSummary),
      bankSource: schemas_exports.property(
        "bank_source",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBankSource)
      ),
      availableRegions: schemas_exports.property(
        "available_regions",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetGroupInvoicesListOutput.ts
var GetGroupInvoicesListOutput;
var init_GetGroupInvoicesListOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetGroupInvoicesListOutput.ts"() {
    "use strict";
    init_core();
    GetGroupInvoicesListOutput = schemas_exports.object({
      invoices: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingInvoice)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetGroupPaymentsListOutput.ts
var GetGroupPaymentsListOutput;
var init_GetGroupPaymentsListOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetGroupPaymentsListOutput.ts"() {
    "use strict";
    init_core();
    GetGroupPaymentsListOutput = schemas_exports.object({
      payments: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingPayment)
      ),
      endPaymentId: schemas_exports.property("end_payment_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetGroupTransfersListOutput.ts
var GetGroupTransfersListOutput;
var init_GetGroupTransfersListOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetGroupTransfersListOutput.ts"() {
    "use strict";
    init_core();
    GetGroupTransfersListOutput = schemas_exports.object({
      transfers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingTransfer)
      ),
      endTransferId: schemas_exports.property("end_transfer_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutInput.ts
var GroupBillingCheckoutInput;
var init_GroupBillingCheckoutInput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutInput.ts"() {
    "use strict";
    init_core();
    GroupBillingCheckoutInput = schemas_exports.object({
      amount: schemas_exports.number().optional()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutOutput.ts
var GroupBillingCheckoutOutput;
var init_GroupBillingCheckoutOutput = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutOutput.ts"() {
    "use strict";
    init_core();
    GroupBillingCheckoutOutput = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/index.ts
var init_types18 = __esm({
  "src/serialization/resources/cloud/resources/groups/types/index.ts"() {
    "use strict";
    init_ValidateGroupInput();
    init_ValidateGroupOutput();
    init_GetGroupBillingOutput();
    init_GetGroupInvoicesListOutput();
    init_GetGroupPaymentsListOutput();
    init_GetGroupTransfersListOutput();
    init_GroupBillingCheckoutInput();
    init_GroupBillingCheckoutOutput();
  }
});

// src/serialization/resources/cloud/resources/groups/index.ts
var groups_exports2 = {};
__export(groups_exports2, {
  GetGroupBillingOutput: () => GetGroupBillingOutput,
  GetGroupInvoicesListOutput: () => GetGroupInvoicesListOutput,
  GetGroupPaymentsListOutput: () => GetGroupPaymentsListOutput,
  GetGroupTransfersListOutput: () => GetGroupTransfersListOutput,
  GroupBillingCheckoutInput: () => GroupBillingCheckoutInput,
  GroupBillingCheckoutOutput: () => GroupBillingCheckoutOutput,
  ValidateGroupInput: () => ValidateGroupInput,
  ValidateGroupOutput: () => ValidateGroupOutput
});
var init_groups = __esm({
  "src/serialization/resources/cloud/resources/groups/index.ts"() {
    "use strict";
    init_types18();
  }
});

// src/serialization/resources/cloud/resources/logs/types/GetRayPerfLogsOutput.ts
var GetRayPerfLogsOutput;
var init_GetRayPerfLogsOutput = __esm({
  "src/serialization/resources/cloud/resources/logs/types/GetRayPerfLogsOutput.ts"() {
    "use strict";
    init_core();
    GetRayPerfLogsOutput = schemas_exports.object({
      perfLists: schemas_exports.property(
        "perf_lists",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcPerf)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/logs/types/index.ts
var init_types19 = __esm({
  "src/serialization/resources/cloud/resources/logs/types/index.ts"() {
    "use strict";
    init_GetRayPerfLogsOutput();
  }
});

// src/serialization/resources/cloud/resources/logs/index.ts
var logs_exports4 = {};
__export(logs_exports4, {
  GetRayPerfLogsOutput: () => GetRayPerfLogsOutput
});
var init_logs2 = __esm({
  "src/serialization/resources/cloud/resources/logs/index.ts"() {
    "use strict";
    init_types19();
  }
});

// src/serialization/resources/cloud/resources/tiers/types/GetRegionTiersOutput.ts
var GetRegionTiersOutput;
var init_GetRegionTiersOutput = __esm({
  "src/serialization/resources/cloud/resources/tiers/types/GetRegionTiersOutput.ts"() {
    "use strict";
    init_core();
    GetRegionTiersOutput = schemas_exports.object({
      tiers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionTier)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/tiers/types/index.ts
var init_types20 = __esm({
  "src/serialization/resources/cloud/resources/tiers/types/index.ts"() {
    "use strict";
    init_GetRegionTiersOutput();
  }
});

// src/serialization/resources/cloud/resources/tiers/index.ts
var tiers_exports2 = {};
__export(tiers_exports2, {
  GetRegionTiersOutput: () => GetRegionTiersOutput
});
var init_tiers = __esm({
  "src/serialization/resources/cloud/resources/tiers/index.ts"() {
    "use strict";
    init_types20();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/Config.ts
var Config2;
var init_Config2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/Config.ts"() {
    "use strict";
    init_core();
    Config2 = schemas_exports.object({
      displayNames: schemas_exports.property(
        "display_names",
        schemas_exports.list(schemas_exports.string()).optional()
      ),
      avatars: schemas_exports.list(schemas_exports.string()).optional(),
      customDisplayNames: schemas_exports.property(
        "custom_display_names",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.CustomDisplayName
          )
        ).optional()
      ),
      customAvatars: schemas_exports.property(
        "custom_avatars",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.CustomAvatar
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomDisplayName.ts
var CustomDisplayName;
var init_CustomDisplayName = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomDisplayName.ts"() {
    "use strict";
    init_core();
    CustomDisplayName = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomAvatar.ts
var CustomAvatar;
var init_CustomAvatar = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomAvatar.ts"() {
    "use strict";
    init_core();
    CustomAvatar = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/index.ts
var init_types21 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/index.ts"() {
    "use strict";
    init_Config2();
    init_CustomDisplayName();
    init_CustomAvatar();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts
var pacakge_exports2 = {};
__export(pacakge_exports2, {
  Config: () => Config2,
  CustomAvatar: () => CustomAvatar,
  CustomDisplayName: () => CustomDisplayName
});
var init_pacakge = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts"() {
    "use strict";
    init_types21();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/index.ts
var init_resources6 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/index.ts"() {
    "use strict";
    init_pacakge();
    init_types21();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/index.ts
var identity_exports5 = {};
__export(identity_exports5, {
  Config: () => Config2,
  CustomAvatar: () => CustomAvatar,
  CustomDisplayName: () => CustomDisplayName,
  pacakge: () => pacakge_exports2
});
var init_identity2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/index.ts"() {
    "use strict";
    init_resources6();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortRange.ts
var PortRange;
var init_PortRange = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortRange.ts"() {
    "use strict";
    init_core();
    PortRange = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyProtocol.ts
var ProxyProtocol2;
var init_ProxyProtocol = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyProtocol.ts"() {
    "use strict";
    init_core();
    ProxyProtocol2 = schemas_exports.enum_(["http", "https", "udp"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/Captcha.ts
var Captcha;
var init_Captcha = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/Captcha.ts"() {
    "use strict";
    init_core();
    Captcha = schemas_exports.object({
      requestsBeforeReverify: schemas_exports.property("requests_before_reverify", schemas_exports.number()),
      verificationTtl: schemas_exports.property("verification_ttl", schemas_exports.number()),
      hcaptcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.CaptchaHcaptcha).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptcha.ts
var CaptchaHcaptcha;
var init_CaptchaHcaptcha = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptcha.ts"() {
    "use strict";
    init_core();
    CaptchaHcaptcha = schemas_exports.object({
      level: schemas_exports.lazy(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.CaptchaHcaptchaLevel
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts
var CaptchaHcaptchaLevel2;
var init_CaptchaHcaptchaLevel = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts"() {
    "use strict";
    init_core();
    CaptchaHcaptchaLevel2 = schemas_exports.enum_(["easy", "moderate", "difficult", "always_on"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts
var NetworkMode2;
var init_NetworkMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts"() {
    "use strict";
    init_core();
    NetworkMode2 = schemas_exports.enum_(["bridge", "host"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/index.ts
var init_types22 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/index.ts"() {
    "use strict";
    init_PortRange();
    init_ProxyProtocol();
    init_Captcha();
    init_CaptchaHcaptcha();
    init_CaptchaHcaptchaLevel();
    init_NetworkMode();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts
var common_exports15 = {};
__export(common_exports15, {
  Captcha: () => Captcha,
  CaptchaHcaptcha: () => CaptchaHcaptcha,
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel2,
  NetworkMode: () => NetworkMode2,
  PortRange: () => PortRange,
  ProxyProtocol: () => ProxyProtocol2
});
var init_common3 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts"() {
    "use strict";
    init_types22();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameMode.ts
var GameMode;
var init_GameMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameMode.ts"() {
    "use strict";
    init_core();
    GameMode = schemas_exports.object({
      regions: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRegion
        ).optional()
      ).optional(),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number().optional()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number().optional()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number().optional()),
      docker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDocker
      ).optional(),
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRegion.ts
var GameModeRegion;
var init_GameModeRegion = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRegion.ts"() {
    "use strict";
    init_core();
    GameModeRegion = schemas_exports.object({
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDocker.ts
var GameModeRuntimeDocker;
var init_GameModeRuntimeDocker = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDocker.ts"() {
    "use strict";
    init_core();
    GameModeRuntimeDocker = schemas_exports.object({
      dockerfile: schemas_exports.string().optional(),
      image: schemas_exports.string().optional(),
      args: schemas_exports.list(schemas_exports.string()).optional(),
      env: schemas_exports.record(schemas_exports.string(), schemas_exports.string().optional()).optional(),
      networkMode: schemas_exports.property(
        "network_mode",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.NetworkMode).optional()
      ),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDockerPort
        ).optional()
      ).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDockerPort.ts
var GameModeRuntimeDockerPort;
var init_GameModeRuntimeDockerPort = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDockerPort.ts"() {
    "use strict";
    init_core();
    GameModeRuntimeDockerPort = schemas_exports.object({
      port: schemas_exports.number().optional(),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      protocol: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.ProxyProtocol).optional(),
      devPort: schemas_exports.property("dev_port", schemas_exports.number().optional()),
      devProtocol: schemas_exports.property(
        "dev_protocol",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.ProxyProtocol).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeIdleLobbiesConfig.ts
var GameModeIdleLobbiesConfig;
var init_GameModeIdleLobbiesConfig = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeIdleLobbiesConfig.ts"() {
    "use strict";
    init_core();
    GameModeIdleLobbiesConfig = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/index.ts
var init_types23 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/index.ts"() {
    "use strict";
    init_GameMode();
    init_GameModeRegion();
    init_GameModeRuntimeDocker();
    init_GameModeRuntimeDockerPort();
    init_GameModeIdleLobbiesConfig();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts
var gameMode_exports2 = {};
__export(gameMode_exports2, {
  GameMode: () => GameMode,
  GameModeIdleLobbiesConfig: () => GameModeIdleLobbiesConfig,
  GameModeRegion: () => GameModeRegion,
  GameModeRuntimeDocker: () => GameModeRuntimeDocker,
  GameModeRuntimeDockerPort: () => GameModeRuntimeDockerPort
});
var init_gameMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts"() {
    "use strict";
    init_types23();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroup.ts
var LobbyGroup;
var init_LobbyGroup = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroup.ts"() {
    "use strict";
    init_core();
    LobbyGroup = schemas_exports.object({
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      regions: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRegion
        )
      ),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      runtime: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntime
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntime.ts
var LobbyGroupRuntime;
var init_LobbyGroupRuntime = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntime.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntime = schemas_exports.object({
      docker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDocker
      ).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRegion.ts
var LobbyGroupRegion;
var init_LobbyGroupRegion = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRegion.ts"() {
    "use strict";
    init_core();
    LobbyGroupRegion = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDocker.ts
var LobbyGroupRuntimeDocker;
var init_LobbyGroupRuntimeDocker = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDocker.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDocker = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string().optional()),
      args: schemas_exports.list(schemas_exports.string()),
      envVars: schemas_exports.property(
        "env_vars",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerEnvVar
          )
        )
      ),
      networkMode: schemas_exports.property(
        "network_mode",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.NetworkMode).optional()
      ),
      ports: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerEnvVar.ts
var LobbyGroupRuntimeDockerEnvVar;
var init_LobbyGroupRuntimeDockerEnvVar = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerEnvVar.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDockerEnvVar = schemas_exports.object({
      key: schemas_exports.string(),
      value: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerPort.ts
var LobbyGroupRuntimeDockerPort;
var init_LobbyGroupRuntimeDockerPort = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerPort.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDockerPort = schemas_exports.object({
      label: schemas_exports.string(),
      targetPort: schemas_exports.property("target_port", schemas_exports.number().optional()),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      proxyProtocol: schemas_exports.property(
        "proxy_protocol",
        schemas_exports.lazy(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.ProxyProtocol
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupIdleLobbiesConfig.ts
var LobbyGroupIdleLobbiesConfig;
var init_LobbyGroupIdleLobbiesConfig = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupIdleLobbiesConfig.ts"() {
    "use strict";
    init_core();
    LobbyGroupIdleLobbiesConfig = schemas_exports.object({
      minIdleLobbies: schemas_exports.property("min_idle_lobbies", schemas_exports.number()),
      maxIdleLobbies: schemas_exports.property("max_idle_lobbies", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/index.ts
var init_types24 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/index.ts"() {
    "use strict";
    init_LobbyGroup();
    init_LobbyGroupRuntime();
    init_LobbyGroupRegion();
    init_LobbyGroupRuntimeDocker();
    init_LobbyGroupRuntimeDockerEnvVar();
    init_LobbyGroupRuntimeDockerPort();
    init_LobbyGroupIdleLobbiesConfig();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts
var lobbyGroup_exports2 = {};
__export(lobbyGroup_exports2, {
  LobbyGroup: () => LobbyGroup,
  LobbyGroupIdleLobbiesConfig: () => LobbyGroupIdleLobbiesConfig,
  LobbyGroupRegion: () => LobbyGroupRegion,
  LobbyGroupRuntime: () => LobbyGroupRuntime,
  LobbyGroupRuntimeDocker: () => LobbyGroupRuntimeDocker,
  LobbyGroupRuntimeDockerEnvVar: () => LobbyGroupRuntimeDockerEnvVar,
  LobbyGroupRuntimeDockerPort: () => LobbyGroupRuntimeDockerPort
});
var init_lobbyGroup = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts"() {
    "use strict";
    init_types24();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/index.ts
var init_resources7 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/index.ts"() {
    "use strict";
    init_common3();
    init_types22();
    init_gameMode();
    init_types23();
    init_lobbyGroup();
    init_types24();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/types/Config.ts
var Config3;
var init_Config3 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/types/Config.ts"() {
    "use strict";
    init_core();
    Config3 = schemas_exports.object({
      gameModes: schemas_exports.property(
        "game_modes",
        schemas_exports.record(
          schemas_exports.string(),
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameMode).optional()
        ).optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.Captcha).optional(),
      devHostname: schemas_exports.property("dev_hostname", schemas_exports.string().optional()),
      regions: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRegion).optional()
      ).optional(),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number().optional()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number().optional()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number().optional()),
      docker: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDocker).optional(),
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      ),
      lobbyGroups: schemas_exports.property(
        "lobby_groups",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroup
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/types/index.ts
var init_types25 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_Config3();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/index.ts
var matchmaker_exports6 = {};
__export(matchmaker_exports6, {
  Captcha: () => Captcha,
  CaptchaHcaptcha: () => CaptchaHcaptcha,
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel2,
  Config: () => Config3,
  GameMode: () => GameMode,
  GameModeIdleLobbiesConfig: () => GameModeIdleLobbiesConfig,
  GameModeRegion: () => GameModeRegion,
  GameModeRuntimeDocker: () => GameModeRuntimeDocker,
  GameModeRuntimeDockerPort: () => GameModeRuntimeDockerPort,
  LobbyGroup: () => LobbyGroup,
  LobbyGroupIdleLobbiesConfig: () => LobbyGroupIdleLobbiesConfig,
  LobbyGroupRegion: () => LobbyGroupRegion,
  LobbyGroupRuntime: () => LobbyGroupRuntime,
  LobbyGroupRuntimeDocker: () => LobbyGroupRuntimeDocker,
  LobbyGroupRuntimeDockerEnvVar: () => LobbyGroupRuntimeDockerEnvVar,
  LobbyGroupRuntimeDockerPort: () => LobbyGroupRuntimeDockerPort,
  NetworkMode: () => NetworkMode2,
  PortRange: () => PortRange,
  ProxyProtocol: () => ProxyProtocol2,
  common: () => common_exports15,
  gameMode: () => gameMode_exports2,
  lobbyGroup: () => lobbyGroup_exports2
});
var init_matchmaker2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/index.ts"() {
    "use strict";
    init_resources7();
    init_types25();
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Config.ts
var Config4;
var init_Config4 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Config.ts"() {
    "use strict";
    init_core();
    Config4 = schemas_exports.object({
      buildCommand: schemas_exports.property("build_command", schemas_exports.string().optional()),
      buildOutput: schemas_exports.property("build_output", schemas_exports.string().optional()),
      site: schemas_exports.string().optional(),
      routes: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Route)).optional(),
      siteId: schemas_exports.property("site_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Route.ts
var Route;
var init_Route = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Route.ts"() {
    "use strict";
    init_core();
    Route = schemas_exports.object({
      glob: schemas_exports.string(),
      priority: schemas_exports.number(),
      middlewares: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Middleware)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Middleware.ts
var Middleware;
var init_Middleware = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Middleware.ts"() {
    "use strict";
    init_core();
    Middleware = schemas_exports.object({
      kind: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.MiddlewareKind
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/MiddlewareKind.ts
var MiddlewareKind;
var init_MiddlewareKind = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/MiddlewareKind.ts"() {
    "use strict";
    init_core();
    MiddlewareKind = schemas_exports.object({
      customHeaders: schemas_exports.property(
        "custom_headers",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.CustomHeadersMiddleware).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/CustomHeadersMiddleware.ts
var CustomHeadersMiddleware;
var init_CustomHeadersMiddleware = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/CustomHeadersMiddleware.ts"() {
    "use strict";
    init_core();
    CustomHeadersMiddleware = schemas_exports.object({
      headers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Header)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Header.ts
var Header;
var init_Header = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Header.ts"() {
    "use strict";
    init_core();
    Header = schemas_exports.object({
      name: schemas_exports.string(),
      value: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/index.ts
var init_types26 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/index.ts"() {
    "use strict";
    init_Config4();
    init_Route();
    init_Middleware();
    init_MiddlewareKind();
    init_CustomHeadersMiddleware();
    init_Header();
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/index.ts
var cdn_exports4 = {};
__export(cdn_exports4, {
  Config: () => Config4,
  CustomHeadersMiddleware: () => CustomHeadersMiddleware,
  Header: () => Header,
  Middleware: () => Middleware,
  MiddlewareKind: () => MiddlewareKind,
  Route: () => Route
});
var init_cdn2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/index.ts"() {
    "use strict";
    init_types26();
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/types/Config.ts
var Config5;
var init_Config5 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/types/Config.ts"() {
    "use strict";
    init_core();
    Config5 = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/types/index.ts
var init_types27 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/types/index.ts"() {
    "use strict";
    init_Config5();
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/index.ts
var kv_exports3 = {};
__export(kv_exports3, {
  Config: () => Config5
});
var init_kv = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/index.ts"() {
    "use strict";
    init_types27();
  }
});

// src/serialization/resources/cloud/resources/version/resources/index.ts
var init_resources8 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/index.ts"() {
    "use strict";
    init_identity2();
    init_matchmaker2();
    init_cdn2();
    init_kv();
  }
});

// src/serialization/resources/cloud/resources/version/types/Config.ts
var Config6;
var init_Config6 = __esm({
  "src/serialization/resources/cloud/resources/version/types/Config.ts"() {
    "use strict";
    init_core();
    Config6 = schemas_exports.object({
      cdn: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Config).optional(),
      matchmaker: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.Config).optional(),
      kv: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.kv.Config).optional(),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.Config).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/Full.ts
var Full;
var init_Full = __esm({
  "src/serialization/resources/cloud/resources/version/types/Full.ts"() {
    "use strict";
    init_core();
    Full = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/Summary.ts
var Summary;
var init_Summary = __esm({
  "src/serialization/resources/cloud/resources/version/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/index.ts
var init_types28 = __esm({
  "src/serialization/resources/cloud/resources/version/types/index.ts"() {
    "use strict";
    init_Config6();
    init_Full();
    init_Summary();
  }
});

// src/serialization/resources/cloud/resources/version/index.ts
var version_exports2 = {};
__export(version_exports2, {
  Config: () => Config6,
  Full: () => Full,
  Summary: () => Summary,
  cdn: () => cdn_exports4,
  identity: () => identity_exports5,
  kv: () => kv_exports3,
  matchmaker: () => matchmaker_exports6
});
var init_version = __esm({
  "src/serialization/resources/cloud/resources/version/index.ts"() {
    "use strict";
    init_resources8();
    init_types28();
  }
});

// src/serialization/resources/cloud/resources/index.ts
var init_resources9 = __esm({
  "src/serialization/resources/cloud/resources/index.ts"() {
    "use strict";
    init_auth2();
    init_types5();
    init_common2();
    init_types6();
    init_devices();
    init_games2();
    init_groups();
    init_types18();
    init_logs2();
    init_types19();
    init_tiers();
    init_types20();
    init_version();
  }
});

// src/serialization/resources/cloud/index.ts
var cloud_exports2 = {};
__export(cloud_exports2, {
  AnalyticsLobbySummary: () => AnalyticsLobbySummary,
  AuthAgent: () => AuthAgent,
  AuthAgentGameCloud: () => AuthAgentGameCloud,
  AuthAgentIdentity: () => AuthAgentIdentity,
  BuildSummary: () => BuildSummary,
  CdnAuthType: () => CdnAuthType2,
  CdnNamespaceAuthUser: () => CdnNamespaceAuthUser,
  CdnNamespaceConfig: () => CdnNamespaceConfig,
  CdnNamespaceDomain: () => CdnNamespaceDomain,
  CdnNamespaceDomainVerificationMethod: () => CdnNamespaceDomainVerificationMethod,
  CdnNamespaceDomainVerificationMethodHttp: () => CdnNamespaceDomainVerificationMethodHttp,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus2,
  CdnSiteSummary: () => CdnSiteSummary,
  CustomAvatarSummary: () => CustomAvatarSummary,
  GameFull: () => GameFull,
  GameLobbyExpenses: () => GameLobbyExpenses,
  GetGroupBillingOutput: () => GetGroupBillingOutput,
  GetGroupInvoicesListOutput: () => GetGroupInvoicesListOutput,
  GetGroupPaymentsListOutput: () => GetGroupPaymentsListOutput,
  GetGroupTransfersListOutput: () => GetGroupTransfersListOutput,
  GetRayPerfLogsOutput: () => GetRayPerfLogsOutput,
  GetRegionTiersOutput: () => GetRegionTiersOutput,
  GroupBankSource: () => GroupBankSource,
  GroupBillingCheckoutInput: () => GroupBillingCheckoutInput,
  GroupBillingCheckoutOutput: () => GroupBillingCheckoutOutput,
  GroupBillingInvoice: () => GroupBillingInvoice,
  GroupBillingPayment: () => GroupBillingPayment,
  GroupBillingStatus: () => GroupBillingStatus2,
  GroupBillingSummary: () => GroupBillingSummary,
  GroupBillingTransfer: () => GroupBillingTransfer,
  IdentityNamespaceConfig: () => IdentityNamespaceConfig,
  InspectOutput: () => InspectOutput,
  KvNamespaceConfig: () => KvNamespaceConfig,
  LogsLobbyStatus: () => LogsLobbyStatus,
  LogsLobbyStatusStopped: () => LogsLobbyStatusStopped,
  LogsLobbySummary: () => LogsLobbySummary,
  LogsPerfMark: () => LogsPerfMark,
  LogsPerfSpan: () => LogsPerfSpan,
  MatchmakerDevelopmentPort: () => MatchmakerDevelopmentPort,
  MatchmakerNamespaceConfig: () => MatchmakerNamespaceConfig,
  NamespaceConfig: () => NamespaceConfig,
  NamespaceFull: () => NamespaceFull,
  NamespaceSummary: () => NamespaceSummary,
  RegionSummary: () => RegionSummary,
  RegionTier: () => RegionTier,
  RegionTierExpenses: () => RegionTierExpenses,
  SvcMetrics: () => SvcMetrics,
  SvcPerf: () => SvcPerf,
  ValidateGroupInput: () => ValidateGroupInput,
  ValidateGroupOutput: () => ValidateGroupOutput,
  auth: () => auth_exports2,
  common: () => common_exports14,
  devices: () => devices_exports2,
  games: () => games_exports4,
  groups: () => groups_exports2,
  logs: () => logs_exports4,
  tiers: () => tiers_exports2,
  version: () => version_exports2
});
var init_cloud = __esm({
  "src/serialization/resources/cloud/index.ts"() {
    "use strict";
    init_resources9();
  }
});

// src/serialization/resources/common/types/Identifier.ts
var Identifier;
var init_Identifier = __esm({
  "src/serialization/resources/common/types/Identifier.ts"() {
    "use strict";
    init_core();
    Identifier = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Bio.ts
var Bio;
var init_Bio = __esm({
  "src/serialization/resources/common/types/Bio.ts"() {
    "use strict";
    init_core();
    Bio = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Email.ts
var Email;
var init_Email = __esm({
  "src/serialization/resources/common/types/Email.ts"() {
    "use strict";
    init_core();
    Email = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Jwt.ts
var Jwt;
var init_Jwt = __esm({
  "src/serialization/resources/common/types/Jwt.ts"() {
    "use strict";
    init_core();
    Jwt = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/WatchQuery.ts
var WatchQuery;
var init_WatchQuery = __esm({
  "src/serialization/resources/common/types/WatchQuery.ts"() {
    "use strict";
    init_core();
    WatchQuery = schemas_exports.string().optional();
  }
});

// src/serialization/resources/common/types/WatchResponse.ts
var WatchResponse;
var init_WatchResponse = __esm({
  "src/serialization/resources/common/types/WatchResponse.ts"() {
    "use strict";
    init_core();
    WatchResponse = schemas_exports.object({
      index: schemas_exports.string()
    });
  }
});

// src/serialization/resources/common/types/DisplayName.ts
var DisplayName;
var init_DisplayName = __esm({
  "src/serialization/resources/common/types/DisplayName.ts"() {
    "use strict";
    init_core();
    DisplayName = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/AccountNumber.ts
var AccountNumber;
var init_AccountNumber = __esm({
  "src/serialization/resources/common/types/AccountNumber.ts"() {
    "use strict";
    init_core();
    AccountNumber = schemas_exports.number();
  }
});

// src/serialization/resources/common/types/Timestamp.ts
var Timestamp;
var init_Timestamp = __esm({
  "src/serialization/resources/common/types/Timestamp.ts"() {
    "use strict";
    init_core();
    Timestamp = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/ValidationError.ts
var ValidationError4;
var init_ValidationError = __esm({
  "src/serialization/resources/common/types/ValidationError.ts"() {
    "use strict";
    init_core();
    ValidationError4 = schemas_exports.object({
      path: schemas_exports.list(schemas_exports.string())
    });
  }
});

// src/serialization/resources/common/types/EmptyObject.ts
var EmptyObject;
var init_EmptyObject = __esm({
  "src/serialization/resources/common/types/EmptyObject.ts"() {
    "use strict";
    init_core();
    EmptyObject = schemas_exports.object({});
  }
});

// src/serialization/resources/common/types/index.ts
var init_types29 = __esm({
  "src/serialization/resources/common/types/index.ts"() {
    "use strict";
    init_Identifier();
    init_Bio();
    init_Email();
    init_Jwt();
    init_WatchQuery();
    init_WatchResponse();
    init_DisplayName();
    init_AccountNumber();
    init_Timestamp();
    init_ValidationError();
    init_EmptyObject();
  }
});

// src/serialization/resources/common/index.ts
var common_exports16 = {};
__export(common_exports16, {
  AccountNumber: () => AccountNumber,
  Bio: () => Bio,
  DisplayName: () => DisplayName,
  Email: () => Email,
  EmptyObject: () => EmptyObject,
  Identifier: () => Identifier,
  Jwt: () => Jwt,
  Timestamp: () => Timestamp,
  ValidationError: () => ValidationError4,
  WatchQuery: () => WatchQuery,
  WatchResponse: () => WatchResponse
});
var init_common4 = __esm({
  "src/serialization/resources/common/index.ts"() {
    "use strict";
    init_types29();
  }
});

// src/serialization/resources/game/resources/common/types/Handle.ts
var Handle;
var init_Handle = __esm({
  "src/serialization/resources/game/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      nameId: schemas_exports.property(
        "name_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatSummary.ts
var StatSummary;
var init_StatSummary = __esm({
  "src/serialization/resources/game/resources/common/types/StatSummary.ts"() {
    "use strict";
    init_core();
    StatSummary = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      stats: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Stat)
      )
    });
  }
});

// src/serialization/resources/game/resources/common/types/Stat.ts
var Stat;
var init_Stat = __esm({
  "src/serialization/resources/game/resources/common/types/Stat.ts"() {
    "use strict";
    init_core();
    Stat = schemas_exports.object({
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatConfig),
      overallValue: schemas_exports.property("overall_value", schemas_exports.number())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatConfig.ts
var StatConfig;
var init_StatConfig = __esm({
  "src/serialization/resources/game/resources/common/types/StatConfig.ts"() {
    "use strict";
    init_core();
    StatConfig = schemas_exports.object({
      recordId: schemas_exports.property("record_id", schemas_exports.string()),
      iconId: schemas_exports.property("icon_id", schemas_exports.string()),
      format: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatFormatMethod),
      aggregation: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatAggregationMethod),
      sorting: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatSortingMethod),
      priority: schemas_exports.number(),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      postfixSingular: schemas_exports.property("postfix_singular", schemas_exports.string().optional()),
      postfixPlural: schemas_exports.property("postfix_plural", schemas_exports.string().optional()),
      prefixSingular: schemas_exports.property("prefix_singular", schemas_exports.string().optional()),
      prefixPlural: schemas_exports.property("prefix_plural", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatFormatMethod.ts
var StatFormatMethod2;
var init_StatFormatMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatFormatMethod.ts"() {
    "use strict";
    init_core();
    StatFormatMethod2 = schemas_exports.enum_([
      "integer",
      "float_1",
      "float_2",
      "float_3",
      "duration_minute",
      "duration_second",
      "duration_hundredth_second"
    ]);
  }
});

// src/serialization/resources/game/resources/common/types/StatAggregationMethod.ts
var StatAggregationMethod2;
var init_StatAggregationMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatAggregationMethod.ts"() {
    "use strict";
    init_core();
    StatAggregationMethod2 = schemas_exports.enum_(["sum", "average", "min", "max"]);
  }
});

// src/serialization/resources/game/resources/common/types/StatSortingMethod.ts
var StatSortingMethod2;
var init_StatSortingMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatSortingMethod.ts"() {
    "use strict";
    init_core();
    StatSortingMethod2 = schemas_exports.enum_(["desc", "asc"]);
  }
});

// src/serialization/resources/game/resources/common/types/index.ts
var init_types30 = __esm({
  "src/serialization/resources/game/resources/common/types/index.ts"() {
    "use strict";
    init_Handle();
    init_StatSummary();
    init_Stat();
    init_StatConfig();
    init_StatFormatMethod();
    init_StatAggregationMethod();
    init_StatSortingMethod();
  }
});

// src/serialization/resources/game/resources/common/index.ts
var common_exports17 = {};
__export(common_exports17, {
  Handle: () => Handle,
  Stat: () => Stat,
  StatAggregationMethod: () => StatAggregationMethod2,
  StatConfig: () => StatConfig,
  StatFormatMethod: () => StatFormatMethod2,
  StatSortingMethod: () => StatSortingMethod2,
  StatSummary: () => StatSummary
});
var init_common5 = __esm({
  "src/serialization/resources/game/resources/common/index.ts"() {
    "use strict";
    init_types30();
  }
});

// src/serialization/resources/game/resources/index.ts
var init_resources10 = __esm({
  "src/serialization/resources/game/resources/index.ts"() {
    "use strict";
    init_common5();
    init_types30();
  }
});

// src/serialization/resources/game/index.ts
var game_exports2 = {};
__export(game_exports2, {
  Handle: () => Handle,
  Stat: () => Stat,
  StatAggregationMethod: () => StatAggregationMethod2,
  StatConfig: () => StatConfig,
  StatFormatMethod: () => StatFormatMethod2,
  StatSortingMethod: () => StatSortingMethod2,
  StatSummary: () => StatSummary,
  common: () => common_exports17
});
var init_game = __esm({
  "src/serialization/resources/game/index.ts"() {
    "use strict";
    init_resources10();
  }
});

// src/serialization/resources/geo/resources/common/types/Coord.ts
var Coord;
var init_Coord = __esm({
  "src/serialization/resources/geo/resources/common/types/Coord.ts"() {
    "use strict";
    init_core();
    Coord = schemas_exports.object({
      latitude: schemas_exports.number(),
      longitude: schemas_exports.number()
    });
  }
});

// src/serialization/resources/geo/resources/common/types/Distance.ts
var Distance;
var init_Distance = __esm({
  "src/serialization/resources/geo/resources/common/types/Distance.ts"() {
    "use strict";
    init_core();
    Distance = schemas_exports.object({
      kilometers: schemas_exports.number(),
      miles: schemas_exports.number()
    });
  }
});

// src/serialization/resources/geo/resources/common/types/index.ts
var init_types31 = __esm({
  "src/serialization/resources/geo/resources/common/types/index.ts"() {
    "use strict";
    init_Coord();
    init_Distance();
  }
});

// src/serialization/resources/geo/resources/common/index.ts
var common_exports18 = {};
__export(common_exports18, {
  Coord: () => Coord,
  Distance: () => Distance
});
var init_common6 = __esm({
  "src/serialization/resources/geo/resources/common/index.ts"() {
    "use strict";
    init_types31();
  }
});

// src/serialization/resources/geo/resources/index.ts
var init_resources11 = __esm({
  "src/serialization/resources/geo/resources/index.ts"() {
    "use strict";
    init_common6();
    init_types31();
  }
});

// src/serialization/resources/geo/index.ts
var geo_exports2 = {};
__export(geo_exports2, {
  Coord: () => Coord,
  Distance: () => Distance,
  common: () => common_exports18
});
var init_geo = __esm({
  "src/serialization/resources/geo/index.ts"() {
    "use strict";
    init_resources11();
  }
});

// src/serialization/resources/group/resources/common/types/Summary.ts
var Summary2;
var init_Summary2 = __esm({
  "src/serialization/resources/group/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary2 = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      dispayName: schemas_exports.property(
        "dispay_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean()),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio),
      isCurrentlyIdentityMember: schemas_exports.property(
        "is_currently_identity_member",
        schemas_exports.boolean()
      ),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity),
      memberCount: schemas_exports.property("member_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/group/resources/common/types/Publicity.ts
var Publicity2;
var init_Publicity = __esm({
  "src/serialization/resources/group/resources/common/types/Publicity.ts"() {
    "use strict";
    init_core();
    Publicity2 = schemas_exports.enum_(["open", "closed"]);
  }
});

// src/serialization/resources/group/resources/common/types/Handle.ts
var Handle2;
var init_Handle2 = __esm({
  "src/serialization/resources/group/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle2 = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean().optional())
    });
  }
});

// src/serialization/resources/group/resources/common/types/ExternalLinks.ts
var ExternalLinks;
var init_ExternalLinks = __esm({
  "src/serialization/resources/group/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks = schemas_exports.object({
      profile: schemas_exports.string(),
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/group/resources/common/types/JoinRequest.ts
var JoinRequest;
var init_JoinRequest = __esm({
  "src/serialization/resources/group/resources/common/types/JoinRequest.ts"() {
    "use strict";
    init_core();
    JoinRequest = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      ts: schemas_exports.date()
    });
  }
});

// src/serialization/resources/group/resources/common/types/Member.ts
var Member;
var init_Member = __esm({
  "src/serialization/resources/group/resources/common/types/Member.ts"() {
    "use strict";
    init_core();
    Member = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/group/resources/common/types/Profile.ts
var Profile;
var init_Profile = __esm({
  "src/serialization/resources/group/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean().optional()),
      bio: schemas_exports.string(),
      isCurrentIdentityMember: schemas_exports.property(
        "is_current_identity_member",
        schemas_exports.boolean().optional()
      ),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity),
      memberCount: schemas_exports.property("member_count", schemas_exports.number().optional()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Member)
      ),
      joinRequests: schemas_exports.property(
        "join_requests",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.JoinRequest)
        )
      ),
      isCurrentIdentityRequestingJoin: schemas_exports.property(
        "is_current_identity_requesting_join",
        schemas_exports.boolean().optional()
      ),
      ownerIdentityId: schemas_exports.property("owner_identity_id", schemas_exports.string()),
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/group/resources/common/types/BannedIdentity.ts
var BannedIdentity;
var init_BannedIdentity = __esm({
  "src/serialization/resources/group/resources/common/types/BannedIdentity.ts"() {
    "use strict";
    init_core();
    BannedIdentity = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      banTs: schemas_exports.property("ban_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/group/resources/common/types/index.ts
var init_types32 = __esm({
  "src/serialization/resources/group/resources/common/types/index.ts"() {
    "use strict";
    init_Summary2();
    init_Publicity();
    init_Handle2();
    init_ExternalLinks();
    init_JoinRequest();
    init_Member();
    init_Profile();
    init_BannedIdentity();
  }
});

// src/serialization/resources/group/resources/common/index.ts
var common_exports19 = {};
__export(common_exports19, {
  BannedIdentity: () => BannedIdentity,
  ExternalLinks: () => ExternalLinks,
  Handle: () => Handle2,
  JoinRequest: () => JoinRequest,
  Member: () => Member,
  Profile: () => Profile,
  Publicity: () => Publicity2,
  Summary: () => Summary2
});
var init_common7 = __esm({
  "src/serialization/resources/group/resources/common/index.ts"() {
    "use strict";
    init_types32();
  }
});

// src/serialization/resources/group/resources/invites/types/GetInviteOutput.ts
var GetInviteOutput;
var init_GetInviteOutput = __esm({
  "src/serialization/resources/group/resources/invites/types/GetInviteOutput.ts"() {
    "use strict";
    init_core();
    GetInviteOutput = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/group/resources/invites/types/ConsumeInviteOutput.ts
var ConsumeInviteOutput;
var init_ConsumeInviteOutput = __esm({
  "src/serialization/resources/group/resources/invites/types/ConsumeInviteOutput.ts"() {
    "use strict";
    init_core();
    ConsumeInviteOutput = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/group/resources/invites/types/CreateInviteInput.ts
var CreateInviteInput;
var init_CreateInviteInput = __esm({
  "src/serialization/resources/group/resources/invites/types/CreateInviteInput.ts"() {
    "use strict";
    init_core();
    CreateInviteInput = schemas_exports.object({
      ttl: schemas_exports.number().optional(),
      useCount: schemas_exports.property("use_count", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/group/resources/invites/types/CreateInviteOutput.ts
var CreateInviteOutput;
var init_CreateInviteOutput = __esm({
  "src/serialization/resources/group/resources/invites/types/CreateInviteOutput.ts"() {
    "use strict";
    init_core();
    CreateInviteOutput = schemas_exports.object({
      code: schemas_exports.string()
    });
  }
});

// src/serialization/resources/group/resources/invites/types/index.ts
var init_types33 = __esm({
  "src/serialization/resources/group/resources/invites/types/index.ts"() {
    "use strict";
    init_GetInviteOutput();
    init_ConsumeInviteOutput();
    init_CreateInviteInput();
    init_CreateInviteOutput();
  }
});

// src/serialization/resources/group/resources/invites/index.ts
var invites_exports2 = {};
__export(invites_exports2, {
  ConsumeInviteOutput: () => ConsumeInviteOutput,
  CreateInviteInput: () => CreateInviteInput,
  CreateInviteOutput: () => CreateInviteOutput,
  GetInviteOutput: () => GetInviteOutput
});
var init_invites = __esm({
  "src/serialization/resources/group/resources/invites/index.ts"() {
    "use strict";
    init_types33();
  }
});

// src/serialization/resources/group/resources/joinRequests/types/ResolveJoinRequestInput.ts
var ResolveJoinRequestInput;
var init_ResolveJoinRequestInput = __esm({
  "src/serialization/resources/group/resources/joinRequests/types/ResolveJoinRequestInput.ts"() {
    "use strict";
    init_core();
    ResolveJoinRequestInput = schemas_exports.object({
      resolution: schemas_exports.boolean().optional()
    });
  }
});

// src/serialization/resources/group/resources/joinRequests/types/index.ts
var init_types34 = __esm({
  "src/serialization/resources/group/resources/joinRequests/types/index.ts"() {
    "use strict";
    init_ResolveJoinRequestInput();
  }
});

// src/serialization/resources/group/resources/joinRequests/index.ts
var joinRequests_exports2 = {};
__export(joinRequests_exports2, {
  ResolveJoinRequestInput: () => ResolveJoinRequestInput
});
var init_joinRequests = __esm({
  "src/serialization/resources/group/resources/joinRequests/index.ts"() {
    "use strict";
    init_types34();
  }
});

// src/serialization/resources/group/resources/index.ts
var init_resources12 = __esm({
  "src/serialization/resources/group/resources/index.ts"() {
    "use strict";
    init_common7();
    init_types32();
    init_invites();
    init_types33();
    init_joinRequests();
    init_types34();
  }
});

// src/serialization/resources/group/types/ListSuggestedOutput.ts
var ListSuggestedOutput;
var init_ListSuggestedOutput = __esm({
  "src/serialization/resources/group/types/ListSuggestedOutput.ts"() {
    "use strict";
    init_core();
    ListSuggestedOutput = schemas_exports.object({
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Summary)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/CreateInput.ts
var CreateInput;
var init_CreateInput = __esm({
  "src/serialization/resources/group/types/CreateInput.ts"() {
    "use strict";
    init_core();
    CreateInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/CreateOutput.ts
var CreateOutput;
var init_CreateOutput = __esm({
  "src/serialization/resources/group/types/CreateOutput.ts"() {
    "use strict";
    init_core();
    CreateOutput = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/PrepareAvatarUploadInput.ts
var PrepareAvatarUploadInput;
var init_PrepareAvatarUploadInput = __esm({
  "src/serialization/resources/group/types/PrepareAvatarUploadInput.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadInput = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/group/types/PrepareAvatarUploadOutput.ts
var PrepareAvatarUploadOutput;
var init_PrepareAvatarUploadOutput = __esm({
  "src/serialization/resources/group/types/PrepareAvatarUploadOutput.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadOutput = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/group/types/ValidateProfileInput.ts
var ValidateProfileInput;
var init_ValidateProfileInput = __esm({
  "src/serialization/resources/group/types/ValidateProfileInput.ts"() {
    "use strict";
    init_core();
    ValidateProfileInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string().optional()),
      bio: schemas_exports.string().optional(),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity).optional()
    });
  }
});

// src/serialization/resources/group/types/ValidateProfileOutput.ts
var ValidateProfileOutput;
var init_ValidateProfileOutput = __esm({
  "src/serialization/resources/group/types/ValidateProfileOutput.ts"() {
    "use strict";
    init_core();
    ValidateProfileOutput = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/group/types/SearchOutput.ts
var SearchOutput;
var init_SearchOutput = __esm({
  "src/serialization/resources/group/types/SearchOutput.ts"() {
    "use strict";
    init_core();
    SearchOutput = schemas_exports.object({
      groups: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/group/types/GetBansOutput.ts
var GetBansOutput;
var init_GetBansOutput = __esm({
  "src/serialization/resources/group/types/GetBansOutput.ts"() {
    "use strict";
    init_core();
    GetBansOutput = schemas_exports.object({
      bannedIdentities: schemas_exports.property(
        "banned_identities",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.BannedIdentity)
        )
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetJoinRequestsOutput.ts
var GetJoinRequestsOutput;
var init_GetJoinRequestsOutput = __esm({
  "src/serialization/resources/group/types/GetJoinRequestsOutput.ts"() {
    "use strict";
    init_core();
    GetJoinRequestsOutput = schemas_exports.object({
      joinRequests: schemas_exports.property(
        "join_requests",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.JoinRequest))
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetMembersOutput.ts
var GetMembersOutput;
var init_GetMembersOutput = __esm({
  "src/serialization/resources/group/types/GetMembersOutput.ts"() {
    "use strict";
    init_core();
    GetMembersOutput = schemas_exports.object({
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Member)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetProfileOutput.ts
var GetProfileOutput;
var init_GetProfileOutput = __esm({
  "src/serialization/resources/group/types/GetProfileOutput.ts"() {
    "use strict";
    init_core();
    GetProfileOutput = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/UpdateProfileInput.ts
var UpdateProfileInput;
var init_UpdateProfileInput = __esm({
  "src/serialization/resources/group/types/UpdateProfileInput.ts"() {
    "use strict";
    init_core();
    UpdateProfileInput = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string().optional()),
      bio: schemas_exports.string().optional(),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity).optional()
    });
  }
});

// src/serialization/resources/group/types/GetSummaryOutput.ts
var GetSummaryOutput;
var init_GetSummaryOutput = __esm({
  "src/serialization/resources/group/types/GetSummaryOutput.ts"() {
    "use strict";
    init_core();
    GetSummaryOutput = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Summary)
    });
  }
});

// src/serialization/resources/group/types/TransferOwnershipInput.ts
var TransferOwnershipInput;
var init_TransferOwnershipInput = __esm({
  "src/serialization/resources/group/types/TransferOwnershipInput.ts"() {
    "use strict";
    init_core();
    TransferOwnershipInput = schemas_exports.object({
      newOwnerIdentityId: schemas_exports.property("new_owner_identity_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/index.ts
var init_types35 = __esm({
  "src/serialization/resources/group/types/index.ts"() {
    "use strict";
    init_ListSuggestedOutput();
    init_CreateInput();
    init_CreateOutput();
    init_PrepareAvatarUploadInput();
    init_PrepareAvatarUploadOutput();
    init_ValidateProfileInput();
    init_ValidateProfileOutput();
    init_SearchOutput();
    init_GetBansOutput();
    init_GetJoinRequestsOutput();
    init_GetMembersOutput();
    init_GetProfileOutput();
    init_UpdateProfileInput();
    init_GetSummaryOutput();
    init_TransferOwnershipInput();
  }
});

// src/serialization/resources/group/index.ts
var group_exports2 = {};
__export(group_exports2, {
  BannedIdentity: () => BannedIdentity,
  ConsumeInviteOutput: () => ConsumeInviteOutput,
  CreateInput: () => CreateInput,
  CreateInviteInput: () => CreateInviteInput,
  CreateInviteOutput: () => CreateInviteOutput,
  CreateOutput: () => CreateOutput,
  ExternalLinks: () => ExternalLinks,
  GetBansOutput: () => GetBansOutput,
  GetInviteOutput: () => GetInviteOutput,
  GetJoinRequestsOutput: () => GetJoinRequestsOutput,
  GetMembersOutput: () => GetMembersOutput,
  GetProfileOutput: () => GetProfileOutput,
  GetSummaryOutput: () => GetSummaryOutput,
  Handle: () => Handle2,
  JoinRequest: () => JoinRequest,
  ListSuggestedOutput: () => ListSuggestedOutput,
  Member: () => Member,
  PrepareAvatarUploadInput: () => PrepareAvatarUploadInput,
  PrepareAvatarUploadOutput: () => PrepareAvatarUploadOutput,
  Profile: () => Profile,
  Publicity: () => Publicity2,
  ResolveJoinRequestInput: () => ResolveJoinRequestInput,
  SearchOutput: () => SearchOutput,
  Summary: () => Summary2,
  TransferOwnershipInput: () => TransferOwnershipInput,
  UpdateProfileInput: () => UpdateProfileInput,
  ValidateProfileInput: () => ValidateProfileInput,
  ValidateProfileOutput: () => ValidateProfileOutput,
  common: () => common_exports19,
  invites: () => invites_exports2,
  joinRequests: () => joinRequests_exports2
});
var init_group = __esm({
  "src/serialization/resources/group/index.ts"() {
    "use strict";
    init_resources12();
    init_types35();
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEvent.ts
var GlobalEvent;
var init_GlobalEvent = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEvent.ts"() {
    "use strict";
    init_core();
    GlobalEvent = schemas_exports.object({
      ts: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp),
      kind: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventKind),
      notification: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventNotification
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventKind.ts
var GlobalEventKind;
var init_GlobalEventKind = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventKind.ts"() {
    "use strict";
    init_core();
    GlobalEventKind = schemas_exports.object({
      chatMessage: schemas_exports.property(
        "chat_message",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatMessage).optional()
      ),
      chatRead: schemas_exports.property(
        "chat_read",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatRead).optional()
      ),
      partyUpdate: schemas_exports.property(
        "party_update",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventPartyUpdate).optional()
      ),
      identityUpdate: schemas_exports.property(
        "identity_update",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventIdentityUpdate).optional()
      ),
      matchmakerLobbyJoin: schemas_exports.property(
        "matchmaker_lobby_join",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventMatchmakerLobbyJoin).optional()
      ),
      chatThreadRemove: schemas_exports.property(
        "chat_thread_remove",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatThreadRemove).optional()
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventNotification.ts
var GlobalEventNotification;
var init_GlobalEventNotification = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventNotification.ts"() {
    "use strict";
    init_core();
    GlobalEventNotification = schemas_exports.object({
      title: schemas_exports.string(),
      description: schemas_exports.string(),
      thumbnailUrl: schemas_exports.property("thumbnail_url", schemas_exports.string()),
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatMessage.ts
var GlobalEventChatMessage;
var init_GlobalEventChatMessage = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatMessage.ts"() {
    "use strict";
    init_core();
    GlobalEventChatMessage = schemas_exports.object({
      thread: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Thread)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatRead.ts
var GlobalEventChatRead;
var init_GlobalEventChatRead = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatRead.ts"() {
    "use strict";
    init_core();
    GlobalEventChatRead = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      readTs: schemas_exports.property(
        "read_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventPartyUpdate.ts
var GlobalEventPartyUpdate;
var init_GlobalEventPartyUpdate = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventPartyUpdate.ts"() {
    "use strict";
    init_core();
    GlobalEventPartyUpdate = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventIdentityUpdate.ts
var GlobalEventIdentityUpdate;
var init_GlobalEventIdentityUpdate = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventIdentityUpdate.ts"() {
    "use strict";
    init_core();
    GlobalEventIdentityUpdate = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventMatchmakerLobbyJoin.ts
var GlobalEventMatchmakerLobbyJoin;
var init_GlobalEventMatchmakerLobbyJoin = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventMatchmakerLobbyJoin.ts"() {
    "use strict";
    init_core();
    GlobalEventMatchmakerLobbyJoin = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort).optional()
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatThreadRemove.ts
var GlobalEventChatThreadRemove;
var init_GlobalEventChatThreadRemove = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatThreadRemove.ts"() {
    "use strict";
    init_core();
    GlobalEventChatThreadRemove = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/UpdateGameActivity.ts
var UpdateGameActivity;
var init_UpdateGameActivity = __esm({
  "src/serialization/resources/identity/resources/common/types/UpdateGameActivity.ts"() {
    "use strict";
    init_core();
    UpdateGameActivity = schemas_exports.object({
      message: schemas_exports.string().optional(),
      publicMetadata: schemas_exports.property("public_metadata", schemas_exports.unknown()),
      mutualMetadata: schemas_exports.property("mutual_metadata", schemas_exports.unknown())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Handle.ts
var Handle3;
var init_Handle3 = __esm({
  "src/serialization/resources/identity/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle3 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Summary.ts
var Summary3;
var init_Summary3 = __esm({
  "src/serialization/resources/identity/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary3 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks),
      following: schemas_exports.boolean(),
      isFollowingMe: schemas_exports.property("is_following_me", schemas_exports.boolean()),
      isMutualFollowing: schemas_exports.property("is_mutual_following", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Profile.ts
var Profile2;
var init_Profile2 = __esm({
  "src/serialization/resources/identity/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile2 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks),
      isAdmin: schemas_exports.property("is_admin", schemas_exports.boolean()),
      isGameLinked: schemas_exports.property("is_game_linked", schemas_exports.boolean().optional()),
      devState: schemas_exports.property(
        "dev_state",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.DevState).optional()
      ),
      followerCount: schemas_exports.property("follower_count", schemas_exports.number()),
      followingCount: schemas_exports.property("following_count", schemas_exports.number()),
      following: schemas_exports.boolean(),
      isFollowingMe: schemas_exports.property("is_following_me", schemas_exports.boolean()),
      isMutualFollowing: schemas_exports.property("is_mutual_following", schemas_exports.boolean()),
      joinTs: schemas_exports.property(
        "join_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio),
      linkedAccounts: schemas_exports.property(
        "linked_accounts",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.LinkedAccount)
        )
      ),
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Group)
      ),
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatSummary)
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/ExternalLinks.ts
var ExternalLinks2;
var init_ExternalLinks2 = __esm({
  "src/serialization/resources/identity/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks2 = schemas_exports.object({
      profile: schemas_exports.string(),
      settings: schemas_exports.string().optional(),
      chat: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Presence.ts
var Presence;
var init_Presence = __esm({
  "src/serialization/resources/identity/resources/common/types/Presence.ts"() {
    "use strict";
    init_core();
    Presence = schemas_exports.object({
      updateTs: schemas_exports.property("update_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Status),
      gameActivity: schemas_exports.property(
        "game_activity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GameActivity).optional()
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Status.ts
var Status2;
var init_Status = __esm({
  "src/serialization/resources/identity/resources/common/types/Status.ts"() {
    "use strict";
    init_core();
    Status2 = schemas_exports.enum_(["online", "away", "offline"]);
  }
});

// src/serialization/resources/identity/resources/common/types/GameActivity.ts
var GameActivity;
var init_GameActivity = __esm({
  "src/serialization/resources/identity/resources/common/types/GameActivity.ts"() {
    "use strict";
    init_core();
    GameActivity = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      message: schemas_exports.string(),
      publicMetadata: schemas_exports.property("public_metadata", schemas_exports.unknown()),
      mutualMetadata: schemas_exports.property("mutual_metadata", schemas_exports.unknown())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Group.ts
var Group;
var init_Group = __esm({
  "src/serialization/resources/identity/resources/common/types/Group.ts"() {
    "use strict";
    init_core();
    Group = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/DevState.ts
var DevState2;
var init_DevState = __esm({
  "src/serialization/resources/identity/resources/common/types/DevState.ts"() {
    "use strict";
    init_core();
    DevState2 = schemas_exports.enum_(["inactive", "pending", "accepted"]);
  }
});

// src/serialization/resources/identity/resources/common/types/LinkedAccount.ts
var LinkedAccount;
var init_LinkedAccount = __esm({
  "src/serialization/resources/identity/resources/common/types/LinkedAccount.ts"() {
    "use strict";
    init_core();
    LinkedAccount = schemas_exports.object({
      email: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.EmailLinkedAccount).optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/EmailLinkedAccount.ts
var EmailLinkedAccount;
var init_EmailLinkedAccount = __esm({
  "src/serialization/resources/identity/resources/common/types/EmailLinkedAccount.ts"() {
    "use strict";
    init_core();
    EmailLinkedAccount = schemas_exports.object({
      email: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Email)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GameLinkStatus.ts
var GameLinkStatus2;
var init_GameLinkStatus = __esm({
  "src/serialization/resources/identity/resources/common/types/GameLinkStatus.ts"() {
    "use strict";
    init_core();
    GameLinkStatus2 = schemas_exports.enum_(["incomplete", "complete", "cancelled"]);
  }
});

// src/serialization/resources/identity/resources/common/types/index.ts
var init_types36 = __esm({
  "src/serialization/resources/identity/resources/common/types/index.ts"() {
    "use strict";
    init_GlobalEvent();
    init_GlobalEventKind();
    init_GlobalEventNotification();
    init_GlobalEventChatMessage();
    init_GlobalEventChatRead();
    init_GlobalEventPartyUpdate();
    init_GlobalEventIdentityUpdate();
    init_GlobalEventMatchmakerLobbyJoin();
    init_GlobalEventChatThreadRemove();
    init_UpdateGameActivity();
    init_Handle3();
    init_Summary3();
    init_Profile2();
    init_ExternalLinks2();
    init_Presence();
    init_Status();
    init_GameActivity();
    init_Group();
    init_DevState();
    init_LinkedAccount();
    init_EmailLinkedAccount();
    init_GameLinkStatus();
  }
});

// src/serialization/resources/identity/resources/common/index.ts
var common_exports20 = {};
__export(common_exports20, {
  DevState: () => DevState2,
  EmailLinkedAccount: () => EmailLinkedAccount,
  ExternalLinks: () => ExternalLinks2,
  GameActivity: () => GameActivity,
  GameLinkStatus: () => GameLinkStatus2,
  GlobalEvent: () => GlobalEvent,
  GlobalEventChatMessage: () => GlobalEventChatMessage,
  GlobalEventChatRead: () => GlobalEventChatRead,
  GlobalEventChatThreadRemove: () => GlobalEventChatThreadRemove,
  GlobalEventIdentityUpdate: () => GlobalEventIdentityUpdate,
  GlobalEventKind: () => GlobalEventKind,
  GlobalEventMatchmakerLobbyJoin: () => GlobalEventMatchmakerLobbyJoin,
  GlobalEventNotification: () => GlobalEventNotification,
  GlobalEventPartyUpdate: () => GlobalEventPartyUpdate,
  Group: () => Group,
  Handle: () => Handle3,
  LinkedAccount: () => LinkedAccount,
  Presence: () => Presence,
  Profile: () => Profile2,
  Status: () => Status2,
  Summary: () => Summary3,
  UpdateGameActivity: () => UpdateGameActivity
});
var init_common8 = __esm({
  "src/serialization/resources/identity/resources/common/index.ts"() {
    "use strict";
    init_types36();
  }
});

// src/serialization/resources/identity/resources/events/types/WatchEventsOutput.ts
var WatchEventsOutput;
var init_WatchEventsOutput = __esm({
  "src/serialization/resources/identity/resources/events/types/WatchEventsOutput.ts"() {
    "use strict";
    init_core();
    WatchEventsOutput = schemas_exports.object({
      events: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEvent)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/resources/events/types/index.ts
var init_types37 = __esm({
  "src/serialization/resources/identity/resources/events/types/index.ts"() {
    "use strict";
    init_WatchEventsOutput();
  }
});

// src/serialization/resources/identity/resources/events/index.ts
var events_exports2 = {};
__export(events_exports2, {
  WatchEventsOutput: () => WatchEventsOutput
});
var init_events = __esm({
  "src/serialization/resources/identity/resources/events/index.ts"() {
    "use strict";
    init_types37();
  }
});

// src/serialization/resources/identity/resources/links/types/PrepareGameLinkOutput.ts
var PrepareGameLinkOutput;
var init_PrepareGameLinkOutput = __esm({
  "src/serialization/resources/identity/resources/links/types/PrepareGameLinkOutput.ts"() {
    "use strict";
    init_core();
    PrepareGameLinkOutput = schemas_exports.object({
      identityLinkToken: schemas_exports.property("identity_link_token", schemas_exports.string()),
      identityLinkUrl: schemas_exports.property("identity_link_url", schemas_exports.string()),
      expireTs: schemas_exports.property(
        "expire_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      )
    });
  }
});

// src/serialization/resources/identity/resources/links/types/GetGameLinkOutput.ts
var GetGameLinkOutput;
var init_GetGameLinkOutput = __esm({
  "src/serialization/resources/identity/resources/links/types/GetGameLinkOutput.ts"() {
    "use strict";
    init_core();
    GetGameLinkOutput = schemas_exports.object({
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GameLinkStatus),
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      currentIdentity: schemas_exports.property(
        "current_identity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      newIdentity: schemas_exports.property(
        "new_identity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GetGameLinkNewIdentity)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/resources/links/types/GetGameLinkNewIdentity.ts
var GetGameLinkNewIdentity;
var init_GetGameLinkNewIdentity = __esm({
  "src/serialization/resources/identity/resources/links/types/GetGameLinkNewIdentity.ts"() {
    "use strict";
    init_core();
    GetGameLinkNewIdentity = schemas_exports.object({
      identityToken: schemas_exports.property(
        "identity_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
      ),
      identityTokenExpireTs: schemas_exports.property(
        "identity_token_expire_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile)
    });
  }
});

// src/serialization/resources/identity/resources/links/types/index.ts
var init_types38 = __esm({
  "src/serialization/resources/identity/resources/links/types/index.ts"() {
    "use strict";
    init_PrepareGameLinkOutput();
    init_GetGameLinkOutput();
    init_GetGameLinkNewIdentity();
  }
});

// src/serialization/resources/identity/resources/links/index.ts
var links_exports4 = {};
__export(links_exports4, {
  GetGameLinkNewIdentity: () => GetGameLinkNewIdentity,
  GetGameLinkOutput: () => GetGameLinkOutput,
  PrepareGameLinkOutput: () => PrepareGameLinkOutput
});
var init_links2 = __esm({
  "src/serialization/resources/identity/resources/links/index.ts"() {
    "use strict";
    init_types38();
  }
});

// src/serialization/resources/identity/resources/index.ts
var init_resources13 = __esm({
  "src/serialization/resources/identity/resources/index.ts"() {
    "use strict";
    init_common8();
    init_types36();
    init_events();
    init_types37();
    init_links2();
    init_types38();
  }
});

// src/serialization/resources/identity/types/SetupOutput.ts
var SetupOutput;
var init_SetupOutput = __esm({
  "src/serialization/resources/identity/types/SetupOutput.ts"() {
    "use strict";
    init_core();
    SetupOutput = schemas_exports.object({
      identityToken: schemas_exports.property(
        "identity_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
      ),
      identityTokenExpireTs: schemas_exports.property(
        "identity_token_expire_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile),
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/identity/types/GetProfileOutput.ts
var GetProfileOutput2;
var init_GetProfileOutput2 = __esm({
  "src/serialization/resources/identity/types/GetProfileOutput.ts"() {
    "use strict";
    init_core();
    GetProfileOutput2 = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/GetHandlesOutput.ts
var GetHandlesOutput;
var init_GetHandlesOutput = __esm({
  "src/serialization/resources/identity/types/GetHandlesOutput.ts"() {
    "use strict";
    init_core();
    GetHandlesOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      )
    });
  }
});

// src/serialization/resources/identity/types/GetSummariesOutput.ts
var GetSummariesOutput;
var init_GetSummariesOutput = __esm({
  "src/serialization/resources/identity/types/GetSummariesOutput.ts"() {
    "use strict";
    init_core();
    GetSummariesOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Summary)
      )
    });
  }
});

// src/serialization/resources/identity/types/SearchOutput.ts
var SearchOutput2;
var init_SearchOutput2 = __esm({
  "src/serialization/resources/identity/types/SearchOutput.ts"() {
    "use strict";
    init_core();
    SearchOutput2 = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string()
    });
  }
});

// src/serialization/resources/identity/types/PrepareAvatarUploadOutput.ts
var PrepareAvatarUploadOutput2;
var init_PrepareAvatarUploadOutput2 = __esm({
  "src/serialization/resources/identity/types/PrepareAvatarUploadOutput.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadOutput2 = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/identity/types/ListFollowersOutput.ts
var ListFollowersOutput;
var init_ListFollowersOutput = __esm({
  "src/serialization/resources/identity/types/ListFollowersOutput.ts"() {
    "use strict";
    init_core();
    ListFollowersOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      )
    });
  }
});

// src/serialization/resources/identity/types/ListRecentFollowersOutput.ts
var ListRecentFollowersOutput;
var init_ListRecentFollowersOutput = __esm({
  "src/serialization/resources/identity/types/ListRecentFollowersOutput.ts"() {
    "use strict";
    init_core();
    ListRecentFollowersOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/ListFriendsOutput.ts
var ListFriendsOutput;
var init_ListFriendsOutput = __esm({
  "src/serialization/resources/identity/types/ListFriendsOutput.ts"() {
    "use strict";
    init_core();
    ListFriendsOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/types/ListMutualFriendsOutput.ts
var ListMutualFriendsOutput;
var init_ListMutualFriendsOutput = __esm({
  "src/serialization/resources/identity/types/ListMutualFriendsOutput.ts"() {
    "use strict";
    init_core();
    ListMutualFriendsOutput = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/types/index.ts
var init_types39 = __esm({
  "src/serialization/resources/identity/types/index.ts"() {
    "use strict";
    init_SetupOutput();
    init_GetProfileOutput2();
    init_GetHandlesOutput();
    init_GetSummariesOutput();
    init_SearchOutput2();
    init_PrepareAvatarUploadOutput2();
    init_ListFollowersOutput();
    init_ListRecentFollowersOutput();
    init_ListFriendsOutput();
    init_ListMutualFriendsOutput();
  }
});

// src/serialization/resources/identity/client/requests/UpdateProfileInput.ts
var UpdateProfileInput2;
var init_UpdateProfileInput2 = __esm({
  "src/serialization/resources/identity/client/requests/UpdateProfileInput.ts"() {
    "use strict";
    init_core();
    UpdateProfileInput2 = schemas_exports.object({
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName).optional()
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber).optional()
      ),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio).optional()
    });
  }
});

// src/serialization/resources/identity/client/requests/ValidateProfileInput.ts
var ValidateProfileInput2;
var init_ValidateProfileInput2 = __esm({
  "src/serialization/resources/identity/client/requests/ValidateProfileInput.ts"() {
    "use strict";
    init_core();
    ValidateProfileInput2 = schemas_exports.object({
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName).optional()
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber).optional()
      ),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio).optional()
    });
  }
});

// src/serialization/resources/identity/client/requests/SetGameActivityInput.ts
var SetGameActivityInput;
var init_SetGameActivityInput = __esm({
  "src/serialization/resources/identity/client/requests/SetGameActivityInput.ts"() {
    "use strict";
    init_core();
    SetGameActivityInput = schemas_exports.object({
      gameActivity: schemas_exports.property(
        "game_activity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.UpdateGameActivity)
      )
    });
  }
});

// src/serialization/resources/identity/client/requests/UpdateStatusInput.ts
var UpdateStatusInput;
var init_UpdateStatusInput = __esm({
  "src/serialization/resources/identity/client/requests/UpdateStatusInput.ts"() {
    "use strict";
    init_core();
    UpdateStatusInput = schemas_exports.object({
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Status)
    });
  }
});

// src/serialization/resources/identity/client/requests/PrepareAvatarUploadInput.ts
var PrepareAvatarUploadInput2;
var init_PrepareAvatarUploadInput2 = __esm({
  "src/serialization/resources/identity/client/requests/PrepareAvatarUploadInput.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadInput2 = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/identity/client/requests/ReportIdentityInput.ts
var ReportIdentityInput;
var init_ReportIdentityInput = __esm({
  "src/serialization/resources/identity/client/requests/ReportIdentityInput.ts"() {
    "use strict";
    init_core();
    ReportIdentityInput = schemas_exports.object({
      reason: schemas_exports.string()
    });
  }
});

// src/serialization/resources/identity/client/requests/index.ts
var init_requests = __esm({
  "src/serialization/resources/identity/client/requests/index.ts"() {
    "use strict";
    init_UpdateProfileInput2();
    init_ValidateProfileInput2();
    init_SetGameActivityInput();
    init_UpdateStatusInput();
    init_PrepareAvatarUploadInput2();
    init_ReportIdentityInput();
  }
});

// src/serialization/resources/identity/client/index.ts
var init_client = __esm({
  "src/serialization/resources/identity/client/index.ts"() {
    "use strict";
    init_requests();
  }
});

// src/serialization/resources/identity/index.ts
var identity_exports6 = {};
__export(identity_exports6, {
  DevState: () => DevState2,
  EmailLinkedAccount: () => EmailLinkedAccount,
  ExternalLinks: () => ExternalLinks2,
  GameActivity: () => GameActivity,
  GameLinkStatus: () => GameLinkStatus2,
  GetGameLinkNewIdentity: () => GetGameLinkNewIdentity,
  GetGameLinkOutput: () => GetGameLinkOutput,
  GetHandlesOutput: () => GetHandlesOutput,
  GetProfileOutput: () => GetProfileOutput2,
  GetSummariesOutput: () => GetSummariesOutput,
  GlobalEvent: () => GlobalEvent,
  GlobalEventChatMessage: () => GlobalEventChatMessage,
  GlobalEventChatRead: () => GlobalEventChatRead,
  GlobalEventChatThreadRemove: () => GlobalEventChatThreadRemove,
  GlobalEventIdentityUpdate: () => GlobalEventIdentityUpdate,
  GlobalEventKind: () => GlobalEventKind,
  GlobalEventMatchmakerLobbyJoin: () => GlobalEventMatchmakerLobbyJoin,
  GlobalEventNotification: () => GlobalEventNotification,
  GlobalEventPartyUpdate: () => GlobalEventPartyUpdate,
  Group: () => Group,
  Handle: () => Handle3,
  LinkedAccount: () => LinkedAccount,
  ListFollowersOutput: () => ListFollowersOutput,
  ListFriendsOutput: () => ListFriendsOutput,
  ListMutualFriendsOutput: () => ListMutualFriendsOutput,
  ListRecentFollowersOutput: () => ListRecentFollowersOutput,
  PrepareAvatarUploadInput: () => PrepareAvatarUploadInput2,
  PrepareAvatarUploadOutput: () => PrepareAvatarUploadOutput2,
  PrepareGameLinkOutput: () => PrepareGameLinkOutput,
  Presence: () => Presence,
  Profile: () => Profile2,
  ReportIdentityInput: () => ReportIdentityInput,
  SearchOutput: () => SearchOutput2,
  SetGameActivityInput: () => SetGameActivityInput,
  SetupOutput: () => SetupOutput,
  Status: () => Status2,
  Summary: () => Summary3,
  UpdateGameActivity: () => UpdateGameActivity,
  UpdateProfileInput: () => UpdateProfileInput2,
  UpdateStatusInput: () => UpdateStatusInput,
  ValidateProfileInput: () => ValidateProfileInput2,
  WatchEventsOutput: () => WatchEventsOutput,
  common: () => common_exports20,
  events: () => events_exports2,
  links: () => links_exports4
});
var init_identity3 = __esm({
  "src/serialization/resources/identity/index.ts"() {
    "use strict";
    init_resources13();
    init_types39();
    init_client();
  }
});

// src/serialization/resources/kv/resources/batch/types/GetBatchOutput.ts
var GetBatchOutput;
var init_GetBatchOutput = __esm({
  "src/serialization/resources/kv/resources/batch/types/GetBatchOutput.ts"() {
    "use strict";
    init_core();
    GetBatchOutput = schemas_exports.object({
      entries: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Entry)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/kv/resources/batch/types/PutBatchInput.ts
var PutBatchInput;
var init_PutBatchInput = __esm({
  "src/serialization/resources/kv/resources/batch/types/PutBatchInput.ts"() {
    "use strict";
    init_core();
    PutBatchInput = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string().optional()),
      entries: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.PutEntry)
      )
    });
  }
});

// src/serialization/resources/kv/resources/batch/types/index.ts
var init_types40 = __esm({
  "src/serialization/resources/kv/resources/batch/types/index.ts"() {
    "use strict";
    init_GetBatchOutput();
    init_PutBatchInput();
  }
});

// src/serialization/resources/kv/resources/batch/index.ts
var batch_exports2 = {};
__export(batch_exports2, {
  GetBatchOutput: () => GetBatchOutput,
  PutBatchInput: () => PutBatchInput
});
var init_batch = __esm({
  "src/serialization/resources/kv/resources/batch/index.ts"() {
    "use strict";
    init_types40();
  }
});

// src/serialization/resources/kv/resources/common/types/Entry.ts
var Entry;
var init_Entry = __esm({
  "src/serialization/resources/kv/resources/common/types/Entry.ts"() {
    "use strict";
    init_core();
    Entry = schemas_exports.object({
      key: schemas_exports.list(schemas_exports.string()),
      deleted: schemas_exports.boolean().optional()
    });
  }
});

// src/serialization/resources/kv/resources/common/types/PutEntry.ts
var PutEntry;
var init_PutEntry = __esm({
  "src/serialization/resources/kv/resources/common/types/PutEntry.ts"() {
    "use strict";
    init_core();
    PutEntry = schemas_exports.object({
      key: schemas_exports.string()
    });
  }
});

// src/serialization/resources/kv/resources/common/types/index.ts
var init_types41 = __esm({
  "src/serialization/resources/kv/resources/common/types/index.ts"() {
    "use strict";
    init_Entry();
    init_PutEntry();
  }
});

// src/serialization/resources/kv/resources/common/index.ts
var common_exports21 = {};
__export(common_exports21, {
  Entry: () => Entry,
  PutEntry: () => PutEntry
});
var init_common9 = __esm({
  "src/serialization/resources/kv/resources/common/index.ts"() {
    "use strict";
    init_types41();
  }
});

// src/serialization/resources/kv/resources/index.ts
var init_resources14 = __esm({
  "src/serialization/resources/kv/resources/index.ts"() {
    "use strict";
    init_batch();
    init_types40();
    init_common9();
    init_types41();
  }
});

// src/serialization/resources/kv/types/GetOutput.ts
var GetOutput;
var init_GetOutput = __esm({
  "src/serialization/resources/kv/types/GetOutput.ts"() {
    "use strict";
    init_core();
    GetOutput = schemas_exports.object({
      deleted: schemas_exports.boolean().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/kv/types/PutInput.ts
var PutInput;
var init_PutInput = __esm({
  "src/serialization/resources/kv/types/PutInput.ts"() {
    "use strict";
    init_core();
    PutInput = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string().optional()),
      key: schemas_exports.string()
    });
  }
});

// src/serialization/resources/kv/types/index.ts
var init_types42 = __esm({
  "src/serialization/resources/kv/types/index.ts"() {
    "use strict";
    init_GetOutput();
    init_PutInput();
  }
});

// src/serialization/resources/kv/index.ts
var kv_exports4 = {};
__export(kv_exports4, {
  Entry: () => Entry,
  GetBatchOutput: () => GetBatchOutput,
  GetOutput: () => GetOutput,
  PutBatchInput: () => PutBatchInput,
  PutEntry: () => PutEntry,
  PutInput: () => PutInput,
  batch: () => batch_exports2,
  common: () => common_exports21
});
var init_kv2 = __esm({
  "src/serialization/resources/kv/index.ts"() {
    "use strict";
    init_resources14();
    init_types42();
  }
});

// src/serialization/resources/matchmaker/resources/common/types/LobbyInfo.ts
var LobbyInfo;
var init_LobbyInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/LobbyInfo.ts"() {
    "use strict";
    init_core();
    LobbyInfo = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      gameModeId: schemas_exports.property("game_mode_id", schemas_exports.string()),
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/GameModeInfo.ts
var GameModeInfo;
var init_GameModeInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/GameModeInfo.ts"() {
    "use strict";
    init_core();
    GameModeInfo = schemas_exports.object({
      gameModeId: schemas_exports.property(
        "game_mode_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/RegionInfo.ts
var RegionInfo;
var init_RegionInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/RegionInfo.ts"() {
    "use strict";
    init_core();
    RegionInfo = schemas_exports.object({
      regionId: schemas_exports.property(
        "region_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      providerDisplayName: schemas_exports.property("provider_display_name", schemas_exports.string()),
      regionDisplayName: schemas_exports.property("region_display_name", schemas_exports.string()),
      datacenterCoord: schemas_exports.property(
        "datacenter_coord",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).geo.Coord)
      ),
      datacenterDistanceFromClient: schemas_exports.property(
        "datacenter_distance_from_client",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).geo.Distance)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinLobby.ts
var JoinLobby;
var init_JoinLobby = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinLobby.ts"() {
    "use strict";
    init_core();
    JoinLobby = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      region: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinRegion),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort).optional()
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinRegion.ts
var JoinRegion;
var init_JoinRegion = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinRegion.ts"() {
    "use strict";
    init_core();
    JoinRegion = schemas_exports.object({
      regionId: schemas_exports.property(
        "region_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPort.ts
var JoinPort;
var init_JoinPort = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPort.ts"() {
    "use strict";
    init_core();
    JoinPort = schemas_exports.object({
      host: schemas_exports.string().optional(),
      hostname: schemas_exports.string(),
      port: schemas_exports.number().optional(),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPortRange).optional()
      ),
      isTls: schemas_exports.property("is_tls", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPortRange.ts
var JoinPortRange;
var init_JoinPortRange = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPortRange.ts"() {
    "use strict";
    init_core();
    JoinPortRange = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPlayer.ts
var JoinPlayer;
var init_JoinPlayer = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPlayer.ts"() {
    "use strict";
    init_core();
    JoinPlayer = schemas_exports.object({
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/index.ts
var init_types43 = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/index.ts"() {
    "use strict";
    init_LobbyInfo();
    init_GameModeInfo();
    init_RegionInfo();
    init_JoinLobby();
    init_JoinRegion();
    init_JoinPort();
    init_JoinPortRange();
    init_JoinPlayer();
  }
});

// src/serialization/resources/matchmaker/resources/common/index.ts
var common_exports22 = {};
__export(common_exports22, {
  GameModeInfo: () => GameModeInfo,
  JoinLobby: () => JoinLobby,
  JoinPlayer: () => JoinPlayer,
  JoinPort: () => JoinPort,
  JoinPortRange: () => JoinPortRange,
  JoinRegion: () => JoinRegion,
  LobbyInfo: () => LobbyInfo,
  RegionInfo: () => RegionInfo
});
var init_common10 = __esm({
  "src/serialization/resources/matchmaker/resources/common/index.ts"() {
    "use strict";
    init_types43();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/FindLobbyOutput.ts
var FindLobbyOutput;
var init_FindLobbyOutput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/FindLobbyOutput.ts"() {
    "use strict";
    init_core();
    FindLobbyOutput = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort).optional()
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/JoinLobbyOutput.ts
var JoinLobbyOutput;
var init_JoinLobbyOutput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/JoinLobbyOutput.ts"() {
    "use strict";
    init_core();
    JoinLobbyOutput = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort).optional()
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/ListLobbiesOutput.ts
var ListLobbiesOutput;
var init_ListLobbiesOutput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/ListLobbiesOutput.ts"() {
    "use strict";
    init_core();
    ListLobbiesOutput = schemas_exports.object({
      gameModes: schemas_exports.property(
        "game_modes",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.GameModeInfo)
        )
      ),
      regions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.RegionInfo)
      ),
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.LobbyInfo)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/index.ts
var init_types44 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/index.ts"() {
    "use strict";
    init_FindLobbyOutput();
    init_JoinLobbyOutput();
    init_ListLobbiesOutput();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/SetLobbyClosedInput.ts
var SetLobbyClosedInput;
var init_SetLobbyClosedInput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/SetLobbyClosedInput.ts"() {
    "use strict";
    init_core();
    SetLobbyClosedInput = schemas_exports.object({
      isClosed: schemas_exports.property("is_closed", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/FindLobbyInput.ts
var FindLobbyInput;
var init_FindLobbyInput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/FindLobbyInput.ts"() {
    "use strict";
    init_core();
    FindLobbyInput = schemas_exports.object({
      gameModes: schemas_exports.property("game_modes", schemas_exports.list(schemas_exports.string())),
      regions: schemas_exports.list(schemas_exports.string()).optional(),
      preventAutoCreateLobby: schemas_exports.property(
        "prevent_auto_create_lobby",
        schemas_exports.boolean().optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/JoinLobbyInput.ts
var JoinLobbyInput;
var init_JoinLobbyInput = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/JoinLobbyInput.ts"() {
    "use strict";
    init_core();
    JoinLobbyInput = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/index.ts
var init_requests2 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/index.ts"() {
    "use strict";
    init_SetLobbyClosedInput();
    init_FindLobbyInput();
    init_JoinLobbyInput();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/index.ts
var init_client2 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/index.ts"() {
    "use strict";
    init_requests2();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/index.ts
var lobbies_exports2 = {};
__export(lobbies_exports2, {
  FindLobbyInput: () => FindLobbyInput,
  FindLobbyOutput: () => FindLobbyOutput,
  JoinLobbyInput: () => JoinLobbyInput,
  JoinLobbyOutput: () => JoinLobbyOutput,
  ListLobbiesOutput: () => ListLobbiesOutput,
  SetLobbyClosedInput: () => SetLobbyClosedInput
});
var init_lobbies = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/index.ts"() {
    "use strict";
    init_types44();
    init_client2();
  }
});

// src/serialization/resources/matchmaker/resources/regions/types/ListRegionsOutput.ts
var ListRegionsOutput;
var init_ListRegionsOutput = __esm({
  "src/serialization/resources/matchmaker/resources/regions/types/ListRegionsOutput.ts"() {
    "use strict";
    init_core();
    ListRegionsOutput = schemas_exports.object({
      regions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.RegionInfo)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/regions/types/index.ts
var init_types45 = __esm({
  "src/serialization/resources/matchmaker/resources/regions/types/index.ts"() {
    "use strict";
    init_ListRegionsOutput();
  }
});

// src/serialization/resources/matchmaker/resources/regions/index.ts
var regions_exports2 = {};
__export(regions_exports2, {
  ListRegionsOutput: () => ListRegionsOutput
});
var init_regions = __esm({
  "src/serialization/resources/matchmaker/resources/regions/index.ts"() {
    "use strict";
    init_types45();
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/PlayerConnectedInput.ts
var PlayerConnectedInput;
var init_PlayerConnectedInput = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/PlayerConnectedInput.ts"() {
    "use strict";
    init_core();
    PlayerConnectedInput = schemas_exports.object({
      playerToken: schemas_exports.property("player_token", schemas_exports.string())
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/PlayerDisconnectedInput.ts
var PlayerDisconnectedInput;
var init_PlayerDisconnectedInput = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/PlayerDisconnectedInput.ts"() {
    "use strict";
    init_core();
    PlayerDisconnectedInput = schemas_exports.object({
      playerToken: schemas_exports.property("player_token", schemas_exports.string())
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/index.ts
var init_requests3 = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/index.ts"() {
    "use strict";
    init_PlayerConnectedInput();
    init_PlayerDisconnectedInput();
  }
});

// src/serialization/resources/matchmaker/resources/players/client/index.ts
var init_client3 = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/index.ts"() {
    "use strict";
    init_requests3();
  }
});

// src/serialization/resources/matchmaker/resources/players/index.ts
var players_exports2 = {};
__export(players_exports2, {
  PlayerConnectedInput: () => PlayerConnectedInput,
  PlayerDisconnectedInput: () => PlayerDisconnectedInput
});
var init_players = __esm({
  "src/serialization/resources/matchmaker/resources/players/index.ts"() {
    "use strict";
    init_client3();
  }
});

// src/serialization/resources/matchmaker/resources/index.ts
var init_resources15 = __esm({
  "src/serialization/resources/matchmaker/resources/index.ts"() {
    "use strict";
    init_common10();
    init_types43();
    init_lobbies();
    init_types44();
    init_regions();
    init_types45();
    init_requests2();
    init_players();
    init_requests3();
  }
});

// src/serialization/resources/matchmaker/index.ts
var matchmaker_exports7 = {};
__export(matchmaker_exports7, {
  FindLobbyInput: () => FindLobbyInput,
  FindLobbyOutput: () => FindLobbyOutput,
  GameModeInfo: () => GameModeInfo,
  JoinLobby: () => JoinLobby,
  JoinLobbyInput: () => JoinLobbyInput,
  JoinLobbyOutput: () => JoinLobbyOutput,
  JoinPlayer: () => JoinPlayer,
  JoinPort: () => JoinPort,
  JoinPortRange: () => JoinPortRange,
  JoinRegion: () => JoinRegion,
  ListLobbiesOutput: () => ListLobbiesOutput,
  ListRegionsOutput: () => ListRegionsOutput,
  LobbyInfo: () => LobbyInfo,
  PlayerConnectedInput: () => PlayerConnectedInput,
  PlayerDisconnectedInput: () => PlayerDisconnectedInput,
  RegionInfo: () => RegionInfo,
  SetLobbyClosedInput: () => SetLobbyClosedInput,
  common: () => common_exports22,
  lobbies: () => lobbies_exports2,
  players: () => players_exports2,
  regions: () => regions_exports2
});
var init_matchmaker3 = __esm({
  "src/serialization/resources/matchmaker/index.ts"() {
    "use strict";
    init_resources15();
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/FindMatchmakerLobbyForPartyInput.ts
var FindMatchmakerLobbyForPartyInput;
var init_FindMatchmakerLobbyForPartyInput = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/FindMatchmakerLobbyForPartyInput.ts"() {
    "use strict";
    init_core();
    FindMatchmakerLobbyForPartyInput = schemas_exports.object({
      gameModes: schemas_exports.property("game_modes", schemas_exports.list(schemas_exports.string())),
      regions: schemas_exports.list(schemas_exports.string()).optional(),
      preventAutoCreateLobby: schemas_exports.property(
        "prevent_auto_create_lobby",
        schemas_exports.boolean().optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/JoinMatchmakerLobbyForPartyInput.ts
var JoinMatchmakerLobbyForPartyInput;
var init_JoinMatchmakerLobbyForPartyInput = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/JoinMatchmakerLobbyForPartyInput.ts"() {
    "use strict";
    init_core();
    JoinMatchmakerLobbyForPartyInput = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/index.ts
var init_types46 = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_FindMatchmakerLobbyForPartyInput();
    init_JoinMatchmakerLobbyForPartyInput();
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/index.ts
var matchmaker_exports8 = {};
__export(matchmaker_exports8, {
  FindMatchmakerLobbyForPartyInput: () => FindMatchmakerLobbyForPartyInput,
  JoinMatchmakerLobbyForPartyInput: () => JoinMatchmakerLobbyForPartyInput
});
var init_matchmaker4 = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/index.ts"() {
    "use strict";
    init_types46();
  }
});

// src/serialization/resources/party/resources/activity/resources/index.ts
var init_resources16 = __esm({
  "src/serialization/resources/party/resources/activity/resources/index.ts"() {
    "use strict";
    init_matchmaker4();
    init_types46();
  }
});

// src/serialization/resources/party/resources/activity/index.ts
var activity_exports2 = {};
__export(activity_exports2, {
  FindMatchmakerLobbyForPartyInput: () => FindMatchmakerLobbyForPartyInput,
  JoinMatchmakerLobbyForPartyInput: () => JoinMatchmakerLobbyForPartyInput,
  matchmaker: () => matchmaker_exports8
});
var init_activity = __esm({
  "src/serialization/resources/party/resources/activity/index.ts"() {
    "use strict";
    init_resources16();
  }
});

// src/serialization/resources/party/resources/common/types/CreatePublicityConfig.ts
var CreatePublicityConfig;
var init_CreatePublicityConfig = __esm({
  "src/serialization/resources/party/resources/common/types/CreatePublicityConfig.ts"() {
    "use strict";
    init_core();
    CreatePublicityConfig = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional(),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/CreateInviteConfig.ts
var CreateInviteConfig;
var init_CreateInviteConfig = __esm({
  "src/serialization/resources/party/resources/common/types/CreateInviteConfig.ts"() {
    "use strict";
    init_core();
    CreateInviteConfig = schemas_exports.object({
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/CreatedInvite.ts
var CreatedInvite;
var init_CreatedInvite = __esm({
  "src/serialization/resources/party/resources/common/types/CreatedInvite.ts"() {
    "use strict";
    init_core();
    CreatedInvite = schemas_exports.object({
      alias: schemas_exports.string().optional(),
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/JoinInvite.ts
var JoinInvite;
var init_JoinInvite = __esm({
  "src/serialization/resources/party/resources/common/types/JoinInvite.ts"() {
    "use strict";
    init_core();
    JoinInvite = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string().optional()),
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt).optional(),
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/Summary.ts
var Summary4;
var init_Summary4 = __esm({
  "src/serialization/resources/party/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary4 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property(
        "create_ts",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Timestamp)
      ),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Publicity),
      partySize: schemas_exports.property("party_size", schemas_exports.number()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberSummary)
      ),
      threadId: schemas_exports.property("thread_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Handle.ts
var Handle4;
var init_Handle4 = __esm({
  "src/serialization/resources/party/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle4 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks)
    });
  }
});

// src/serialization/resources/party/resources/common/types/Activity.ts
var Activity;
var init_Activity = __esm({
  "src/serialization/resources/party/resources/common/types/Activity.ts"() {
    "use strict";
    init_core();
    Activity = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      matchmakerFindingLobby: schemas_exports.property(
        "matchmaker_finding_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ActivityMatchmakerFindingLobby).optional()
      ),
      matchmakerLobby: schemas_exports.property(
        "matchmaker_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ActivityMatchmakerLobby).optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/ActivityMatchmakerFindingLobby.ts
var ActivityMatchmakerFindingLobby;
var init_ActivityMatchmakerFindingLobby = __esm({
  "src/serialization/resources/party/resources/common/types/ActivityMatchmakerFindingLobby.ts"() {
    "use strict";
    init_core();
    ActivityMatchmakerFindingLobby = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle)
    });
  }
});

// src/serialization/resources/party/resources/common/types/ActivityMatchmakerLobby.ts
var ActivityMatchmakerLobby;
var init_ActivityMatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/ActivityMatchmakerLobby.ts"() {
    "use strict";
    init_core();
    ActivityMatchmakerLobby = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MatchmakerLobby),
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle)
    });
  }
});

// src/serialization/resources/party/resources/common/types/ExternalLinks.ts
var ExternalLinks3;
var init_ExternalLinks3 = __esm({
  "src/serialization/resources/party/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks3 = schemas_exports.object({
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/MatchmakerLobby.ts
var MatchmakerLobby;
var init_MatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/MatchmakerLobby.ts"() {
    "use strict";
    init_core();
    MatchmakerLobby = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Publicity.ts
var Publicity3;
var init_Publicity2 = __esm({
  "src/serialization/resources/party/resources/common/types/Publicity.ts"() {
    "use strict";
    init_core();
    Publicity3 = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel)
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel)
    });
  }
});

// src/serialization/resources/party/resources/common/types/PublicityLevel.ts
var PublicityLevel2;
var init_PublicityLevel = __esm({
  "src/serialization/resources/party/resources/common/types/PublicityLevel.ts"() {
    "use strict";
    init_core();
    PublicityLevel2 = schemas_exports.enum_(["none", "view", "join"]);
  }
});

// src/serialization/resources/party/resources/common/types/MemberSummary.ts
var MemberSummary;
var init_MemberSummary = __esm({
  "src/serialization/resources/party/resources/common/types/MemberSummary.ts"() {
    "use strict";
    init_core();
    MemberSummary = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      isLeader: schemas_exports.property("is_leader", schemas_exports.boolean()),
      joinTs: schemas_exports.property("join_ts", schemas_exports.date()),
      state: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberState)
    });
  }
});

// src/serialization/resources/party/resources/common/types/MemberState.ts
var MemberState;
var init_MemberState = __esm({
  "src/serialization/resources/party/resources/common/types/MemberState.ts"() {
    "use strict";
    init_core();
    MemberState = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      matchmakerPending: schemas_exports.property(
        "matchmaker_pending",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
      ),
      matchmakerFindingLobby: schemas_exports.property(
        "matchmaker_finding_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
      ),
      matchmakerLobby: schemas_exports.property(
        "matchmaker_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberStateMatchmakerLobby).optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/MemberStateMatchmakerLobby.ts
var MemberStateMatchmakerLobby;
var init_MemberStateMatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/MemberStateMatchmakerLobby.ts"() {
    "use strict";
    init_core();
    MemberStateMatchmakerLobby = schemas_exports.object({
      playerId: schemas_exports.property("player_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Profile.ts
var Profile3;
var init_Profile3 = __esm({
  "src/serialization/resources/party/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile3 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Publicity),
      partySize: schemas_exports.property("party_size", schemas_exports.number().optional()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberSummary)
      ),
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      invites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Invite)
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/Invite.ts
var Invite;
var init_Invite = __esm({
  "src/serialization/resources/party/resources/common/types/Invite.ts"() {
    "use strict";
    init_core();
    Invite = schemas_exports.object({
      inviteId: schemas_exports.property("invite_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      token: schemas_exports.string(),
      alias: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.InviteAlias).optional(),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.InviteExternalLinks)
    });
  }
});

// src/serialization/resources/party/resources/common/types/InviteAlias.ts
var InviteAlias;
var init_InviteAlias = __esm({
  "src/serialization/resources/party/resources/common/types/InviteAlias.ts"() {
    "use strict";
    init_core();
    InviteAlias = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      alias: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/InviteExternalLinks.ts
var InviteExternalLinks;
var init_InviteExternalLinks = __esm({
  "src/serialization/resources/party/resources/common/types/InviteExternalLinks.ts"() {
    "use strict";
    init_core();
    InviteExternalLinks = schemas_exports.object({
      invite: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/index.ts
var init_types47 = __esm({
  "src/serialization/resources/party/resources/common/types/index.ts"() {
    "use strict";
    init_CreatePublicityConfig();
    init_CreateInviteConfig();
    init_CreatedInvite();
    init_JoinInvite();
    init_Summary4();
    init_Handle4();
    init_Activity();
    init_ActivityMatchmakerFindingLobby();
    init_ActivityMatchmakerLobby();
    init_ExternalLinks3();
    init_MatchmakerLobby();
    init_Publicity2();
    init_PublicityLevel();
    init_MemberSummary();
    init_MemberState();
    init_MemberStateMatchmakerLobby();
    init_Profile3();
    init_Invite();
    init_InviteAlias();
    init_InviteExternalLinks();
  }
});

// src/serialization/resources/party/resources/common/index.ts
var common_exports23 = {};
__export(common_exports23, {
  Activity: () => Activity,
  ActivityMatchmakerFindingLobby: () => ActivityMatchmakerFindingLobby,
  ActivityMatchmakerLobby: () => ActivityMatchmakerLobby,
  CreateInviteConfig: () => CreateInviteConfig,
  CreatePublicityConfig: () => CreatePublicityConfig,
  CreatedInvite: () => CreatedInvite,
  ExternalLinks: () => ExternalLinks3,
  Handle: () => Handle4,
  Invite: () => Invite,
  InviteAlias: () => InviteAlias,
  InviteExternalLinks: () => InviteExternalLinks,
  JoinInvite: () => JoinInvite,
  MatchmakerLobby: () => MatchmakerLobby,
  MemberState: () => MemberState,
  MemberStateMatchmakerLobby: () => MemberStateMatchmakerLobby,
  MemberSummary: () => MemberSummary,
  Profile: () => Profile3,
  Publicity: () => Publicity3,
  PublicityLevel: () => PublicityLevel2,
  Summary: () => Summary4
});
var init_common11 = __esm({
  "src/serialization/resources/party/resources/common/index.ts"() {
    "use strict";
    init_types47();
  }
});

// src/serialization/resources/party/resources/parties/types/GetInviteOutput.ts
var GetInviteOutput2;
var init_GetInviteOutput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetInviteOutput.ts"() {
    "use strict";
    init_core();
    GetInviteOutput2 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateInput.ts
var CreateInput2;
var init_CreateInput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateInput.ts"() {
    "use strict";
    init_core();
    CreateInput2 = schemas_exports.object({
      partySize: schemas_exports.property("party_size", schemas_exports.number().optional()),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatePublicityConfig).optional(),
      invites: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreateInviteConfig)).optional(),
      matchmakerCurrentPlayerToken: schemas_exports.property(
        "matchmaker_current_player_token",
        schemas_exports.string().optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateOutput.ts
var CreateOutput2;
var init_CreateOutput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateOutput.ts"() {
    "use strict";
    init_core();
    CreateOutput2 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      invites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatedInvite)
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/JoinInput.ts
var JoinInput;
var init_JoinInput = __esm({
  "src/serialization/resources/party/resources/parties/types/JoinInput.ts"() {
    "use strict";
    init_core();
    JoinInput = schemas_exports.object({
      invite: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.JoinInvite),
      matchmakerAutoJoinLobby: schemas_exports.property(
        "matchmaker_auto_join_lobby",
        schemas_exports.boolean().optional()
      ),
      matchmakerCurrentPlayerToken: schemas_exports.property(
        "matchmaker_current_player_token",
        schemas_exports.string().optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/JoinOutput.ts
var JoinOutput;
var init_JoinOutput = __esm({
  "src/serialization/resources/party/resources/parties/types/JoinOutput.ts"() {
    "use strict";
    init_core();
    JoinOutput = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateInviteInput.ts
var CreateInviteInput2;
var init_CreateInviteInput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateInviteInput.ts"() {
    "use strict";
    init_core();
    CreateInviteInput2 = schemas_exports.object({
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateInviteOutput.ts
var CreateInviteOutput2;
var init_CreateInviteOutput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateInviteOutput.ts"() {
    "use strict";
    init_core();
    CreateInviteOutput2 = schemas_exports.object({
      invite: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatedInvite)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSelfProfileOutput.ts
var GetSelfProfileOutput;
var init_GetSelfProfileOutput = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSelfProfileOutput.ts"() {
    "use strict";
    init_core();
    GetSelfProfileOutput = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Profile).optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/SetPublicityInput.ts
var SetPublicityInput;
var init_SetPublicityInput = __esm({
  "src/serialization/resources/party/resources/parties/types/SetPublicityInput.ts"() {
    "use strict";
    init_core();
    SetPublicityInput = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional(),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSelfSummaryOutput.ts
var GetSelfSummaryOutput;
var init_GetSelfSummaryOutput = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSelfSummaryOutput.ts"() {
    "use strict";
    init_core();
    GetSelfSummaryOutput = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary).optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetProfileOutput.ts
var GetProfileOutput3;
var init_GetProfileOutput3 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetProfileOutput.ts"() {
    "use strict";
    init_core();
    GetProfileOutput3 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSummaryOutput.ts
var GetSummaryOutput2;
var init_GetSummaryOutput2 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSummaryOutput.ts"() {
    "use strict";
    init_core();
    GetSummaryOutput2 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/index.ts
var init_types48 = __esm({
  "src/serialization/resources/party/resources/parties/types/index.ts"() {
    "use strict";
    init_GetInviteOutput2();
    init_CreateInput2();
    init_CreateOutput2();
    init_JoinInput();
    init_JoinOutput();
    init_CreateInviteInput2();
    init_CreateInviteOutput2();
    init_GetSelfProfileOutput();
    init_SetPublicityInput();
    init_GetSelfSummaryOutput();
    init_GetProfileOutput3();
    init_GetSummaryOutput2();
  }
});

// src/serialization/resources/party/resources/parties/index.ts
var parties_exports2 = {};
__export(parties_exports2, {
  CreateInput: () => CreateInput2,
  CreateInviteInput: () => CreateInviteInput2,
  CreateInviteOutput: () => CreateInviteOutput2,
  CreateOutput: () => CreateOutput2,
  GetInviteOutput: () => GetInviteOutput2,
  GetProfileOutput: () => GetProfileOutput3,
  GetSelfProfileOutput: () => GetSelfProfileOutput,
  GetSelfSummaryOutput: () => GetSelfSummaryOutput,
  GetSummaryOutput: () => GetSummaryOutput2,
  JoinInput: () => JoinInput,
  JoinOutput: () => JoinOutput,
  SetPublicityInput: () => SetPublicityInput
});
var init_parties = __esm({
  "src/serialization/resources/party/resources/parties/index.ts"() {
    "use strict";
    init_types48();
  }
});

// src/serialization/resources/party/resources/index.ts
var init_resources17 = __esm({
  "src/serialization/resources/party/resources/index.ts"() {
    "use strict";
    init_activity();
    init_common11();
    init_types47();
    init_parties();
    init_types48();
  }
});

// src/serialization/resources/party/index.ts
var party_exports2 = {};
__export(party_exports2, {
  Activity: () => Activity,
  ActivityMatchmakerFindingLobby: () => ActivityMatchmakerFindingLobby,
  ActivityMatchmakerLobby: () => ActivityMatchmakerLobby,
  CreateInput: () => CreateInput2,
  CreateInviteConfig: () => CreateInviteConfig,
  CreateInviteInput: () => CreateInviteInput2,
  CreateInviteOutput: () => CreateInviteOutput2,
  CreateOutput: () => CreateOutput2,
  CreatePublicityConfig: () => CreatePublicityConfig,
  CreatedInvite: () => CreatedInvite,
  ExternalLinks: () => ExternalLinks3,
  GetInviteOutput: () => GetInviteOutput2,
  GetProfileOutput: () => GetProfileOutput3,
  GetSelfProfileOutput: () => GetSelfProfileOutput,
  GetSelfSummaryOutput: () => GetSelfSummaryOutput,
  GetSummaryOutput: () => GetSummaryOutput2,
  Handle: () => Handle4,
  Invite: () => Invite,
  InviteAlias: () => InviteAlias,
  InviteExternalLinks: () => InviteExternalLinks,
  JoinInput: () => JoinInput,
  JoinInvite: () => JoinInvite,
  JoinOutput: () => JoinOutput,
  MatchmakerLobby: () => MatchmakerLobby,
  MemberState: () => MemberState,
  MemberStateMatchmakerLobby: () => MemberStateMatchmakerLobby,
  MemberSummary: () => MemberSummary,
  Profile: () => Profile3,
  Publicity: () => Publicity3,
  PublicityLevel: () => PublicityLevel2,
  SetPublicityInput: () => SetPublicityInput,
  Summary: () => Summary4,
  activity: () => activity_exports2,
  common: () => common_exports23,
  parties: () => parties_exports2
});
var init_party = __esm({
  "src/serialization/resources/party/index.ts"() {
    "use strict";
    init_resources17();
  }
});

// src/serialization/resources/upload/resources/common/types/PresignedRequest.ts
var PresignedRequest;
var init_PresignedRequest = __esm({
  "src/serialization/resources/upload/resources/common/types/PresignedRequest.ts"() {
    "use strict";
    init_core();
    PresignedRequest = schemas_exports.object({
      path: schemas_exports.string(),
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/upload/resources/common/types/PrepareFile.ts
var PrepareFile;
var init_PrepareFile = __esm({
  "src/serialization/resources/upload/resources/common/types/PrepareFile.ts"() {
    "use strict";
    init_core();
    PrepareFile = schemas_exports.object({
      path: schemas_exports.string(),
      contentType: schemas_exports.property("content_type", schemas_exports.string().optional()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/upload/resources/common/types/index.ts
var init_types49 = __esm({
  "src/serialization/resources/upload/resources/common/types/index.ts"() {
    "use strict";
    init_PresignedRequest();
    init_PrepareFile();
  }
});

// src/serialization/resources/upload/resources/common/index.ts
var common_exports24 = {};
__export(common_exports24, {
  PrepareFile: () => PrepareFile,
  PresignedRequest: () => PresignedRequest
});
var init_common12 = __esm({
  "src/serialization/resources/upload/resources/common/index.ts"() {
    "use strict";
    init_types49();
  }
});

// src/serialization/resources/upload/resources/index.ts
var init_resources18 = __esm({
  "src/serialization/resources/upload/resources/index.ts"() {
    "use strict";
    init_common12();
    init_types49();
  }
});

// src/serialization/resources/upload/index.ts
var upload_exports2 = {};
__export(upload_exports2, {
  PrepareFile: () => PrepareFile,
  PresignedRequest: () => PresignedRequest,
  common: () => common_exports24
});
var init_upload = __esm({
  "src/serialization/resources/upload/index.ts"() {
    "use strict";
    init_resources18();
  }
});

// src/serialization/resources/index.ts
var init_resources19 = __esm({
  "src/serialization/resources/index.ts"() {
    "use strict";
    init_captcha();
    init_chat();
    init_cloud();
    init_common4();
    init_types29();
    init_game();
    init_geo();
    init_group();
    init_identity3();
    init_kv2();
    init_matchmaker3();
    init_party();
    init_upload();
  }
});

// src/serialization/index.ts
var serialization_exports = {};
__export(serialization_exports, {
  AccountNumber: () => AccountNumber,
  Bio: () => Bio,
  DisplayName: () => DisplayName,
  Email: () => Email,
  EmptyObject: () => EmptyObject,
  Identifier: () => Identifier,
  Jwt: () => Jwt,
  Timestamp: () => Timestamp,
  ValidationError: () => ValidationError4,
  WatchQuery: () => WatchQuery,
  WatchResponse: () => WatchResponse,
  captcha: () => captcha_exports2,
  chat: () => chat_exports2,
  cloud: () => cloud_exports2,
  common: () => common_exports16,
  game: () => game_exports2,
  geo: () => geo_exports2,
  group: () => group_exports2,
  identity: () => identity_exports6,
  kv: () => kv_exports4,
  matchmaker: () => matchmaker_exports7,
  party: () => party_exports2,
  upload: () => upload_exports2
});
var init_serialization = __esm({
  "src/serialization/index.ts"() {
    "use strict";
    init_resources19();
  }
});

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  captcha: () => captcha_exports,
  chat: () => chat_exports,
  cloud: () => cloud_exports,
  common: () => common_exports4,
  game: () => game_exports,
  geo: () => geo_exports,
  group: () => group_exports,
  identity: () => identity_exports3,
  kv: () => kv_exports2,
  matchmaker: () => matchmaker_exports3,
  party: () => party_exports,
  upload: () => upload_exports
});

// src/api/resources/captcha/index.ts
var captcha_exports = {};
__export(captcha_exports, {
  config: () => config_exports
});

// src/api/resources/captcha/resources/config/index.ts
var config_exports = {};

// src/api/resources/chat/index.ts
var chat_exports = {};
__export(chat_exports, {
  QueryDirection: () => QueryDirection,
  common: () => common_exports,
  identity: () => identity_exports
});

// src/api/resources/chat/resources/common/index.ts
var common_exports = {};
__export(common_exports, {
  QueryDirection: () => QueryDirection
});

// src/api/resources/chat/resources/common/types/QueryDirection.ts
var QueryDirection = {
  Before: "before",
  After: "after",
  BeforeAndAfter: "before_and_after"
};

// src/api/resources/chat/resources/identity/index.ts
var identity_exports = {};

// src/api/resources/cloud/index.ts
var cloud_exports = {};
__export(cloud_exports, {
  CdnAuthType: () => CdnAuthType,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus,
  GroupBillingStatus: () => GroupBillingStatus,
  auth: () => auth_exports,
  common: () => common_exports2,
  devices: () => devices_exports,
  games: () => games_exports2,
  groups: () => groups_exports,
  logs: () => logs_exports2,
  tiers: () => tiers_exports,
  uploads: () => uploads_exports,
  version: () => version_exports
});

// src/api/resources/cloud/resources/auth/index.ts
var auth_exports = {};

// src/api/resources/cloud/resources/common/index.ts
var common_exports2 = {};
__export(common_exports2, {
  CdnAuthType: () => CdnAuthType,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus,
  GroupBillingStatus: () => GroupBillingStatus
});

// src/api/resources/cloud/resources/common/types/GroupBillingStatus.ts
var GroupBillingStatus = {
  Succeeded: "succeeded",
  Processing: "processing",
  Refunded: "refunded"
};

// src/api/resources/cloud/resources/common/types/CdnAuthType.ts
var CdnAuthType = {
  None: "none",
  Basic: "basic"
};

// src/api/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts
var CdnNamespaceDomainVerificationStatus = {
  Active: "active",
  Pending: "pending",
  Failed: "failed"
};

// src/api/resources/cloud/resources/devices/index.ts
var devices_exports = {};
__export(devices_exports, {
  links: () => links_exports
});

// src/api/resources/cloud/resources/devices/resources/links/index.ts
var links_exports = {};

// src/api/resources/cloud/resources/games/index.ts
var games_exports2 = {};
__export(games_exports2, {
  LogStream: () => LogStream,
  avatars: () => avatars_exports,
  builds: () => builds_exports,
  cdn: () => cdn_exports,
  games: () => games_exports,
  matchmaker: () => matchmaker_exports,
  namespaces: () => namespaces_exports,
  tokens: () => tokens_exports,
  versions: () => versions_exports
});

// src/api/resources/cloud/resources/games/resources/avatars/index.ts
var avatars_exports = {};

// src/api/resources/cloud/resources/games/resources/builds/index.ts
var builds_exports = {};

// src/api/resources/cloud/resources/games/resources/cdn/index.ts
var cdn_exports = {};

// src/api/resources/cloud/resources/games/resources/games/index.ts
var games_exports = {};

// src/api/resources/cloud/resources/games/resources/matchmaker/index.ts
var matchmaker_exports = {};
__export(matchmaker_exports, {
  LogStream: () => LogStream
});

// src/api/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts
var LogStream = {
  StdOut: "std_out",
  StdErr: "std_err"
};

// src/api/resources/cloud/resources/games/resources/namespaces/index.ts
var namespaces_exports = {};
__export(namespaces_exports, {
  analytics: () => analytics_exports,
  logs: () => logs_exports
});

// src/api/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts
var analytics_exports = {};

// src/api/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts
var logs_exports = {};

// src/api/resources/cloud/resources/games/resources/tokens/index.ts
var tokens_exports = {};

// src/api/resources/cloud/resources/games/resources/versions/index.ts
var versions_exports = {};

// src/api/resources/cloud/resources/groups/index.ts
var groups_exports = {};

// src/api/resources/cloud/resources/logs/index.ts
var logs_exports2 = {};

// src/api/resources/cloud/resources/tiers/index.ts
var tiers_exports = {};

// src/api/resources/cloud/resources/version/index.ts
var version_exports = {};
__export(version_exports, {
  cdn: () => cdn_exports2,
  identity: () => identity_exports2,
  kv: () => kv_exports,
  matchmaker: () => matchmaker_exports2
});

// src/api/resources/cloud/resources/version/resources/identity/index.ts
var identity_exports2 = {};
__export(identity_exports2, {
  pacakge: () => pacakge_exports
});

// src/api/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts
var pacakge_exports = {};

// src/api/resources/cloud/resources/version/resources/matchmaker/index.ts
var matchmaker_exports2 = {};
__export(matchmaker_exports2, {
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel,
  NetworkMode: () => NetworkMode,
  ProxyProtocol: () => ProxyProtocol,
  common: () => common_exports3,
  gameMode: () => gameMode_exports,
  lobbyGroup: () => lobbyGroup_exports
});

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts
var common_exports3 = {};
__export(common_exports3, {
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel,
  NetworkMode: () => NetworkMode,
  ProxyProtocol: () => ProxyProtocol
});

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyProtocol.ts
var ProxyProtocol = {
  Http: "http",
  Https: "https",
  Udp: "udp"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts
var CaptchaHcaptchaLevel = {
  Easy: "easy",
  Moderate: "moderate",
  Difficult: "difficult",
  AlwaysOn: "always_on"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts
var NetworkMode = {
  Bridge: "bridge",
  Host: "host"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts
var gameMode_exports = {};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts
var lobbyGroup_exports = {};

// src/api/resources/cloud/resources/version/resources/cdn/index.ts
var cdn_exports2 = {};

// src/api/resources/cloud/resources/version/resources/kv/index.ts
var kv_exports = {};

// src/api/resources/cloud/resources/uploads/index.ts
var uploads_exports = {};

// src/api/resources/common/index.ts
var common_exports4 = {};

// src/api/resources/game/index.ts
var game_exports = {};
__export(game_exports, {
  StatAggregationMethod: () => StatAggregationMethod,
  StatFormatMethod: () => StatFormatMethod,
  StatSortingMethod: () => StatSortingMethod,
  common: () => common_exports5
});

// src/api/resources/game/resources/common/index.ts
var common_exports5 = {};
__export(common_exports5, {
  StatAggregationMethod: () => StatAggregationMethod,
  StatFormatMethod: () => StatFormatMethod,
  StatSortingMethod: () => StatSortingMethod
});

// src/api/resources/game/resources/common/types/StatFormatMethod.ts
var StatFormatMethod = {
  Integer: "integer",
  Float1: "float_1",
  Float2: "float_2",
  Float3: "float_3",
  DurationMinute: "duration_minute",
  DuractionSecond: "duration_second",
  DurationHundredthSecond: "duration_hundredth_second"
};

// src/api/resources/game/resources/common/types/StatAggregationMethod.ts
var StatAggregationMethod = {
  Sum: "sum",
  Average: "average",
  Min: "min",
  Max: "max"
};

// src/api/resources/game/resources/common/types/StatSortingMethod.ts
var StatSortingMethod = {
  Desc: "desc",
  Asc: "asc"
};

// src/api/resources/geo/index.ts
var geo_exports = {};
__export(geo_exports, {
  common: () => common_exports6
});

// src/api/resources/geo/resources/common/index.ts
var common_exports6 = {};

// src/api/resources/group/index.ts
var group_exports = {};
__export(group_exports, {
  Publicity: () => Publicity,
  common: () => common_exports7,
  invites: () => invites_exports,
  joinRequests: () => joinRequests_exports
});

// src/api/resources/group/resources/common/index.ts
var common_exports7 = {};
__export(common_exports7, {
  Publicity: () => Publicity
});

// src/api/resources/group/resources/common/types/Publicity.ts
var Publicity = {
  Open: "open",
  Closed: "closed"
};

// src/api/resources/group/resources/invites/index.ts
var invites_exports = {};

// src/api/resources/group/resources/joinRequests/index.ts
var joinRequests_exports = {};

// src/api/resources/identity/index.ts
var identity_exports3 = {};
__export(identity_exports3, {
  DevState: () => DevState,
  GameLinkStatus: () => GameLinkStatus,
  Status: () => Status,
  common: () => common_exports8,
  events: () => events_exports,
  links: () => links_exports2
});

// src/api/resources/identity/resources/common/index.ts
var common_exports8 = {};
__export(common_exports8, {
  DevState: () => DevState,
  GameLinkStatus: () => GameLinkStatus,
  Status: () => Status
});

// src/api/resources/identity/resources/common/types/Status.ts
var Status = {
  Online: "online",
  Away: "away",
  Offline: "offline"
};

// src/api/resources/identity/resources/common/types/DevState.ts
var DevState = {
  Inactive: "inactive",
  Pending: "pending",
  Accepted: "accepted"
};

// src/api/resources/identity/resources/common/types/GameLinkStatus.ts
var GameLinkStatus = {
  Incomplete: "incomplete",
  Complete: "complete",
  Cancelled: "cancelled"
};

// src/api/resources/identity/resources/events/index.ts
var events_exports = {};

// src/api/resources/identity/resources/links/index.ts
var links_exports2 = {};

// src/api/resources/kv/index.ts
var kv_exports2 = {};
__export(kv_exports2, {
  batch: () => batch_exports,
  common: () => common_exports9
});

// src/api/resources/kv/resources/batch/index.ts
var batch_exports = {};

// src/api/resources/kv/resources/common/index.ts
var common_exports9 = {};

// src/api/resources/matchmaker/index.ts
var matchmaker_exports3 = {};
__export(matchmaker_exports3, {
  common: () => common_exports10,
  lobbies: () => lobbies_exports,
  players: () => players_exports,
  regions: () => regions_exports
});

// src/api/resources/matchmaker/resources/common/index.ts
var common_exports10 = {};

// src/api/resources/matchmaker/resources/lobbies/index.ts
var lobbies_exports = {};

// src/api/resources/matchmaker/resources/regions/index.ts
var regions_exports = {};

// src/api/resources/matchmaker/resources/players/index.ts
var players_exports = {};

// src/api/resources/party/index.ts
var party_exports = {};
__export(party_exports, {
  PublicityLevel: () => PublicityLevel,
  activity: () => activity_exports,
  common: () => common_exports11,
  parties: () => parties_exports
});

// src/api/resources/party/resources/activity/index.ts
var activity_exports = {};
__export(activity_exports, {
  matchmaker: () => matchmaker_exports4
});

// src/api/resources/party/resources/activity/resources/matchmaker/index.ts
var matchmaker_exports4 = {};

// src/api/resources/party/resources/common/index.ts
var common_exports11 = {};
__export(common_exports11, {
  PublicityLevel: () => PublicityLevel
});

// src/api/resources/party/resources/common/types/PublicityLevel.ts
var PublicityLevel = {
  None: "none",
  View: "view",
  Join: "join"
};

// src/api/resources/party/resources/parties/index.ts
var parties_exports = {};

// src/api/resources/upload/index.ts
var upload_exports = {};
__export(upload_exports, {
  common: () => common_exports12
});

// src/api/resources/upload/resources/common/index.ts
var common_exports12 = {};

// src/environments.ts
var RivetEnvironment = {
  Production: {
    auth: "https://auth.api.rivet.gg/v1",
    chat: "https://chat.api.rivet.gg/v1",
    cloud: "https://cloud.api.rivet.gg/v1",
    group: "https://group.api.rivet.gg/v1",
    identity: "https://identity.api.rivet.gg/v1",
    job: "https://job.api.rivet.gg/v1",
    kv: "https://kv.api.rivet.gg/v1",
    matchmaker: "https://matchmaker.api.rivet.gg/v1",
    party: "https://party.api.rivet.gg/v1",
    portal: "https://portal.api.rivet.gg/v1"
  }
};

// src/api/resources/chat/client/Client.ts
init_core();
var import_url_join2 = __toESM(require_url_join());
init_serialization();

// src/errors/RivetError.ts
var RivetError = class extends Error {
  statusCode;
  body;
  constructor({ message, statusCode, body }) {
    super(message);
    Object.setPrototypeOf(this, RivetError.prototype);
    if (statusCode != null) {
      this.statusCode = statusCode;
    }
    if (body !== void 0) {
      this.body = body;
    }
  }
};

// src/errors/RivetTimeoutError.ts
var RivetTimeoutError = class extends Error {
  constructor() {
    super("Timeout");
    Object.setPrototypeOf(this, RivetTimeoutError.prototype);
  }
};

// src/api/resources/chat/resources/identity/client/Client.ts
init_core();
var import_url_join = __toESM(require_url_join());
init_serialization();
var Client = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a thread ID with a given identity.
   */
  async getDirectThread(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `/identities/${identityId}/thread`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await chat_exports2.GetDirectThreadOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/chat/client/Client.ts
var Client2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Sends a chat message to a given topic.
   */
  async sendMessage(request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)((this.options.environment ?? RivetEnvironment.Production).chat, "messages"),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await chat_exports2.SendMessageInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await chat_exports2.SendMessageOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns message history for a given thread in a certain direction.
   * Defaults to querying messages before ts.
   */
  async getThreadHistory(threadId, request) {
    const { ts, count, queryDirection } = request;
    const _queryParams = new URLSearchParams();
    if (ts != null) {
      _queryParams.append("ts", ts.toISOString());
    }
    _queryParams.append("count", count.toString());
    if (queryDirection != null) {
      _queryParams.append("query_direction", queryDirection);
    }
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/history`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await chat_exports2.GetThreadHistoryOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches all relevant changes from a thread that have happened since the
   * given watch index.
   */
  async watchThread(threadId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/live`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await chat_exports2.WatchThreadOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's last read timestamp in the given thread.
   */
  async setThreadRead(threadId, request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/read`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await chat_exports2.SetThreadReadInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches the topic of a thread.
   */
  async getThreadTopic(threadId) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/topic`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await chat_exports2.GetThreadTopicOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's typing status in the given thread.
   */
  async setTypingStatus(threadId, request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/typing-status`
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await chat_exports2.SetTypingStatusInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _identity;
  get identity() {
    return this._identity ??= new Client(this.options);
  }
};

// src/api/resources/cloud/resources/auth/client/Client.ts
init_core();
var import_url_join3 = __toESM(require_url_join());
init_serialization();
var Client3 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns information about the current authenticated agent.
   */
  async inspect() {
    const _response = await fetcher({
      url: (0, import_url_join3.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/auth/inspect"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.InspectOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/devices/resources/links/client/Client.ts
init_core();
var import_url_join4 = __toESM(require_url_join());
init_serialization();
var Client4 = class {
  constructor(options) {
    this.options = options;
  }
  async prepare() {
    const _response = await fetcher({
      url: (0, import_url_join4.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/devices/links"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.devices.PrepareDeviceLinkOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async get(request) {
    const { deviceLinkToken, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("device_link_token", deviceLinkToken);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join4.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/devices/links"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.devices.GetDeviceLinkOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/devices/client/Client.ts
var Client5 = class {
  constructor(options) {
    this.options = options;
  }
  _links;
  get links() {
    return this._links ??= new Client4(this.options);
  }
};

// src/api/resources/cloud/resources/games/resources/avatars/client/Client.ts
init_core();
var import_url_join5 = __toESM(require_url_join());
init_serialization();
var Client6 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists custom avatars for the given game.
   */
  async listGameCustomAvatars(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/avatars`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameCustomAvatarsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a custom avatar image upload.
   * Complete upload with `rivet.api.cloud#CompleteCustomAvatarUpload`.
   */
  async prepareCustomAvatarUpload(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.PrepareCustomAvatarUploadInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.PrepareCustomAvatarUploadOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes a custom avatar image upload. Must be called after the file upload process completes.
   */
  async completeCustomAvatarUpload(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/builds/client/Client.ts
init_core();
var import_url_join6 = __toESM(require_url_join());
init_serialization();
var Client7 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists game builds for the given game.
   */
  async listGameBuilds(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join6.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/builds`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameBuildsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new game build for the given game.
   */
  async createGameBuild(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join6.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/builds`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.CreateGameBuildInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameBuildOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/cdn/client/Client.ts
init_core();
var import_url_join7 = __toESM(require_url_join());
init_serialization();
var Client8 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists CDN sites for a game.
   */
  async listGameCdnSites(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join7.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/cdn/sites/`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameCdnSitesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new CDN site for the given game.
   */
  async createGameCdnSite(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join7.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/cdn/sites/`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.CreateGameCdnSiteInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameCdnSiteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/games/client/Client.ts
init_core();
var import_url_join8 = __toESM(require_url_join());
init_serialization();
var Client9 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of games in which the current identity is a group member of its development team.
   */
  async getGames(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join8.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/games"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGamesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new game.
   */
  async createGame(request) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/games"),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.CreateGameInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game.
   */
  async validateGame(request) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/games/validate"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.ValidateGameInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.ValidateGameOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a game by its game id.
   */
  async getGameById(gameId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGameByIdOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a game banner image upload.
   */
  async gameBannerUploadPrepare(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/banner-upload/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.GameBannerUploadPrepareInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.GameBannerUploadPrepareOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an game banner image upload. Must be called after the file upload process completes.
   */
  async gameBannerUploadComplete(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/banner-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a game logo image upload.
   */
  async gameLogoUploadPrepare(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/logo-upload/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.GameLogoUploadPrepareInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.GameLogoUploadPrepareOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes a game logo image upload. Must be called after the file upload process completes.
   */
  async gameLogoUploadComplete(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/logo-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/matchmaker/client/Client.ts
init_core();
var import_url_join9 = __toESM(require_url_join());
init_serialization();
var Client10 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Exports lobby history over a given query time span.
   */
  async exportMatchmakerLobbyHistory(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies//export-history`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.ExportMatchmakerLobbyHistoryInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.ExportMatchmakerLobbyHistoryOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes a matchmaker lobby, stopping it immediately.
   */
  async deleteMatchmakerLobby(gameId, lobbyId) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies//${lobbyId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.DeleteMatchmakerLobbyOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns the logs for a given lobby.
   */
  async getLobbyLogs(gameId, lobbyId, request) {
    const { stream, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("stream", stream);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies//${lobbyId}/logs`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetLobbyLogsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Generates a download URL for logs.
   */
  async exportLobbyLogs(gameId, lobbyId, request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies//${lobbyId}/logs/export`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.ExportLobbyLogsInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.ExportLobbyLogsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/client/Client.ts
init_core();
var import_url_join12 = __toESM(require_url_join());
init_serialization();

// src/api/resources/cloud/resources/games/resources/namespaces/resources/analytics/client/Client.ts
init_core();
var import_url_join10 = __toESM(require_url_join());
init_serialization();
var Client11 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns live information about all active lobies for a given namespace.
   */
  async getNamespaceAnalyticsMatchmakerLive(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join10.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/analytics//matchmaker/live`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetNamespaceAnalyticsMatchmakerLiveOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/resources/logs/client/Client.ts
init_core();
var import_url_join11 = __toESM(require_url_join());
init_serialization();
var Client12 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of lobbies for the given game namespace.
   */
  async listNamespaceLobbies(gameId, namespaceId, request = {}) {
    const { beforeCreateTs } = request;
    const _queryParams = new URLSearchParams();
    if (beforeCreateTs != null) {
      _queryParams.append("before_create_ts", beforeCreateTs);
    }
    const _response = await fetcher({
      url: (0, import_url_join11.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/logs/lobbies`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ListNamespaceLobbiesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a lobby from the given game namespace.
   */
  async getNamespaceLobby(gameId, namespaceId, lobbyId) {
    const _response = await fetcher({
      url: (0, import_url_join11.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/logs/lobbies/${lobbyId}`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetNamespaceLobbyOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/client/Client.ts
var Client13 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new namespace for the given game.
   */
  async createGameNamespace(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.CreateGameNamespaceInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game namespace.
   */
  async validateGameNamespace(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/validate`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Gets a game namespace by namespace ID.
   */
  async getGameNamespaceById(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetGameNamespaceByIdOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Adds an authenticated user to the given game namespace.
   */
  async updateNamespaceCdnAuthUser(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/auth-user`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.UpdateNamespaceCdnAuthUserInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes an authenticated user from the given game namespace.
   */
  async removeNamespaceCdnAuthUser(gameId, namespaceId, user) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/auth-user/${user}`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the CDN authentication type of the given game namesapce.
   */
  async setNamespaceCdnAuthType(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/cdn-auth`
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.SetNamespaceCdnAuthTypeInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Toggles whether or not to allow authentication based on domain for the given game namesapce.
   */
  async toggleNamespaceDomainPublicAuth(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domain-public-auth`
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.ToggleNamespaceDomainPublicAuthInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Adds a domain to the given game namespace.
   */
  async addNamespaceDomain(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domains`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.AddNamespaceDomainInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes a domain from the given game namespace.
   */
  async removeNamespaceDomain(gameId, namespaceId, domain) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domains/${domain}`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates matchmaker config for the given game namespace.
   */
  async updateGameNamespaceMatchmakerConfig(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/mm-config`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.UpdateGameNamespaceMatchmakerConfigInput.jsonOrThrow(
        request
      )
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to update a game namespace's matchmaker config.
   */
  async validateGameNamespaceMatchmakerConfig(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/mm-config/validate`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceMatchmakerConfigInput.jsonOrThrow(
        request
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceMatchmakerConfigOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a development token for the given namespace.
   */
  async createGameNamespaceTokenDevelopment(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/development`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.CreateGameNamespaceTokenDevelopmentInput.jsonOrThrow(
        request
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceTokenDevelopmentOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game namespace development token.
   */
  async validateGameNamespaceTokenDevelopment(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/development/validate`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceTokenDevelopmentInput.jsonOrThrow(
        request
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceTokenDevelopmentOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a public token for the given namespace.
   */
  async createGameNamespaceTokenPublic(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/public`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceTokenPublicOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the version of a game namespace.
   */
  async updateGameNamespaceVersion(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/version`
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.namespaces.UpdateGameNamespaceVersionInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _analytics;
  get analytics() {
    return this._analytics ??= new Client11(this.options);
  }
  _logs;
  get logs() {
    return this._logs ??= new Client12(this.options);
  }
};

// src/api/resources/cloud/resources/games/resources/tokens/client/Client.ts
init_core();
var import_url_join13 = __toESM(require_url_join());
init_serialization();
var Client14 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new game cloud token.
   */
  async createCloudToken(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join13.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/tokens/cloud`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateCloudTokenOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/resources/versions/client/Client.ts
init_core();
var import_url_join14 = __toESM(require_url_join());
init_serialization();
var Client15 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new game version.
   */
  async createGameVersion(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join14.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions/`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.CreateGameVersionInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameVersionOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game version.
   */
  async validateGameVersion(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join14.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions//validate`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.games.ValidateGameVersionInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.games.ValidateGameVersionOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a game version by its version ID.
   */
  async getGameVersionById(gameId, versionId) {
    const _response = await fetcher({
      url: (0, import_url_join14.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions//${versionId}`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGameVersionByIdOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/games/client/Client.ts
var Client16 = class {
  constructor(options) {
    this.options = options;
  }
  _avatars;
  get avatars() {
    return this._avatars ??= new Client6(this.options);
  }
  _builds;
  get builds() {
    return this._builds ??= new Client7(this.options);
  }
  _cdn;
  get cdn() {
    return this._cdn ??= new Client8(this.options);
  }
  _games;
  get games() {
    return this._games ??= new Client9(this.options);
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Client10(this.options);
  }
  _namespaces;
  get namespaces() {
    return this._namespaces ??= new Client13(this.options);
  }
  _tokens;
  get tokens() {
    return this._tokens ??= new Client14(this.options);
  }
  _versions;
  get versions() {
    return this._versions ??= new Client15(this.options);
  }
};

// src/api/resources/cloud/resources/groups/client/Client.ts
init_core();
var import_url_join15 = __toESM(require_url_join());
init_serialization();
var Client17 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Validates information used to create a new group.
   */
  async validateGroup(request) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/groups/validate"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.ValidateGroupInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.ValidateGroupOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns billing information for the given group over the given query time span.
   */
  async getGroupBilling(groupId, request = {}) {
    const { queryStart, queryEnd } = request;
    const _queryParams = new URLSearchParams();
    if (queryStart != null) {
      _queryParams.append("query_start", queryStart.toString());
    }
    if (queryEnd != null) {
      _queryParams.append("query_end", queryEnd.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetGroupBillingOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of invoices for the given group.
   */
  async getGroupInvoicesList(groupId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/invoices`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetGroupInvoicesListOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of payments for the given group.
   */
  async getGroupPaymentsList(groupId, request = {}) {
    const { startPaymentId } = request;
    const _queryParams = new URLSearchParams();
    if (startPaymentId != null) {
      _queryParams.append("start_payment_id", startPaymentId);
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/payments`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetGroupPaymentsListOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of bank transfers for the given group.
   */
  async getGroupTransfersList(groupId, request = {}) {
    const { startTransferId } = request;
    const _queryParams = new URLSearchParams();
    if (startTransferId != null) {
      _queryParams.append("start_transfer_id", startTransferId);
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/transfers`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetGroupTransfersListOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a checkout session for the given group.
   */
  async groupBillingCheckout(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/checkout`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await cloud_exports2.GroupBillingCheckoutInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await cloud_exports2.GroupBillingCheckoutOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Converts the given group into a developer group.
   */
  async convertGroup(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/convert`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/logs/client/Client.ts
init_core();
var import_url_join16 = __toESM(require_url_join());
init_serialization();
var Client18 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns performance information about a Rivet Ray.
   */
  async getRayPerfLogs(rayId) {
    const _response = await fetcher({
      url: (0, import_url_join16.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/rays/${rayId}/perf`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.GetRayPerfLogsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/tiers/client/Client.ts
init_core();
var import_url_join17 = __toESM(require_url_join());
init_serialization();
var Client19 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns all available region tiers.
   */
  async getRegionTiers() {
    const _response = await fetcher({
      url: (0, import_url_join17.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/region-tiers"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await cloud_exports2.GetRegionTiersOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/resources/uploads/client/Client.ts
init_core();
var import_url_join18 = __toESM(require_url_join());
var Client20 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Marks an upload as complete.
   */
  async completeUpload(uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join18.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/uploads/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/cloud/client/Client.ts
var Client21 = class {
  constructor(options) {
    this.options = options;
  }
  _auth;
  get auth() {
    return this._auth ??= new Client3(this.options);
  }
  _devices;
  get devices() {
    return this._devices ??= new Client5(this.options);
  }
  _games;
  get games() {
    return this._games ??= new Client16(this.options);
  }
  _groups;
  get groups() {
    return this._groups ??= new Client17(this.options);
  }
  _logs;
  get logs() {
    return this._logs ??= new Client18(this.options);
  }
  _tiers;
  get tiers() {
    return this._tiers ??= new Client19(this.options);
  }
  _uploads;
  get uploads() {
    return this._uploads ??= new Client20(this.options);
  }
};

// src/api/resources/group/client/Client.ts
init_core();
var import_url_join21 = __toESM(require_url_join());
init_serialization();

// src/api/resources/group/resources/invites/client/Client.ts
init_core();
var import_url_join19 = __toESM(require_url_join());
init_serialization();
var Client22 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Inspects a group invite returning information about the team that created it.
   */
  async getInvite(groupInviteCode) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `invites/${groupInviteCode}`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await group_exports2.GetInviteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Consumes a group invite to join a group.
   */
  async consumeInvite(groupInviteCode) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `invites/${groupInviteCode}/consume`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await group_exports2.ConsumeInviteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a group invite. Can be shared with other identities to let them join this group.
   */
  async createInvite(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `groups/${groupId}/invites`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.CreateInviteInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await group_exports2.CreateInviteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/group/resources/joinRequests/client/Client.ts
init_core();
var import_url_join20 = __toESM(require_url_join());
init_serialization();
var Client23 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Requests to join a group.
   */
  async createJoinRequest(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join20.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-request/`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Resolves a join request for a given group.
   */
  async resolveJoinRequest(groupId, identityId, request) {
    const _response = await fetcher({
      url: (0, import_url_join20.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-request//${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.ResolveJoinRequestInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/group/client/Client.ts
var Client24 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of suggested groups.
   */
  async listSuggested(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)((this.options.environment ?? RivetEnvironment.Production).group, "/groups"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.ListSuggestedOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new group.
   */
  async create(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)((this.options.environment ?? RivetEnvironment.Production).group, "/groups"),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.CreateInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await group_exports2.CreateOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares an avatar image upload.
   * Complete upload with `rivet.api.group#CompleteAvatarUpload`.
   */
  async prepareAvatarUpload(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/avatar-upload/prepare"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.PrepareAvatarUploadInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await group_exports2.PrepareAvatarUploadOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validate contents of group profile. Use to provide immediate feedback on profile changes before committing them.
   */
  async validateProfile(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/profile/validate"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.ValidateProfileInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await group_exports2.ValidateProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fuzzy search for groups.
   */
  async search(request) {
    const { query, anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("query", query);
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/search"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.SearchOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an avatar image upload. Must be called after the file upload
   * process completes.
   * Call `rivet.api.group#PrepareAvatarUpload` first.
   */
  async completeAvatarUpload(groupId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's bans. Must have valid permissions to view.
   */
  async getBans(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetBansOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Bans an identity from a group. Must be the owner of the group to perform this action. The banned identity will no longer be able to create a join request or use a group invite.
   */
  async banIdentity(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans/${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Unbans an identity from a group. Must be the owner of the group to perform this action.
   */
  async unbanIdentity(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans/${identityId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's join requests. Must have valid permissions to view.
   */
  async getJoinRequests(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-requests`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetJoinRequestsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Kicks an identity from a group. Must be the owner of the group to perform this action.
   */
  async kickMember(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/kick/${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Leaves a group.
   */
  async leave(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/leave`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's members.
   */
  async getMembers(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/members`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetMembersOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group profile.
   */
  async getProfile(groupId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async updateProfile(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/profile`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.UpdateProfileInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async getSummary(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/summary`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await group_exports2.GetSummaryOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Transfers ownership of a group to another identity.
   */
  async transferOwnership(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/transfer-owner`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await group_exports2.TransferOwnershipInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _invites;
  get invites() {
    return this._invites ??= new Client22(this.options);
  }
  _joinRequests;
  get joinRequests() {
    return this._joinRequests ??= new Client23(this.options);
  }
};

// src/api/resources/identity/client/Client.ts
init_core();
var import_url_join24 = __toESM(require_url_join());
init_serialization();

// src/api/resources/identity/resources/events/client/Client.ts
init_core();
var import_url_join22 = __toESM(require_url_join());
init_serialization();
var Client25 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns all events relative to the current identity.
   */
  async watch(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join22.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/events/live"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.WatchEventsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/identity/resources/links/client/Client.ts
init_core();
var import_url_join23 = __toESM(require_url_join());
init_serialization();
var Client26 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Begins the process for linking an identity with the Rivet Hub.
   * # Importance of Linking Identities
   * When an identity is created via `rivet.api.identity#SetupIdentity`, the identity is temporary
   * and is not shared with other games the user plays.
   * In order to make the identity permanent and synchronize the identity with
   * other games, the identity must be linked with the hub.
   * # Linking Process
   * The linking process works by opening `identity_link_url` in a browser then polling
   * `rivet.api.identity#GetGameLink` to wait for it to complete.
   * This is designed to be as flexible as possible so `identity_link_url` can be opened
   * on any device. For example, when playing a console game, the user can scan a
   * QR code for `identity_link_url` to authenticate on their phone.
   *
   */
  async prepare() {
    const _response = await fetcher({
      url: (0, import_url_join23.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/game-links"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await identity_exports6.PrepareGameLinkOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns the current status of a linking process. Once `status` is `complete`, the identity's profile should be fetched again since they may have switched accounts.
   */
  async get(request) {
    const { identityLinkToken, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("identity_link_token", identityLinkToken);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join23.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/game-links"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetGameLinkOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/identity/client/Client.ts
var Client27 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Gets or creates an identity.
   * Passing an existing identity token in the body refreshes the token.
   * Temporary Accounts
   * Until the identity is linked with the Rivet Hub (see `PrepareGameLink`), this identity will be temporary but still behave like all other identities.
   * This is intended to allow users to play the game without signing up while still having the benefits of having an account. When they are ready to save their account, they should be instructed to link their account (see `PrepareGameLink`).
   * Storing Token
   * `identity_token` should be stored in some form of persistent storage. The token should be read from storage and passed to `Setup` every time the client starts.
   */
  async setup(request) {
    const { identityLinkToken } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("identity_link_token", identityLinkToken);
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.SetupOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches an identity profile.
   */
  async getProfile(identityId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches the current identity's profile.
   */
  async getSelfProfile(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches a list of identity handles.
   */
  async getHandles(request) {
    const { identityIds } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(identityIds)) {
      for (const _item of identityIds) {
        _queryParams.append("identity_ids", _item);
      }
    } else {
      _queryParams.append("identity_ids", identityIds);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/batch/handle"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetHandlesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches a list of identity summaries.
   */
  async getSummaries(request) {
    const { identityIds } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(identityIds)) {
      for (const _item of identityIds) {
        _queryParams.append("identity_ids", _item);
      }
    } else {
      _queryParams.append("identity_ids", identityIds);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/batch/summary"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetSummariesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates profile of the current identity.
   */
  async updateProfile(request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.UpdateProfileInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validate contents of identity profile. Use to provide immediate feedback on profile changes before committing them.
   */
  async validateProfile(request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile/validate"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.ValidateProfileInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fuzzy search for identities.
   */
  async search(request) {
    const { query, anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("query", query);
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/search"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.SearchOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Sets the current identity's game activity. This activity will automatically be removed when the identity goes offline.
   */
  async setGameActivity(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/activity"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.SetGameActivityInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes the current identity's game activity.
   */
  async removeGameActivity() {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/activity"
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's status.
   */
  async updateStatus(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/identities/self/status"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.UpdateStatusInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Follows the given identity. In order for identities to be "friends", the other identity has to also follow this identity.
   */
  async follow(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/follow`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Unfollows the given identity.
   */
  async unfollow(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/follow`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares an avatar image upload. Complete upload with `CompleteIdentityAvatarUpload`.
   */
  async prepareAvatarUpload(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/avatar-upload/prepare"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.PrepareAvatarUploadInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await identity_exports6.PrepareAvatarUploadOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an avatar image upload. Must be called after the file upload process completes.
   */
  async completeAvatarUpload(uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates an abuse report for an identity.
   */
  async report(identityId, request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/report`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await identity_exports6.ReportIdentityInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async listFollowers(identityId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/followers`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListFollowersOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async listRecentFollowers(request = {}) {
    const { count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/recent-followers"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListRecentFollowersOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async ignoreRecentFollower(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/self/recent-followers/${identityId}/ignore`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async listFriends(request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/friends"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListFriendsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async listMutualFriends(identityId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/mutual-friends`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListMutualFriendsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _events;
  get events() {
    return this._events ??= new Client25(this.options);
  }
  _links;
  get links() {
    return this._links ??= new Client26(this.options);
  }
};

// src/api/resources/kv/client/Client.ts
init_core();
var import_url_join26 = __toESM(require_url_join());
init_serialization();

// src/api/resources/kv/resources/batch/client/Client.ts
init_core();
var import_url_join25 = __toESM(require_url_join());
init_serialization();
var Client28 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Gets multiple key-value entries by key(s).
   */
  async getBatch(request = {}) {
    const { watchIndex, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await kv_exports4.GetBatchOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Puts (sets or overwrites) multiple key-value entries by key(s).
   */
  async putBatch(request) {
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await kv_exports4.PutBatchInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes multiple key-value entries by key(s).
   */
  async deleteBatch(request = {}) {
    const { namespaceId } = request;
    const _queryParams = new URLSearchParams();
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/kv/client/Client.ts
var Client29 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a specific key-value entry by key.
   */
  async get(request) {
    const { key, watchIndex, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("key", key);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join26.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await kv_exports4.GetOutput.parseOrThrow(_response.body, {
        allowUnknownKeys: true
      });
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Puts (sets or overwrites) a key-value entry by key.
   */
  async put(request) {
    const _response = await fetcher({
      url: (0, import_url_join26.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await kv_exports4.PutInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes a key-value entry by key.
   */
  async delete(request) {
    const { key, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("key", key);
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join26.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _batch;
  get batch() {
    return this._batch ??= new Client28(this.options);
  }
};

// src/api/resources/matchmaker/resources/lobbies/client/Client.ts
init_core();
var import_url_join27 = __toESM(require_url_join());
init_serialization();
var Client30 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Marks the current lobby as ready to accept connections.  Players will not be able to connect to this lobby until the  lobby is flagged as ready.
   */
  async ready() {
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/ready"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * If `is_closed` is `true`, players will be prevented from joining the lobby.
   * Does not shutdown the lobby.
   *
   */
  async setClosed(request) {
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/closed"
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await matchmaker_exports7.SetLobbyClosedInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Finds a lobby based on the given criteria.
   * If a lobby is not found and `prevent_auto_create_lobby` is `true`,
   * a new lobby will be created.
   *
   */
  async find(request) {
    const { origin, ..._body } = request;
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/find"
      ),
      method: "POST",
      headers: {
        origin,
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await matchmaker_exports7.FindLobbyInput.jsonOrThrow(_body)
    });
    if (_response.ok) {
      return await matchmaker_exports7.FindLobbyOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Joins a specific lobby.
   * This request will use the direct player count configured for the
   * lobby group.
   *
   */
  async join(request) {
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/join"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await matchmaker_exports7.JoinLobbyInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await matchmaker_exports7.JoinLobbyOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Lists all open lobbies.
   */
  async list() {
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/list"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await matchmaker_exports7.ListLobbiesOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/matchmaker/resources/players/client/Client.ts
init_core();
var import_url_join28 = __toESM(require_url_join());
init_serialization();
var Client31 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Validates the player token is valid and has not already been consumed then
   * marks the player as connected.
   * # Player Tokens and Reserved Slots
   * Player tokens reserve a spot in the lobby until they expire. This allows for
   * precise matchmaking up to exactly the lobby's player limit, which is
   * important for games with small lobbies and a high influx of players.
   * By calling this endpoint with the player token, the player's spot is marked
   * as connected and will not expire. If this endpoint is never called, the
   * player's token will expire and this spot will be filled by another player.
   * # Anti-Botting
   * Player tokens are only issued by caling `lobbies.join`, calling `lobbies.find`, or
   * from the `GlobalEventMatchmakerLobbyJoin` event.
   * These endpoints have anti-botting measures (i.e. enforcing max player
   * limits, captchas, and detecting bots), so valid player tokens provide some
   * confidence that the player is not a bot.
   * Therefore, it's important to make sure the token is valid by waiting for
   * this endpoint to return OK before allowing the connected socket to do
   * anything else. If this endpoint returns an error, the socket should be
   * disconnected immediately.
   * # How to Transmit the Player Token
   * The client is responsible for acquiring the player token by caling
   * `lobbies.join`, calling `lobbies.find`, or from the `GlobalEventMatchmakerLobbyJoin`
   * event.  Beyond that, it's up to the developer how the player token is
   * transmitted to the lobby.
   * If using WebSockets, the player token can be transmitted as a query
   * parameter.
   * Otherwise, the player token will likely be automatically sent by the client
   * once the socket opens. As mentioned above, nothing else should happen until
   * the player token is validated.
   *
   */
  async connected(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/players/connected"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await matchmaker_exports7.PlayerConnectedInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Marks a player as disconnected. # Ghost Players If players are not marked as disconnected, lobbies will result with "ghost players" that the matchmaker thinks exist but are no longer connected to the lobby.
   */
  async disconnected(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/players/disconnected"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await matchmaker_exports7.PlayerDisconnectedInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/matchmaker/resources/regions/client/Client.ts
init_core();
var import_url_join29 = __toESM(require_url_join());
init_serialization();
var Client32 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of regions available to this namespace.
   * Regions are sorted by most optimal to least optimal. The player's IP address
   * is used to calculate the regions' optimality.
   *
   */
  async list() {
    const _response = await fetcher({
      url: (0, import_url_join29.default)((this.options.environment ?? RivetEnvironment.Production).matchmaker, "/regions"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return await matchmaker_exports7.ListRegionsOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/matchmaker/client/Client.ts
var Client33 = class {
  constructor(options) {
    this.options = options;
  }
  _lobbies;
  get lobbies() {
    return this._lobbies ??= new Client30(this.options);
  }
  _players;
  get players() {
    return this._players ??= new Client31(this.options);
  }
  _regions;
  get regions() {
    return this._regions ??= new Client32(this.options);
  }
};

// src/api/resources/party/resources/activity/client/Client.ts
init_core();
var import_url_join31 = __toESM(require_url_join());

// src/api/resources/party/resources/activity/resources/matchmaker/client/Client.ts
init_core();
var import_url_join30 = __toESM(require_url_join());
init_serialization();
var Client34 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Attempts to make the current identity's party find a lobby based on the given criteria. If succeeds, all party members will receive a `GlobalEventMatchmakerLobbyJoin` event with all the information required to join the lobby. This request will use the party player count configured for the lobby group. See `FindLobby`.
   */
  async findLobbyForParty(request) {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity/matchmaker/lobbies/find"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.activity.FindMatchmakerLobbyForPartyInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Attempts to make the current identity's party join a specific matchmaker lobby. This request will use the party player count configured for the lobby group. If succeeds, all party members will receive a `GlobalEventMatchmakerLobbyJoin` event with all the information required to join the lobby. Identity must be the party leader. See `JoinLobby`.
   */
  async joinLobbyForParty(request) {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity/matchmaker/lobbies/join"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.activity.JoinMatchmakerLobbyForPartyInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async requestPlayer() {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/members/self/matchmaker/request-player"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/party/resources/activity/client/Client.ts
var Client35 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Sets the activity of the current identity's party to idle.
   * Identity must be the party leader.
   */
  async setPartyToIdle() {
    const _response = await fetcher({
      url: (0, import_url_join31.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity"
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Client34(this.options);
  }
};

// src/api/resources/party/resources/parties/client/Client.ts
init_core();
var import_url_join32 = __toESM(require_url_join());
init_serialization();
var Client36 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Fetches a party based on a given invite.
   */
  async getFromInvite(request = {}) {
    const { token, alias } = request;
    const _queryParams = new URLSearchParams();
    if (token != null) {
      _queryParams.append("token", token);
    }
    if (alias != null) {
      _queryParams.append("alias", alias);
    }
    const _response = await fetcher({
      url: (0, import_url_join32.default)((this.options.environment ?? RivetEnvironment.Production).party, "invites"),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetInviteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new party.
   */
  async create(request) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)((this.options.environment ?? RivetEnvironment.Production).party, "parties"),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.CreateInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await party_exports2.CreateOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Joins a party using a given party invite.
   */
  async join(request) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)((this.options.environment ?? RivetEnvironment.Production).party, "parties/join"),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.JoinInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await party_exports2.JoinOutput.parseOrThrow(_response.body, {
        allowUnknownKeys: true
      });
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new party invite for the current identity's party.
   * Identity must be the party leader.
   */
  async createInvite(request) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/invites"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.CreateInviteInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return await party_exports2.CreateInviteOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Revokes a party invite from the current identity's party.
   * Identity must be the party leader.
   */
  async revokeInvite(inviteId) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/invites/${inviteId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Leaves the current identity's party.
   */
  async leave() {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/leave"
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Kicks a member from the current identity's current party.
   * Identity must be the party leader.
   */
  async kickMember(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/members/${identityId}/kick`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Transfers ownership of the party to another party member.
   * Identity must be the party leader.
   */
  async transferOwnership(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/members/${identityId}/transfer-ownership`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party profile for the party the current identity is a member of.
   */
  async getSelfProfile(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/profile"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSelfProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Sets the publicity of a party.
   * This configures who can view and join the party.
   * Identity must be the party leader.
   */
  async setPublicity(request) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/publicity"
      ),
      method: "PUT",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      body: await party_exports2.SetPublicityInput.jsonOrThrow(request)
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party summary for the party the current identity is a member of.
   */
  async getSelfSummary(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/summary"
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSelfSummaryOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async sendJoinRequest(partyId) {
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/join-request/send`
      ),
      method: "POST",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      }
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party profile.
   */
  async getProfile(partyId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetProfileOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party summary.
   */
  async getSummary(partyId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join32.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/summary`
      ),
      method: "GET",
      headers: {
        Authorization: BearerToken.toAuthorizationHeader(await Supplier.get(this.options.token))
      },
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSummaryOutput.parseOrThrow(
        _response.body,
        { allowUnknownKeys: true }
      );
    }
    if (_response.error.reason === "status-code") {
      throw new RivetError({
        statusCode: _response.error.statusCode,
        body: _response.error.body
      });
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
};

// src/api/resources/party/client/Client.ts
var Client37 = class {
  constructor(options) {
    this.options = options;
  }
  _activity;
  get activity() {
    return this._activity ??= new Client35(this.options);
  }
  _parties;
  get parties() {
    return this._parties ??= new Client36(this.options);
  }
};

// src/Client.ts
var RivetClient = class {
  constructor(options) {
    this.options = options;
  }
  _chat;
  get chat() {
    return this._chat ??= new Client2(this.options);
  }
  _cloud;
  get cloud() {
    return this._cloud ??= new Client21(this.options);
  }
  _group;
  get group() {
    return this._group ??= new Client24(this.options);
  }
  _identity;
  get identity() {
    return this._identity ??= new Client27(this.options);
  }
  _kv;
  get kv() {
    return this._kv ??= new Client29(this.options);
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Client33(this.options);
  }
  _party;
  get party() {
    return this._party ??= new Client37(this.options);
  }
};
export {
  api_exports as Rivet,
  RivetClient,
  RivetEnvironment,
  RivetError,
  RivetTimeoutError
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

basic-auth/index.js:
  (*!
   * basic-auth
   * Copyright(c) 2013 TJ Holowaychuk
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
