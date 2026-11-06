const MATRIX = "MATH_VIEW_SPEC_MATRIX"
const TENSOR = "MATH_VIEW_SPEC_TENSOR"

function sys(work) {
    const wasDisabled = ec.artifactExecution.disableAuthz()
    try {
        return work()
    } finally {
        if (!wasDisabled) ec.artifactExecution.enableAuthz()
    }
}

function create(entityName, fields) {
    const value = ec.entity.makeValue(entityName)
    value.setFields(fields, true, null, null)
    value.create()
}

function cleanup() {
    sys(() => {
        ec.entity.find("moqui.math.MatrixComponent").condition("matrixId", MATRIX).deleteAll()
        ec.entity.find("moqui.math.Matrix").condition("matrixId", MATRIX).deleteAll()
        ec.entity.find("moqui.math.TensorElement").condition("tensorId", TENSOR).deleteAll()
        ec.entity.find("moqui.math.TensorAxis").condition("tensorId", TENSOR).deleteAll()
        ec.entity.find("moqui.math.Tensor").condition("tensorId", TENSOR).deleteAll()
    })
}

spec({
    setupSpec() {
        cleanup()
        sys(() => {
            create("moqui.math.Matrix", {
                matrixId: MATRIX,
                matrixTypeEnumId: "MtSquare",
                domainSpaceEnumId: "DimX",
                codomainSpaceEnumId: "DimY",
                rows: 2,
                cols: 2
            })
            for (const [id, rowIndex, colIndex, realValue] of [
                ["MATH_VIEW_SPEC_MC_00", 0, 0, 2],
                ["MATH_VIEW_SPEC_MC_01", 0, 1, 7],
                ["MATH_VIEW_SPEC_MC_11", 1, 1, 3]
            ]) {
                create("moqui.math.MatrixComponent", {
                    matrixComponentId: id,
                    matrixId: MATRIX,
                    rowIndex,
                    colIndex,
                    componentTypeEnumId: "MctCanonical",
                    realValue
                })
            }

            create("moqui.math.Tensor", {tensorId: TENSOR, rank: 2, shape: "[2,3]", size: 6})
            create("moqui.math.TensorAxis", {
                tensorId: TENSOR,
                axisIndex: 0,
                axisSize: 2,
                axisStride: 3,
                axisTypeEnumId: "TatDense",
                purposeEnumId: "TapHeight"
            })
            create("moqui.math.TensorAxis", {
                tensorId: TENSOR,
                axisIndex: 1,
                axisSize: 3,
                axisStride: 1,
                axisTypeEnumId: "TatDense",
                purposeEnumId: "TapWidth"
            })
            for (let linearIndex = 0; linearIndex < 6; linearIndex += 1) {
                create("moqui.math.TensorElement", {
                    tensorElementId: `MATH_VIEW_SPEC_TE_${linearIndex}`,
                    tensorId: TENSOR,
                    elementTypeEnumId: "TctDense",
                    linearIndex,
                    realValue: linearIndex + 1
                })
            }
        })
    },
    cleanupSpec() {
        cleanup()
    }
})

feature("matrix projections expose derived indices and one aggregate trace", {
    when() {
        return sys(() => ({
            components: Array.from(
                ec.entity.find("moqui.math.MatrixAndComponent").condition("matrixId", MATRIX).orderBy("rowIndex,colIndex").list()
            ),
            traces: Array.from(ec.entity.find("moqui.math.MatrixTrace").condition("matrixId", MATRIX).list()),
            vectorized: Array.from(
                ec.entity.find("moqui.math.MatrixVectorize").condition("matrixId", MATRIX).orderBy("rowIndex,colIndex").list()
            ),
            reciprocal: ec.entity
                .find("moqui.math.MatrixReciprocal")
                .condition({matrixId: MATRIX, matrixComponentId: "MATH_VIEW_SPEC_MC_00"})
                .one()
        }))
    },
    then({components, traces, vectorized, reciprocal}) {
        components.length == 3
        components[1].diffIndex == -1
        components[1].sumIndex == 1
        traces.length == 1
        traces[0].traceValue.eq(5)
        vectorized.map(row => Number(row.dimensionIndex)).join(",") == "0,1,3"
        reciprocal.recipRealValue.eq(0.5)
        reciprocal.recipImaginaryValue.eq(0)
    }
})

feature("tensor projections filter axes and preserve row-major integer indices", {
    when() {
        return {
            rows: sys(() => {
                const query = viewName =>
                    Array.from(ec.entity.find(`moqui.math.${viewName}`).condition("tensorId", TENSOR).orderBy("linearIndex").list())
                return {
                    leftRight: query("TensorFlipLeftRight"),
                    upDown: query("TensorFlipUpDown"),
                    mode0: query("TensorMode0Unfold"),
                    mode1: query("TensorMode1Unfold"),
                    reciprocal: query("TensorReciprocal")
                }
            })
        }
    },
    then({rows}) {
        rows.leftRight.length == 6
        rows.leftRight.map(row => Number(row.flipLinear)).join(",") == "2,1,0,5,4,3"
        rows.upDown.map(row => Number(row.flipLinear)).join(",") == "3,4,5,0,1,2"
        rows.mode0.map(row => Number(row.rowIndex)).join(",") == "0,0,0,1,1,1"
        rows.mode0.map(row => Number(row.colIndex)).join(",") == "0,1,2,0,1,2"
        rows.mode1.map(row => Number(row.rowIndex)).join(",") == "0,1,2,0,1,2"
        rows.mode1.map(row => Number(row.colIndex)).join(",") == "0,0,0,1,1,1"
        rows.reciprocal[0].recipRealValue.eq(1)
        rows.reciprocal[0].recipImagValue.eq(0)
    }
})
