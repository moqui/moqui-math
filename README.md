# Moqui Math

[![license](http://img.shields.io/badge/license-CC0%201.0%20Universal-blue.svg)](https://github.com/moqui/moqui-math/blob/master/LICENSE.md)

Moqui Math is a Moqui Framework component that provides a relational data model for applied mathematics. It covers the mathematical structures needed in industrial automation, scientific computing, and machine-learning pipelines — with no runtime code and no external dependencies.

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

The `Tensor` entity supports multiple storage backends via `storageTypeEnumId` and `TensorContent`: row-per-element, JSON/BLOB array fields, and external files (NumPy `.npy`, Zarr, Safetensors, Apache Arrow IPC, HDF5, Parquet, TileDB, PyTorch `.pt`). Sparse formats include COO, CSR, CSC, BSR, BSC.

### Mathematical Models

`MathModelDef` carries the PLM lifecycle (Draft → Approved → Production → Retired) and external-registry identification (Hugging Face ID, OpenAI model name, MLflow registered model ID, etc.). `MathModel` is a concrete instance; `MathModelRun` tracks training, eval, or inference runs with status flows, metrics, and events.

## Math–Device duality

`moqui.math` and `moqui.device` are two complementary faces of the same problem. A math model cannot run without a device (CPU, GPU, PLC, edge accelerator); a device cannot be meaningfully described without first modelling what it computes. The binding entity `DeviceMathModel` (in `moqui-device`) connects the two sides so the same governance schema — config history, rule evaluation, audit log, effective dating — serves both industrial automation and AI/ML pipelines uniformly.

## Dependencies

None.

## Install

    ./gradlew getComponent -Pcomponent=moqui-math
