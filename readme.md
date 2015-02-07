# kite-forecast-mashup

Application built for displaying optimal kiteboarding weather for the forthcomming week in Oulu based on provided forecast data.

Consists of a Node.js back-end that's used to gather and filter the data from available sources. The back-end is used by a simple JS front-end which simply displays the gathered and processed data. 
plays it in the JS front-end.

# Data Sources #

The required forecast data is fetched from the The Finnish Meteorological Institute (FMI) open data service (http://en.ilmatieteenlaitos.fi/open-data-manual). 

# Description #

The back-end application fetches the data from the open FMI api using the following parameters:
* place: at this time the application is restricted to only work with forecast data for the city of Oulu
* starttime: current date
* endtime: 7 days forward from current date
* parameters: the application will at this phase only fetch the forecast data for wind speed, wind gusts, wind direction and temperature
* timestep: 60, meaning that the fetched forecast data consists of one hour interval data points

The front-end displays all of the given forecast data and higlights the optimal places in time based on the given data. An optimal kiteboarding weather is determied from the wind speed, direction, gusts and temperature:
- Wind speed has to exceed 5.5 meters per second
- Wind direction has to be either nort, north-west, west, south-west or south
- Wind gusts must not exceed the predicted windspeed by 2.5 meters per second
- Temperature has to be either between -20 and -5 (displayed as snow kiting) or above +10 degrees celcius (displayed as kite surffing)


# Draft of the mashup #

The user interface of the application displays a simple time line grid of the hourly forecast data points, displaying the optimal kiteboaring times as highlited with blue for kitesurffing (on water) or snowkiting.