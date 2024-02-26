import {Link, useLocation} from "react-router-dom";
import {CountryInfo} from "../home";
import {ArrowIcon} from "@/components/ui/ArrowIcon.tsx";
import {useCountries} from "@/context/CountriesContext.tsx";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/Spinner.tsx";
import {sleep} from "@/lib/utils.ts";

export function Details() {
  const {state} = useLocation();
  const country: CountryInfo = state.country;
  const {countriesList} = useCountries();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    (async function initialLoad() {
      await sleep(1000);
      setIsLoading(false);
    })();
  }, []);

  if (!country || isLoading) {
    return (
    <div className="flex-1 w-full flex items-center justify-center">
      <Spinner />
    </div>
    );
  }

  const nativeName = Object.values(country.name.nativeName)[0].common;

  return (
    <div className="animate-slide-up-and-fade p-6 max-w-[1440px] self-center w-full dark:text-white text-very-dark-blue-light-mode-text">
      <div
        className="w-min dark:bg-dark-blue-dark-mode-elements shadow-md dark:text-white text-very-dark-blue-light-mode-text px-4 py-2 rounded-md"
      >
        <Link to="/" className="flex items-center space-x-2 duration-300"> <ArrowIcon/> <span>Back</span></Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-16 md:space-x-40 sm:items-center">
        <div className="my-8 min-h-[200px] sm:h-auto sm:flex-1 aspect-video">
          <img
            className="object-contain h-full w-full"
            src={country.flags.png}
            alt={country.name.common}
          />
        </div>
        <div className="sm:flex-1">
          <h2 className="text-xl font-bold mb-4">{country.name.common}</h2>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <div>
                <strong>Native Name:</strong> {nativeName}
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
                <strong>Currencies: </strong>
                {Object.values(country.currencies).map((curr) => curr.name)}
              </div>
              <div>
                <strong>Languages:</strong>{" "}
                {Object.values(country.languages).join(", ")}
              </div>
            </div>
          </div>

          <div className="sm:flex sm:items-center sm:mt-8 sm:space-x-2">
            <h3 className="text-lg font-bold mt-8 mb-4 sm:mt-0 sm:mb-0">Border Countries:</h3>
            <div className="flex flex-wrap gap-4">
              {country.borders.map((border) => (
                <Link
                  to={{
                    pathname: `/${border}`,
                  }}
                  key={border}
                  state={{country: countriesList.get(border)}}
                  className="text-sm  dark:bg-dark-blue-dark-mode-elements shadow-md dark:text-white text-very-dark-blue-light-mode-text px-3 py-2 rounded-sm"
                >
                  {countriesList.get(border)?.name.common || null}
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
