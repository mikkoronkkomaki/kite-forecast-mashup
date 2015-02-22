# kite-forecast

Application built for displaying kiteboarding weather for the forthcomming week in Oulu based on provided forecast data.

Consists of a Node.js back-end that's used to gather and filter the data from available sources. The back-end is used by a simple JS front-end which simply displays the gathered and processed data. 
plays it in the JS front-end.

# Back-end #

The back-end application fetches the data from the open FMI api using the following parameters:
* place: at this time the application is restricted to only work with forecast data for the city of Oulu
* starttime: current date
* endtime: 7 days forward from current date
* parameters: the application will at this phase only fetch the forecast data for wind speed, wind gusts, wind direction and temperature
* timestep: 60, meaning that the fetched forecast data consists of one hour interval data points


# Front-end #

The user interface of the application displays a simple timeline grid of the hourly forecast data points.

# Data Sources #

The required forecast data is fetched from the The Finnish Meteorological Institute (FMI) open data service (http://en.ilmatieteenlaitos.fi/open-data-manual). 

# Run locally

Currently this does not work on Windows.

git clone https://github.com/mikkoronkkomaki/kite-forecast-mashup/ kiteforecast
cd kiteforecast
npm install
node server.js
Now open your browser on http://127.0.0.1:8080

# Notes
The socket handling and some of the backend is based on Jaakko Vanhalas Socket IO Openshift Example project (https://github.com/nodebooks/socketio-openshift-example).