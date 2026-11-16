/*
This software is in the public domain under CC0 1.0 Universal plus a
Grant of Patent License.

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software (see the LICENSE.md file). If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
*/
const created = []

function create(entity, fields) {
    const value = ec.entity.makeValue(entity)
    value.setFields(fields, true, null, null)
    value.create()
    created.push(value)
    return value
}

spec({
    setup() {
        ec.artifactExecution.disableAuthz()
    },
    cleanup() {
        try {
            while (created.length) created.pop().delete()
        } finally {
            ec.artifactExecution.enableAuthz()
        }
    }
})

feature("path events use the shared approximated function key in both directions", {
    when() {
        const paths = ["MATH_MODEL_PATH_A", "MATH_MODEL_PATH_B"].map(approximatedFunctionId => {
            create("moqui.math.ApproximatedFunction", {
                approximatedFunctionId,
                vectorSpaceEnumId: "EuclideanSpace2D",
                codomainTypeEnumId: "AfcVector",
                dataStorageEnumId: "AfdsPointTable"
            })
            return create("moqui.math.ParametricPath", {approximatedFunctionId})
        })
        const events = paths.map((path, index) =>
            create("moqui.math.ParametricPathEvent", {
                parametricPathEventId: `MATH_MODEL_EVENT_${index}`,
                approximatedFunctionId: path.approximatedFunctionId,
                eventTypeEnumId: "PpetStart"
            })
        )
        return {
            events: Array.from(paths[0].findRelated("events", null, null, false)),
            parent: events[0].findRelatedOne("parametricPath", false)
        }
    },
    then({events, parent}) {
        events.length == 1
        events[0].parametricPathEventId == "MATH_MODEL_EVENT_0"
        parent.approximatedFunctionId == "MATH_MODEL_PATH_A"
    }
})
