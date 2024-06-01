class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}
// se solicita que la clase CurrencyConverter sea implementada.
class CurrencyConverter {
  // constructor: Constructor de la clase que inicializa el atributo apiUrl con la URL base de la API de Frankfurter.
  // El constructor recibe un parámetro apiUrl que corresponde a la URL base de la API de Frankfurter.
  // El constructor debe inicializar el atributo currencies como un arreglo vacío.
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.currencies = [];
  }

  // getCurrencies: Método asíncrono que realiza una petición al endpoint /currencies de la API de Frankfurter para obtener la lista de códigos de monedas disponibles.
  // El método no recibe parámetros.
  async getCurrencies() {
    try {
      const responseApi = await fetch(`${this.apiUrl}/currencies`);
      const data = await responseApi.json();
      // El método debe almacenar las monedas obtenidas en el atributo currencies como instancias de la clase Currency.
      for (let code in data) {
        this.currencies.push(new Currency(code, data[code]));
      }
      // El método no retorna nada.
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  }

  // convertCurrency: Método asíncrono que realiza una petición al endpoint /latest de la API de Frankfurter para obtener la conversión de una moneda a otra.
  // El método recibe los siguientes parámetros: amount, fromCurrency, toCurrency.
  async convertCurrency(amount, fromCurrency, toCurrency) {
    // Si el atributo code de fromCurrency es igual al atributo code de toCurrency, el método debe retornar el monto sin realizar ninguna petición
    if (fromCurrency.code === toCurrency.code) {
      return amount;
    }
    // Si los códigos de moneda son diferentes, el método debe realizar una petición HTTP a la API y retornar el monto convertido, el cual es un número.
    try {
      const responseApi = await fetch(
        `${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`
      );
      const data = await responseApi.json();

      return data.rates[toCurrency.code] * amount;
    } catch (error) {
      // El método debe manejar errores en caso de que la petición falle y retornar null en caso de error.
      console.error("Error convirtiendo las monedas:", error);
      return null;
    }
  }

  async getExchangeRate(date, fromCurrency, toCurrency) {
    try {
      const responseApi = await fetch(
        `${this.apiUrl}/${date}?from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await responseApi.json();
      return data.rates[toCurrency];
    } catch (error) {
      console.error(`Error fetching exchange rate for ${date}:`, error);
      return null;
    }
  }

  // Se solicita implementar una funcionalidad adicional que permita determinar la diferencia entre la tasa de cambio de monedas de dos fechas diferentes, en particular, la diferencia entre la tasa de cambio de monedas de hoy y la tasa de cambio de monedas de ayer.
  async compareExchangeRate(fromCurrency, toCurrency) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];

    const rateToday = await this.getExchangeRate(
      today,
      fromCurrency.code,
      toCurrency.code
    );
    const rateYesterday = await this.getExchangeRate(
      yesterday,
      fromCurrency.code,
      toCurrency.code
    );

    if (rateToday !== null && rateYesterday !== null) {
      return rateToday - rateYesterday;
    } else {
      return null;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }

        // Se solicita implementar una funcionalidad adicional que permita determinar la diferencia entre la tasa de cambio de monedas de dos fechas diferentes, en particular, la diferencia entre la tasa de cambio de monedas de hoy y la tasa de cambio de monedas de ayer.
        const rateDifference = await converter.compareExchangeRate(
          fromCurrency,
          toCurrency
        );
        if (rateDifference !== null) {
          resultDiv.textContent += `\nLa diferencia en la tasa de cambio entre hoy y ayer es ${rateDifference.toFixed(4)}.`;
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
