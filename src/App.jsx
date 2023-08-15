// custom hook (function that uses a React Hook)
// function name of a custom hook starts with "use"
// this particular function takes two arguments:
// initialUrl->initialize url in its useState
// initialData->initialize data in its useReducer
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  // useReducer takes two arguments:
  // reducer function: 'dataFetcherReducer' in this case
  // initial values of the state elements
  // returns an array with two elements:
  // state object which contains multiple states to be updated
  // dispatch function which change the states according to the reducer function
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    console.log('Fetching data')
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      //according to the reducer function: 
      //isLoading set to true
      //isError set to false
      //re-render
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          //according to the reducer function: 
          //isLoading set to false
          //isError set to false
          //data is set to payload
          //re-render
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
          //according to the reducer function: 
          //isLoading set to false
          //isError set to true
          //re-render
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []); //if setUrl (doFetch) is called, useEffect will be triggered
  return [state, setUrl];
};

//reducer function (first argument of hook useReducer)
//takes two arguments:
//state: its like handling multiples useState
//action: contains methods for handling switch selection and data
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState(""); //Future use as a query for search
  // useDataApi is a custom hook (can be used in other components)
  // returns an array with two elements:
  // object state with three elements: data, isLoading, isError
  // doFetch that is a function that setUrl
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://lldev.thespacedevs.com/2.2.0/spacecraft/",
    {
      results: []
    }
  );
  console.log('Rendering App')
  return (
    <>
    {isError && <div>Something went wrong ...</div>}
    {isLoading ? (
      <div>Loading ...</div>
    ) : (
    <div id="myCarousel" class="carousel slide mb-6" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        {data.results[1] && <div class="carousel-item active">
        <img src={data.results[1].spacecraft_config.image_url} class="d-block w-100"/>
          <div class="container">
            <div class="carousel-caption text-start">
              <h1>{data.results[1].name}</h1>
              <p class="opacity-75">Flights count: {data.results[1].flights_count}</p>
              <p class="opacity-75">Current status: {data.results[1].status.name}</p>
              <p><a class="btn btn-lg btn-primary" href={"https://www.google.com/search?q=" + data.results[1].name} target="_blank">More info</a></p>
            </div>
          </div>
        </div>}
        {data.results[3] && <div class="carousel-item">
        <img src={data.results[3].spacecraft_config.image_url} class="d-block w-100"/>
          <div class="container">
            <div class="carousel-caption">
              <h1>{data.results[3].name}</h1>
              <p class="opacity-75">Flights count: {data.results[3].flights_count}</p>
              <p class="opacity-75">Current status: {data.results[3].status.name}</p>
              <p><a class="btn btn-lg btn-primary" href={"https://www.google.com/search?q=" + data.results[3].name} target="_blank">More info</a></p>
            </div>
          </div>
        </div>}
        {data.results[2] && <div class="carousel-item">
        <img src={data.results[2].spacecraft_config.image_url} class="d-block w-100"/>
          <div class="container">
            <div class="carousel-caption text-end">
              <h1>{data.results[2].name}</h1>
              <p class="opacity-75">Flights count: {data.results[2].flights_count}</p>
              <p class="opacity-75">Current status: {data.results[2].status.name}</p>
              <p><a class="btn btn-lg btn-primary" href={"https://www.google.com/search?q=" + data.results[2].name} target="_blank">More info</a></p>
            </div>
          </div>
        </div>}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    )}
  </>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));