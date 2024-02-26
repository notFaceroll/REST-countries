import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {CountryInfo} from "@/view/home";

interface CountriesContextValue {
  countriesList: Map<string, CountryInfo>;
  isLoading: boolean;
}

export const CountriesContext = createContext({} as CountriesContextValue);
export function CountriesProvider({children}: { children: ReactNode }) {
  const [countriesList, setCountriesList] = useState<Map<string, CountryInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function fetchCountries() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,currencies,population,region,flags,cca3,subregion,tld,currencies,languages,borders"
        );
        const data: CountryInfo[] = await response.json();

        const mappedCountries = new Map<string, CountryInfo>();

        data.forEach(country =>
          mappedCountries.set(country.cca3, country));

        setCountriesList(mappedCountries);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <CountriesContext.Provider
      value={{countriesList, isLoading}}
    >
      {children}
    </CountriesContext.Provider>
  );
}

export const useCountries = () => useContext(CountriesContext);
