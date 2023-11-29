function useFetch(url = "", infoObject = {}) {
  console.log('hi')
  async function doTheFetch(url, infoObject) {
    try {
      const response = await fetch(url, infoObject);
      console.log('response: ', response)
      if (!response.ok) throw new Error("not found");
      const jsonResponse = await response.json();
      console.log('jsonResponse: ', jsonResponse)
      return jsonResponse;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return doTheFetch(url, infoObject);
}

export default useFetch;
