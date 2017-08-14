
let RelationID = 0

class Relation {
    constructor (type, frontelement, elementrelation) {
        this.type = type
        this.frontelement = frontelement
        this.elementrelation = elementrelation
        RelationID += 1
        this.RelationID = RelationID
    }

    toYUML () {
        switch (this.type) {
            case 'use': {
                return `${this.frontelement.toSingleYUML()}-${this.elementrelation.toSingleYUML()}`
                break
            }
            case 'inheritance': {
                return `${this.frontelement.toSingleYUML()}^${this.elementrelation.toSingleYUML()}`
                break
            }
            case 'note': {
                return `${this.frontelement.toSingleYUML()}-${this.elementrelation.toSingleYUML()}`
                break
            }

            case 'extend': {
                return `${this.frontelement.toSingleYUML()}<${this.elementrelation.toSingleYUML()}`
                break
            }

            case 'include': {
                return `${this.frontelement.toSingleYUML()}>${this.elementrelation.toSingleYUML()}`
                break
            }
        }
    }
}

class M {
    constructor (name) {
        this.name = name
        this.relations = []
        RelationID += 1
        this.RelationID = RelationID
    }

    point () {
        RelationID += 1
        this.RelationID = RelationID
    }

    use (_case) {
        this.relations.push(new Relation('use', this, _case))
        return this
    }

    inheritance (_inheritance) {
        this.relations.push(new Relation('inheritance', this, _inheritance))
        return this
    }

    toSingleYUML () {
        return `[${this.name}]`
        return this
    }

    note (_note) {
        if (!(_note instanceof Note)) {
            _note = new Note(_note)
        }

        this.relations.push(new Relation('note', this, _note))
        return this
    }

    extend (_extend) {
        this.relations.push(new Relation('extend', this, _extend))
        return this
    }

    include (_include) {
        this.relations.push(new Relation('include', this, _include))
        return this
    }

    toYUML () {
        if (this.relations.length === 0) {
            return this.toSingleYUML()
        } else {
            return this.relations
            .map(c => {
                return c.toYUML()
            })
            .join(', ')
        }
    }
}

class Actor extends M {
    constructor (name) {
        super(name)
    }

    toSingleYUML () {
        return `[${this.name}]`
    }
}

class Case extends M {
    constructor (name) {
        super(name)
    }

    toSingleYUML () {
        return `(${this.name})`
    }
}

class Note extends M {
    constructor (name) {
        super(name)
    }

    toSingleYUML () {
        return `(note: ${this.name})`
    }
}

function diagram(...entities) {
    const r = []

    entities.map(e=> {
        if (e.relations.length === 0) {
            r.push(e)
        } else {
            r.push(...e.relations)
        }
    })

    const nr = r.sort(function (a,b) {
        if (a.RelationID > b.RelationID) {
            return 1
        } else if (a.RelationID < b.RelationID) {
            return -1
        } else {
            return 0
        }
    })

    return nr.map(en=>en.toYUML()).join(', ')
}

module.exports.Actor = Actor
module.exports.Case = Case
module.exports.Note = Note
module.exports.diagram = diagram
