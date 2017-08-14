#!/usr/bin/env node

const path = require('path')
const openurl = require('openurl')

const [,,FILE] = process.argv

const rfl = path.resolve(process.cwd(), FILE)

class Model {
    constructor(name) {
        this.name = name
    }

    toString() {
        return this.name
    }

    toYUML () {
        return 'sd'
    }
}

const configs = {
    type: 'usecase'
}

const models = []
const rules = []

function addNewRule () {
    
}

function addModels (model) {
    models.push(model)
    return model
}

global.a = function defineNewModel(name) {
    return addModels(new Model(name))
}

global.type = function setTypeDiagram (typeStr) {
    configs.type = typeStr
}

// load diagram `yuml.js` file
require(rfl)

if (configs.type === 'usecase') {
    console.log(models.map(m=>m.toYUML()).join(','))
    // openurl.open(`https://yuml.me/diagram/plain/usecase/%5BCustomer%5D-(Sign%20In),%20%5BCustomer%5D-(Buy%20Products),%20(Buy%20Products)%3E(Browse%20Products),%20(Buy%20Products)%3E(Checkout),%20(Checkout)%3C(Add%20New%20Credit%20Card).png`)
}

