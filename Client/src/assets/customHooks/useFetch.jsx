function useFetch(url = "", infoObject = {}) {
  async function doTheFetch(url, infoObject) {
    try {
      const response = await fetch(url, infoObject);
      if (!response.ok) throw new Error("not found");
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return doTheFetch(url, infoObject);
}

export default useFetch;
