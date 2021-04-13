const path = require('path')
const fs = require('fs')


class Ticket {
    constructor(numero, escritorio) {
        this.numero
        this.escritorio
    }
}


class TicketControl {

    constructor() {
        this.ultimo = 0
        this.hoy = new Date().getDate()
        this.tickets = []
        this.ultimos4 = []

        this.init()
    }

    /**
     * Convertimos a Json
     */
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }


    /**
     * Inicializamos nuestra cola
     */
    init() {

        const { hoy, ultimo, tickets, ultimos4 } = require('../db/data.json')

        if (hoy === this.hoy) {
            this.tickets = tickets
            this.ultimo = ultimo
            this.ultimos4 = ultimos4
        } else {
            //es otr dia
            this.guardarDB()
        }
    }

    /**
     * Guardamos en nuestra base de datos 
     * */
    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }


    siguiente() {
        this.ultimo += 1
        const ticket = new Ticket(this.ultimo, null)

        this.tickets.push(ticket)

        this.guardarDB()
        return 'Ticket ' + this.ultimo
    }

    atenderTicket(escritorio) {
        //No tenemos tickets

        if (this.tickets.length === 0) {
            return null
        }

        const ticket = this.tickets.shift()   //this.tickets.shift()

        //Ticket que voy atender
        ticket.escritorio = escritorio

        //Isertamos al inicio
        this.ultimos4.unshift(ticket)

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1)
        }

        this.guardarDB()

        return ticket
    }


}

module.exports = TicketControl