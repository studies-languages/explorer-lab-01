import "./css/index.css"
import IMask from "imask"

const ccBgcolor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgcolor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "gray"],
  }

  ccBgcolor01.setAttribute("fill", colors[type][0])
  ccBgcolor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("mastercard")

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find((item) =>
      number.match(item.regex)
    )
    // console.log(foundMask.cardtype)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cadastrado com sucesso.!")
})

document
  .querySelector("form")
  .addEventListener("submit", (event) => event.preventDefault())

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerHTML = cardHolder.value ? cardHolder.value : "FULANO DA SILVA"
})

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerHTML = securityCodeMasked.value
    ? securityCodeMasked.value
    : "123"
})

cardNumberMasked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-number")
  setCardType(cardNumberMasked.masked.currentMask.cardtype)
  ccNumber.innerHTML = cardNumberMasked.value
    ? cardNumberMasked.value
    : "1234 5678 9012 3456"
})

expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerHTML = expirationDateMasked.value
    ? expirationDateMasked.value
    : "02/32"
})
