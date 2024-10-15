// app/api/bookings/estimate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDistance } from 'geolib';
import dbConnect from '@/utils/dbConnect';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';



const API_KEY = process.env.OPENWEATHER;
const getWeather = async (city: string) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`; // Metric for Celsius

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Display relevant weather info
      console.log(`Weather in ${data.name}:`);
      console.log(`Temperature: ${data.main.temp}°C`);
      console.log(`Feels like: ${data.main.feels_like}°C`);
      console.log(`Humidity: ${data.main.humidity}%`);
      console.log(`Weather: ${data.weather[0].description}`);
  } catch (error) {
      console.error('Error fetching weather data:', error);
  }
};
async function handler(req: AuthenticatedRequest) {
  await dbConnect();

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const pickupLongitude = parseFloat(searchParams.get('pickupLongitude') || '0');
    const pickupLatitude = parseFloat(searchParams.get('pickupLatitude') || '0');
    const dropoffLongitude = parseFloat(searchParams.get('dropoffLongitude') || '0');
    const dropoffLatitude = parseFloat(searchParams.get('dropoffLatitude') || '0');
    const vehicleType = searchParams.get('vehicleType') || 'car';

    try {
      // Calculate distance
      const distanceInMeters = getDistance(
        {
          longitude: pickupLongitude,
          latitude: pickupLatitude
        },
        {
          longitude: dropoffLongitude,
          latitude: dropoffLatitude
        }
      );

      // Basic pricing logic
      const baseFare = 5; // Base fare in dollars
      const costPerKm = 1; // Cost per kilometer

      // Adjust cost per km based on vehicle type
      let vehicleMultiplier = 1;
      switch (vehicleType) {
        case 'bike':
          vehicleMultiplier = 0.8;
          break;
        case 'car':
          vehicleMultiplier = 1;
          break;
        case 'van':
          vehicleMultiplier = 1.2;
          break;
        case 'truck':
          vehicleMultiplier = 1.5;
          break;
        default:
          vehicleMultiplier = 1;
          break;
      }

      // Calculate estimated cost
      const distanceInKm = distanceInMeters / 1000;
      const estimatedCost = baseFare + distanceInKm * costPerKm * vehicleMultiplier;

      if(distanceInKm >50 && vehicleType==='bike')
      {
        throw new Error('Bike cannot travel more than 50km');

      }
      


      // Also get the Time Estimation


      let average_speed=20; // in km/h

      if(vehicleType === 'bike'){
        average_speed = 60;
      }
      else if(vehicleType === 'car'){
        average_speed = 40;
      }
      else if(vehicleType === 'van'){
        average_speed = 35;
      }
      else if(vehicleType === 'truck'){
        average_speed = 25;
      }

      const timeEstimation = distanceInKm / average_speed;

      // Check for the Weather

      const weather= await getWeather(searchParams.get('pickupCity') || '');

      // console.log(weather);

     

      return NextResponse.json({ estimatedCost,timeEstimation ,distanceInKm}, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const GET = authenticate(handler);
