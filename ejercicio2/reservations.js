// Definir una clase Customer en el archivo reservations.js que permita representar un cliente.
class Customer {
    // La clase debe tener un constructor.
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Se debe implementar una propiedad computada info que retorne una cadena con el nombre y el correo electrónico del cliente.
    get info() {
        return `${this.name} - ${this.email}`;
    }
}

// Definir una clase Reservation en el archivo reservations.js que permita representar una reserva.
class Reservation {
    // La clase debe tener un constructor.
    constructor(id, customer, date, guests) {
        this.id = id;
        this.customer = customer;
        this.date = new Date(date);
        this.guests = guests;
    }

    // Se debe implementar una propiedad computada info que retorne una cadena con la fecha y hora de la reserva, la información del cliente y el número de comensales.
    get info() {
        return `Fecha y hora: ${this.date.toLocaleString()} - Cliente: ${this.customer.info} - Comensales: ${this.guests}`;
    }

    // Se debe implementar un método estático validate que reciba un objeto con la información de la reserva y retorne true si la información es válida y false en caso contrario.
    // Si la fecha de la reserva es anterior a la fecha actual y la cantidad de comensales es menor o igual a 0, la reserva no es válida.
    static validate(reservation) {
        const now = new Date();
        const reservationDate = new Date(reservation.date);
        return !(reservationDate <= now || reservation.guests <= 0);
    }

    // La consigna determina que el metodo se debe llamar "validate" el cual recibe un objeto, y valida, el metodo esta desarrollado arriba
    // Agrego este metodo ya que la clase Restaurant utiliza un metodo llamado "validateReservation" no "validate"
    // con el fin de que el programa funcione, ya que no se permite modificarla, agrego este
    // si no es acorde, estoy a dispodicion en el chat de la plataforma
    static validateReservation(date, guests) {
        const now = new Date();
        const reservationDate = new Date(date);
        return !(reservationDate <= now || guests <= 0);
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}
