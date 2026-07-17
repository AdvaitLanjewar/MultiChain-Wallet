const handleCreateWallet = async () => {
  try {
    console.log("Calling backend...");

    const response = await API.get("/generate-wallet");

    console.log("Response:", response);

    console.log("Data:", response.data);

    setWallet(response.data);

    console.log("Wallet saved.");

    navigate("/dashboard");

  } catch (error) {
    console.log("FULL ERROR:", error);

    console.log("Response:", error.response);

    console.log("Message:", error.message);

    alert("Failed to generate wallet.");
  }
};