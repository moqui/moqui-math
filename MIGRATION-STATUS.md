# MR Moqui Model Port

## Scope

The `mr-moqui` branch retains the mathematical entity model and seed identities
from `main`. Entity definitions, relationships, indexes and SQL views remain XML;
JavaScript is used for runtime expressions and regression specs, not a duplicate
schema. No calculation engine or service implementation is added by this step.

`MathViewEntities.xml` already contains the MR Moqui SQL adaptations for matrix
and tensor projections. `ParametricPath.events` now joins on
`approximatedFunctionId`, the actual shared key, instead of the nonexistent
`parametricPathId`. No table or primary key changes are required.

## Verification

From the MR Moqui root, with this branch installed under `runtime/components/addon`:

```bash
./moq test --nobuild moqui-math --spec MathModel,MathViews --db fresh
target/release/moqui check runtime/components/addon/moqui-math/entity runtime/components/addon/moqui-math/data
```

The specs verify relationship traversal, matrix projections and tensor indices
against a disposable PostgreSQL database. `--nobuild` uses the already built
framework binary; build first if it is missing. No Node.js runtime is needed.

The model can load without `moqui-device` or Mantle. Device-specific foreign keys
are supplied by the `moqui-device` extensions when that component is installed.
Service conversion and provider choices are a separate phase.
