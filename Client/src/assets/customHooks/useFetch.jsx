function useFetch(url = "", infoObject = {}) {
  async function doTheFetch(url, infoObject) {
    try {
      const response = await fetch(url, infoObject);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const jsonResponse = await response.json();
        return jsonResponse;
      } else {
        const textResponse = await response.text();
        return textResponse;
      }
    } catch (error) {
      throw new Error(`Fetch error: ${error.message}`);
    }
  }

  return doTheFetch(url, infoObject);
}

export default useFetch;
