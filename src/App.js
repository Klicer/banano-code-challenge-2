import logo from "./logo.svg";
import "./App.css";
import React from "react";
import bananojs from "@bananocoin/bananojs";

function uint8_to_hex(uint8) {
  let hex_string = "";
  for (let i = 0; i < uint8.length; i++) {
    let hex = uint8[i].toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hex_string += hex;
  }
  return hex_string;
}

bananojs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

async function getAddressAtIndex(seed, index) {
  const privateKey = bananojs.getPrivateKey(seed, index);
  const publicKey = await bananojs.getPublicKey(privateKey);
  const address = bananojs.getBananoAccount(publicKey);
  return address;
}

async function getAddresses(seed) {
  let addresses = [];
  for (let i = 0; i < 5; i++) {
    addresses.push(await getAddressAtIndex(seed, i));
  }
  return addresses;
}

function generateBananoSeed() {
  let uint8 = new Uint8Array(32);
  window.crypto.getRandomValues(uint8);
  return uint8_to_hex(uint8);
}

const Address = ({ address }) => {
  const [copyMsg, toggleCopyMsg] = React.useState(false);
  return (
    <div
      className="Address"
      style={{
        fontFamily: "Overpass Mono",
        cursor: copyMsg ? "default" : "pointer",
        userSelect: "none",
      }}
      onClick={() => {
        if (copyMsg) return;

        navigator.clipboard.writeText(address);

        toggleCopyMsg(true);
        setTimeout(() => {
          toggleCopyMsg(false);
        }, 1000);
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!copyMsg && (
          <img
            src={`https://monkey.banano.cc/api/v1/monkey/${address}`}
            height="30px"
            width="30px"
          />
        )}
        <div>{copyMsg ? "Copied wallet address to clipboard!" : address}</div>
      </div>
    </div>
  );
};

const App = () => {
  const [randomSeed, setRandomSeed] = React.useState("");
  const [addresses, setAddresses] = React.useState([]);

  const [countdown, setCountdown] = React.useState("");
  const interval = React.useRef();

  const updateCountdown = () => {
    const countDownDate = new Date("April 1, 2023 00:00:00").getTime();

    const x = countDownDate - new Date().getTime();

    let days = Math.floor(x / (1000 * 60 * 60 * 24));
    let hours = Math.floor((x % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((x % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((x % (1000 * 60)) / 1000);

    if (days < 10) days = "0" + days;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    setCountdown(`${days} : ${hours} : ${minutes} : ${seconds}`);
  };

  React.useEffect(() => {
    if (interval.current) return;
    updateCountdown();
    interval.current = setInterval(updateCountdown, 1000);

    const bananoSeed = generateBananoSeed();
    setRandomSeed(bananoSeed);

    getAddresses(bananoSeed).then((res) => setAddresses(res));
  }, []);

  return (
    <div className="App">
      <div className="CountdownContainer">
        <div className="Header">Banano's Birthday Countdown</div>
        <div className="Date">April 1, 2023</div>

        <div className="Countdown">{countdown}</div>
        <div class="WaveDivider">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              class="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
      <div className="BananoContainer">
        <div
          className="Header"
          style={{
            fontSize: "16px",
            color: "#d7bd10",
            fontFamily: "Overpass Mono",
          }}
        >
          Freshly Grown Banano Tree 🌴 (Click to Regenerate)
        </div>
        <div
          className="Address"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            const bananoSeed = generateBananoSeed();
            setRandomSeed(bananoSeed);

            getAddresses(bananoSeed).then((res) => setAddresses(res));
          }}
        >
          {randomSeed}
        </div>
        <div
          style={{ marginTop: "10px", fontSize: "16px", color: "#d7bd10" }}
          className="Header"
        >
          5 Ripe Banano Wallets, Ready For Harvest (Click to Copy)
        </div>
        {addresses.map((address) => (
          <Address address={address} />
        ))}
      </div>
    </div>
  );
};

export default App;
