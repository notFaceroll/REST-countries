import { Link, useParams } from "react-router-dom";
import { CountryInfo } from "../home";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function Details() {
  const [country, setCountry] = useState<CountryInfo | null>(null);
  const { id } = useParams();

  async function fetchCountry() {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${id}?fields=name,capital,currencies,population,region,flags,cca3,subregion,tld,currencies,languages,borders`
      );
      const data: CountryInfo = await response.json();

      setCountry(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCountry();
  }, []);

  if (!country) {
    return (
      <div className="p-6">
        <Link to="/">Back</Link>
        <div className="flex flex-col space-y-3 ">
          <Skeleton className="h-[200px] w-full my-8 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1440px] self-center w-full dark:text-white text-very-dark-blue-light-mode-text">
      <div className="py-8">
        <Link to="/">Back</Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-16 md:space-x-40 sm:items-center">
        <div className="my-8 h-[200px] sm:h-auto sm:flex-1 aspect-video">
          <img
            className="object-cover h-full w-full"
            src={country.flags.png}
            alt={country.name.common}
          />
        </div>
        <div className="sm:flex-1">
          <h2 className="text-xl font-bold mb-4">{country.name.common}</h2>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <div>
                <strong>Native Name:</strong> {country.name.common}
              </div>
              <div>
                <strong>Population:</strong> {country.population}
              </div>
              <div>
                <strong>Region:</strong> {country.region}
              </div>
              <div>
                <strong>Sub Region:</strong> {country.subregion}
              </div>
              <div>
                <strong>Capital:</strong> {country.capital}
              </div>
            </div>

            <div>
              <div>
                <strong>Top Level Domain:</strong> {country.tld}
              </div>
              <div>
                <strong>Currencies:</strong>
                {Object.values(country.currencies).map((curr) => curr.name)}
              </div>
              <div>
                <strong>Languages:</strong>{" "}
                {Object.values(country.languages).join(", ")}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mt-8 mb-4">Border Countries:</h3>
            <div className="flex flex-wrap gap-4">
              {country.borders.map((border) => (
                <Link
                  to={{
                    pathname: `/${border}`,
                  }}
                  key={border}
                  className="bg-dark-blue-dark-mode-elements shadow-md dark:text-white text-very-dark-blue-light-mode-text px-4 py-2 rounded-md"
                >
                  {border}
                </Link>
              ))}
              {country.borders.length === 0 && "No border countries"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
