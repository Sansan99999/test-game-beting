let walletAddress = null;

// DOM Elements
const connectWalletBtn = document.getElementById("connectWallet");
const disconnectWalletBtn = document.getElementById("disconnectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");
const networkDisplay = document.getElementById("network");
const balanceDisplay = document.getElementById("balance");
const betAmountInput = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBet");
const betResultDisplay = document.getElementById("betResult");

// Connect wallet
connectWalletBtn.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      walletAddressDisplay.innerText = `Wallet: ${walletAddress}`;

      const network = await ethereum.request({ method: "net_version" });
      networkDisplay.innerText = `Network: ${getNetworkName(network)}`;

      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      });
      balanceDisplay.innerText = `Balance: ${parseFloat(ethers.utils.formatEther(balance)).toFixed(4)} ETH`;

      disconnectWalletBtn.classList.remove("hidden");
      connectWalletBtn.classList.add("hidden");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this feature.");
  }
});

// Disconnect wallet
disconnectWalletBtn.addEventListener("click", () => {
  walletAddress = null;
  walletAddressDisplay.innerText = "Wallet: Not connected";
  networkDisplay.innerText = "Network: Not connected";
  balanceDisplay.innerText = "Balance: -";
  disconnectWalletBtn.classList.add("hidden");
  connectWalletBtn.classList.remove("hidden");
});

// Place a bet
placeBetBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Please connect your wallet first!");
    return;
  }

  const betAmount = betAmountInput.value;
  if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
    alert("Enter a valid bet amount!");
    return;
  }

  try {
    const transaction = await ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: walletAddress,
          to: "0xRecipientAddressHere", // Replace with recipient address
          value: ethers.utils.parseEther(betAmount).toHexString(),
        },
      ],
    });
    betResultDisplay.innerText = `Transaction sent! Hash: ${transaction}`;
  } catch (error) {
    console.error("Error placing bet:", error);
    betResultDisplay.innerText = "Bet failed! Check console for details.";
  }
});

// Helper: Get network name
function getNetworkName(networkId) {
  switch (networkId) {
    case "1":
      return "Mainnet";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    case "5":
      return "Goerli";
    case "42":
      return "Kovan";
    default:
      return "Unknown";
  }
}
