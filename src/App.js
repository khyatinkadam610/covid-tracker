import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from "./Table"
import { sortData } from "./utilty"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

// dark theme imports
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles, Themeddiv } from './global';
import Toggle from './toggle';
import { useDarkMode } from './useDarkMode';

function App() {
  // Dark theme 
  const [theme, toggleTheme, componentMounted] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;


  // if country variable is changed by setcountries then it will rerender the component containing that variable
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTabledata] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })

  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          })

          )
          const sortedData = sortData(data);
          console.log("set map", data)
          setMapCountries(data)
          setTabledata(sortedData)
          setCountries(countries)

        })
    }
    getCountriesData()
  }, [])


  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setInputCountry(countryCode)
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      })
  }
  // console.log("Countrieslog: ",countryInfo)
  //  
  if (!componentMounted) {
    return <div />
  };
  return (
    <ThemeProvider theme={themeMode}>
      <>

        <GlobalStyles />



        <div className="app">

          <div className="app__left">
            <div className="app__header">
              <h1>COVID-19 TRACKER</h1>
              {/* header */}
              <Toggle theme={theme} toggleTheme={toggleTheme} />
              <FormControl classname="app__dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <Themeddiv>
            <div className="app__stats">
              
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus cases"
                total={countryInfo.cases}
                cases={countryInfo.todayCases}>
              </InfoBox>
              <InfoBox

                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                title="Recovered cases"
                total={countryInfo.recovered}
                cases={countryInfo.todayRecovered}>

              </InfoBox>
              <InfoBox
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                title="Deaths cases"
                total={countryInfo.deaths}
                cases={countryInfo.todayDeaths}></InfoBox>
            </div>
    
            </Themeddiv>
                   <Map casesType={casesType}
              countries={mapCountries} center={mapCenter} zoom={mapZoom} />
          </div>

    

            <Card className="app__right">
             
              <CardContent>
                <h2>Destruction in table</h2>
                <Table countries={tableData}></Table>
                <h2 className="app__graphtitle">New Cases across the world</h2>
                <LineGraph className="app__graph" casesType={casesType} />
              </CardContent>        
             
              
            </Card>
         
          {/* <Themeddiv>

            <Card className="app__right">
              <Themeddiv>
              <CardContent>
                <h2>Destruction in table</h2>
                <Table countries={tableData}></Table>
                <h2 className="app__graphtitle">New Cases across the world</h2>
                <LineGraph className="app__graph" casesType={casesType} />
              </CardContent>        
              </Themeddiv>
              
            </Card>
          </Themeddiv> */}


        </div>

      </>


    </ThemeProvider>

  );
}

export default App;
