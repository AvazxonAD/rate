class Currency {
  #code;
  #rate;

  constructor(code, rate) {
    this.#code = code;
    this.#rate = rate;
  }

  get code() {
    return this.#code;
  }

  get rate() {
    return this.#rate;
  }

  display(container) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${this.code}</td>
      <td>${this.rate.toFixed(4)}</td>
    `;
    container.appendChild(row);
  }
}

class CurrencyConverter {
  #currencies;

  constructor(currencies) {
    this.#currencies = currencies;
    this.#populateSelect("from-currency");
    this.#populateSelect("to-currency");
    document.getElementById("convert").addEventListener("click", () => {
      this.#convert();
    });
  }

  #populateSelect(selectId) {
    const select = document.getElementById(selectId);
    this.#currencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.textContent = currency.code;
      select.appendChild(option);
    });
  }

  #convert() {
    const fromCurrencyCode = document.getElementById("from-currency").value;
    const toCurrencyCode = document.getElementById("to-currency").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const fromCurrency = this.#currencies.find(
      (currency) => currency.code === fromCurrencyCode
    ).rate;
    const toCurrency = this.#currencies.find(
      (currency) => currency.code === toCurrencyCode
    ).rate;

    console.log(fromCurrency, toCurrency, amount);

    if (!fromCurrency || !toCurrency) {
      alert("Invalid currency selection.");
      return;
    }

    const convertedAmount = (amount * toCurrency) / fromCurrency;

    document.getElementById(
      "result"
    ).textContent = `${amount} ${fromCurrencyCode} = ${convertedAmount.toFixed(
      2
    )} ${toCurrencyCode}`;
  }
}

class App {
  #list;
  #currencies;

  constructor() {
    this.#init();
  }

  async #init() {
    this.#list = document.getElementById("table-body");
    const response = await fetch("https://api.frankfurter.app/latest?from=USD");
    const result = await response.json();
    this.#transformData(result);
    this.#renderCurrencies();
    this.#renderConverter();
  }

  #renderConverter() {
    new CurrencyConverter(this.#currencies);
  }

  #transformData(data) {
    const { base, amount, rates } = data;

    const baseCurrency = new Currency(base, amount);

    const otherCurrencies = Object.entries(rates).map(
      ([code, rate]) => new Currency(code, rate)
    );

    this.#currencies = [baseCurrency, ...otherCurrencies].filter(
      (item, index) => index < 10
    );
  }

  #renderCurrencies() {
    this.#currencies.forEach((currency) => {
      currency.display(this.#list);
    });
  }
}

new App();
