async function testSave() {
  try {
    const res = await fetch('https://api-testing-tool-wx3o.onrender.com/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test Request",
        method: "GET",
        url: "https://example.com",
        headers: "[]",
        queryParams: "[]",
        body: ""
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (error) {
    console.error("Error message:", error.message);
  }
}

testSave();
