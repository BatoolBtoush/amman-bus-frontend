import React, {useEffect, useState} from 'react'
import axios from "axios"


function Routes(props) {

    const tableHeaders = ["Route Name", "Route Stations", "Duration", "Distance", "Cost"]
    const [data, setData] = useState([])

    useEffect(() => {
        // GET request using axios inside useEffect React hook
        const fetchData = async () => {
            try {
                const {data: response} = await axios.get(props.BACKEND_HEROKU_URL + "/api/routes/")
                var newData = []
                response.forEach(function (route) {
                    // code
                    var stations = []
                    var total_time = 0
                    var total_distance = 0
                    for (const stationStop of  route.station_stops) {
                        stations.push(stationStop.station.name)
                        total_time+= parseInt(stationStop.time_to_next_station.substring(4,5))
                        total_distance+=stationStop.distance_to_next_station

                    }
                    newData.push({
                        "route_name": route.name,
                        // "Starts": route.station_stops[0].station.name,
                        // "Ends": route.station_stops[route.station_stops.length -1].station.name,
                        "Stations": stations,
                        "Duration": total_time+"m",
                        "Distance": total_distance/1000.0+" km",
                        "Cost": ((total_distance/1000.0) * 0.15 ).toFixed(2) + " JOD"
                    })
                });
                setData(newData);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData()
    }, []);


    return (
        <div id='section3' className='bg-transparent w-full flex justify-center items-center 
        transition duration-1000 opacity-0 -translate-y-28 -z-20'>
            <table className='w-4/5 border-separate border-spacing-3 pt-5 pb-5'>

                <thead>
                    <tr>
                        {
                            tableHeaders.map(cell => {
                                return <th className='text-2vw p-2 bg-secondary-top text-tratiary-top rounded-lg shadow-md hover:shadow-primary-top
                                transition duration-300'
                                >{cell}</th>
                            })
                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        Array.isArray(data) ?
                            data.map(obj => {
                                return <tr>
                                    {
                                        typeof obj === 'object' && obj !== null ?
                                            Object.keys(obj).map((key, index) => {
                                                if (key != "Starts" && key != "Ends") {
                                                    if(key != "Stations") {
                                                        return <td 
                                                        className='text-15vw font-bold text-center text-tratiary-top bg-primary-top opacity-75 rounded-lg
                                                        hover:cursor-pointer hover:bg-secondary-top hover:text-primary-top hover:scale-105 transition duration-300'
                                                        >{obj[key]}</td>
                                                    } else {
                                                        return <td 
                                                        className='text-[1vw] font-bold text-center text-tratiary-top opacity-75
                                                        hover:cursor-pointer hover:scale-105 transition duration-300'
                                                        >
                                                            <div className='w-full h-full grid grid-cols-3 gap-1'>
                                                                {
                                                                    obj[key].map(subcell => {
                                                                        return(<di className='p-1 bg-primary-top rounded-lg hover:text-primary-top hover:bg-secondary-top'>
                                                                            {subcell}</di>)
                                                                    })
                                                                }
                                                            </div>
                                                        </td>
                                                    }
                                                }
                                            }) :
                                        <div>Error uploading the data</div>
                                    }
                                </tr>
                            }) :
                        <div>Error uploading the data</div>
                    }
                </tbody>

            </table>    
        </div>
    )
}

export default Routes