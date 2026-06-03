# Moqui Math

[![license](http://img.shields.io/badge/license-CC0%201.0%20Universal-blue.svg)](https://github.com/moqui/moqui-math/blob/master/LICENSE.md)

**PLM for mathematical models: the model is the product, with a lifecycle, a change history, and proof.**

When AI reshapes a model on the fly — a network topology, a simulation's mesh, a
controller's law — that change is a decision that should be frozen and validated
*before* it becomes real. Today it lands in a data lake, or at best in a workflow
audit log that records the *action* but not the *model*. This is the structured
space for the model itself.

**A structured space for mathematical models, their evolution, and the proof that they do what they claim — not a data lake.**

Moqui Math is a Moqui Framework component: a relational data model for applied
mathematics, with no runtime code and no external dependencies. It covers the
structures used in industrial automation, scientific computing, and
machine-learning pipelines.

But the entity catalogue is not the point. This is.

## Why this exists

Today a mathematical model that *acts on the physical world* — a trajectory
planner driving a robot arm, a controller setpoint, a PINN learning a
thermodynamic process, a CFD field validated against a wind tunnel — leaves
almost no governable trace of **what it was, why it changed, and on what proof
it was allowed to run.**

The numbers end up in one of two bad places:

- a **data lake**: unstructured blobs you hope to make sense of *later*, with AI
  generating them faster than anyone can keep up — semantics reconstructed
  after the fact, if ever; or
- an **MLOps registry**: it versions the artefact (the weights, the file) but
  knows nothing about the physical device that executes it, the specification it
  is supposed to approximate, or the evidence that it stays within tolerance.

Neither records the *fact*. Both leave you, ten years later, holding numbers
nobody can explain.

And "ten years" is not rhetorical. Under the **EU AI Act** (Reg. 2024/1689),
providers of high-risk AI systems must keep technical documentation and
automatically generated logs for **ten years**, demonstrating — with verifiable
evidence, not description — that the system meets its requirements throughout its
lifecycle. Industrial machinery, medical, and other regulated domains carry
parallel obligations. A data lake cannot produce that evidence on demand; an
artefact registry does not know the device or the specification. What the
regulation asks for is precisely a *governed fact with proof attached* — which is
what this model is built to hold.

## What it does instead

Moqui Math treats a model the way accounting treats a transaction.

In a warehouse you can record every stock movement, one event at a time, when
you need full traceability — or post a daily or monthly aggregate when you don't.
Either way you record the **movement that changes the ledger**, never the
intermediate arithmetic of a line total. Thermodynamics and motion are no
different: there is always an event that *changes the system*, and that is the
thing worth keeping.

A data lake refuses this discipline. It keeps everything, unstructured, and
defers meaning forever — and with AI now writing into it faster than any human
can audit, "later" never comes. You are left with petabytes no one can read.
A workflow audit log is the opposite failure: it faithfully records *that* an
agent acted — invocation, tool call, rollback — but not the *model* the action
produced, in typed and validatable form. This model is a third stance: not "save
everything" (you drown), not "log only the action" (you keep the gesture, lose
the object), but **save the fact, structured at the moment of writing**, so its
meaning is known *a priori* and never has to be reconstructed.

You don't journal every intermediate multiplication — you journal the **event
that changes the system** and carries consequences. A rotation matrix recomputed
identically every cycle is a calculation; the moment a model *redefines the
dynamics that govern what happens next* is a fact, and a fact deserves an entry:
who, when, from what state to what state, on what evidence.

And the fact is not only the running model. It is the **whole lifecycle of the
model as a product**: its conception, its prototype, each revision of its
discretization or formulation, and the **change management between releases** —
where a human approval gate, and where required the legal or compliance
department, can sit *between one version and the next* before a model is allowed
into production. The AI Act forbids a system from promoting itself into
production without oversight; here that gate is a native, dated, signed
transition, not an afterthought.

The component supplies the **structured space** for all of this. It does not
decide for you which events are salient — that judgement belongs to the domain
expert (the process engineer, the physicist, the field technician). A colour
shift on a curing salami may be exactly the event one producer records, because
it links colour to water activity to a prediction of how the curing will go;
another producer ignores it. The schema does not need to know in advance. It
guarantees only this: **whatever you choose to record is born with known
semantics, instead of having to be reverse-engineered from a blob.**

Granularity is yours: event-by-event when you need fine traceability, aggregated
when you don't. The schema imposes meaning, not frequency.

## The Math–Device duality

`moqui.math` and `moqui.device` are two faces of one problem. **You cannot run a
model without a device** (CPU, GPU, PLC, edge accelerator); **you cannot
meaningfully describe a device without modelling what it computes.**

The binding entity `DeviceMathModel` (in `moqui-device`) connects the two sides,
so the *same* governance machinery — config history, rule evaluation, audit log,
effective dating — serves a PLC moving a servo and a GPU cluster training a
transformer, unchanged. The only knob that differs is the device type.

This is the part no MLOps tool has, because they all come from the software side
and treat the device as a deployment detail. Here it is co-primary.

## Specification, realization, and proof

The pairing that makes this a *lifecycle* system, not just a registry:

- a **`Transformation`** is the specification — what the model is meant to do;
- an **`ApproximatedFunction`** / `MathModel` is the realization — the network,
  the fit, the controller that actually does it;
- a **`MathModelRun`** produces the evidence — metrics, and the measured error
  of the realization against the specification.

A neural trajectory planner can be bound to the classical planner it
approximates, with its maximum relative error recorded as a dated, versioned
proof of conformance. This is the structure regulated domains need: not a
description of the model, but **verifiable evidence that it does what it must,
within a declared tolerance** — retainable, auditable, intelligible years later.

For outputs that are *not* explainable (an opaque network), the schema records
exactly that. "Explainable / not explainable" becomes a tracked attribute with
consequences, rather than a false post-hoc rationalization.

## Graphs and meshes are not minor state

It is tempting to read `Graph` and `Mesh` as bookkeeping — secondary tables
hanging off the real model. They are the opposite. A graph topology and a mesh
discretization *are the decision*: the exact thing an AI will increasingly change
**at runtime, on your behalf**, reshaping the model while it runs.

Consider an SDN network controller. An AI decides, on the fly, how to rewire the
routing graph between routers — adding a path, isolating a node, changing the
topology to absorb a failure or a traffic surge. That new graph is not telemetry.
It is a control decision with consequences, made faster than any operator could
review it. Agent-driven network operations already log *that* the agent acted,
with audit and rollback — but the *candidate graph itself*, frozen and validated
against constraints **before** it goes live (exactly what a network digital twin
needs to simulate the next state before deployment), is a typed model object, not
a workflow event. *Who changed the topology, when, from what graph to what graph,
on what evidence, and under whose authority* is the fact that must survive — the
same way a remesh that changes a simulation's discretization, or a model that
re-selects its own structure mid-run, is a decision and not a side effect.

When the AI changes the graph or the mesh, it is changing the model. This is
where that change becomes a recorded, governable fact instead of an unexplained
reconfiguration.

## Why it is the future of Model Lifecycle Management

With PID control, a historian was enough. With learned models — PINNs, neural
planners that adapt to real evolution — the model itself becomes an object with
state, versions, and proof obligations. It stops being a log line and starts
being a transaction.

MLM today is artefact versioning. What's missing — and what this provides — is
the model as a **governed fact**, joined to the physical device that runs it and
to the evidence that licenses it to run. That space does not exist elsewhere.
Moqui Math is built on a stable, sedimented universal data model (Silverston via
OFBiz/Moqui), so its stability comes from the structure it attaches to, not from
the churn of any release cycle.

It records the fact, and only the fact. Not everything (you drown), not nothing
(the blob you rightly distrust) — the structured space in between.

---

## Contents

| Domain | Entities |
|---|---|
| Parameters / Variables | `ParameterDef`, `Parameter`, `ParameterLog` |
| Linear Algebra | `Vector`, `VectorComponent`, `Matrix`, `MatrixComponent` |
| Tensors | `Tensor`, `TensorAxis`, `TensorElement`, `TensorContent` |
| Tensor operations | `MatrixDecomposition`, `TensorDecomposition`, `TensorDecompositionFactor`, slices, extractions |
| Coordinate Systems | `CoordinateSystem`, `CoordinateSystemBaseVector`, `CoordinateSystemMetric`, `CoordinateSystemTransformation` |
| Transformations | `Transformation`, `TransformationOperand`, `DiagonalExtraction`, `TriangularExtraction`, `BandExtraction`, `BlockMatrixExtraction`, `NormResult` |
| Approximated Functions | `ApproximatedFunction`, `ApproximatedFunctionSample`, `ApproximatedFunctionDerivative` |
| Mathematical Models | `MathModelDef`, `MathModelDefIdentification`, `MathModelDefContent`, `MathModel`, `MathModelRun`, `MathModelEvent`, `MathModelPerf`, `MathModelData` |
| Graph Theory | `Graph`, `GraphVertex`, `GraphEdge`, `GraphContent` |
| Finite-Element Mesh | `Mesh`, `MeshContent`, `MeshQuality`, `MeshKCell`, `MeshKCellVertex`, `MeshKCellEdge`, `MeshKCellIncidence`, `MeshGroup`, `MeshGroupMember` |
| Trajectories | `ParametricPath`, `ParametricPathPoint`, `ParametricPathContent`, `ParametricPathEvent`, `Trajectory`, `TrajectoryPoint`, `TrajectoryPointRun`, `TrajectoryRun`, `TrajectoryStats` |
| Category Theory | `Category`, `CategoryObject`, `Morphism`, `MorphismComposition`, `Functor`, `FunctorObjectMapping`, `FunctorMorphismMapping`, `NaturalTransformation`, `NaturalTransformationComponent`, `NaturalTransformationComposition` |

### Tensor storage

The `Tensor` entity keeps the **semantics** (axes with purpose and unit of
measure, coordinate system, lineage, proof) in the relational model and the
**bytes** in a backend chosen via `storageTypeEnumId` and `TensorContent`:
row-per-element, JSON/BLOB array fields, or external files (NumPy `.npy`, Zarr,
Safetensors, Apache Arrow IPC, HDF5, Parquet, TileDB, PyTorch `.pt`). Sparse
formats include COO, CSR, CSC, BSR, BSC. The opaque payload stays out; the
meaning stays in.

### Mathematical Models

`MathModelDef` carries the PLM lifecycle (Draft → Approved → Production →
Retired) and external-registry identification (Hugging Face ID, OpenAI model
name, MLflow registered model ID, etc.). `MathModel` is a concrete instance;
`MathModelRun` tracks training, eval, or inference runs with status flows,
metrics, and events.

## Dependencies

None.

## Install

    ./gradlew getComponent -Pcomponent=moqui-math
