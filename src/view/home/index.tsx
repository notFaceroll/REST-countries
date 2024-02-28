import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Input} from "@/components/ui/input";
import { useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCountries} from "@/context/CountriesContext.tsx";
import {Spinner} from "@/components/ui/Spinner.tsx";
import {formatPopulationNumber} from "@/lib/utils.ts";

interface Flag {
  png: string;
  svg: string;
  alt: string;
}

interface NativeName {
  official: string;
  common: string;
}

interface Currencies {
  [currencyCode: string]: {
    name: string;
    symbol: string;
  };
}

export interface CountryInfo {
  flags: Flag;
  name: {
    common: string;
    official: string;
    nativeName: {
      [language: string]: NativeName;
    };
  };
  currencies: Currencies;
  capital: string[];
  region: string;
  population: number;
  cca3: string;
  subregion: string;
  tld: string[];
  languages: {
    [languageCode: string]: string;
  };
  borders: string[];
}


export function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [regionCountries, setRegionCountries] = useState<CountryInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const {countriesList, isLoading} = useCountries();

  const countries = useMemo(() => {
    return [...countriesList.values()];
  }, [countriesList]);


  useEffect(() => {
    if (selectedRegion === "all") {
      setRegionCountries(countries);
    } else {
      const filtered = countries.filter(
        (country: CountryInfo) =>
          country.region.toLowerCase() === selectedRegion
      );
      setRegionCountries(filtered);
    }
  }, [selectedRegion, countries]);

  const filteredCountries =
    searchTerm.length > 0
      ? regionCountries.filter((country: CountryInfo) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : regionCountries;


  function handleRegionChange(region: string) {
    setSelectedRegion(region);
  }

  function handleNavigation(country: CountryInfo) {
    navigate(`/${country.cca3}`, {state: {country}});
  }

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <Spinner/>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1440px] w-full m-auto px-4 xl:px-0">
    <div
        className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 justify-between px-2 items-center py-10 sticky top-0 bg-very-light-gray-light-mode-background dark:bg-very-dark-blue-dark-mode-background">
        <Input
          type="text"
          placeholder="Search for a country"
          className="max-w-sm dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text"
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <Select onValueChange={handleRegionChange}>
          <SelectTrigger
            className="max-w-sm sm:w-[180px] dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text">
            <SelectValue placeholder="Filter by Region"/>
          </SelectTrigger>
          <SelectContent
            className="dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="oceania">Oceania</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="grid grid-cols-1 place-items-center lg:place-items-stretch sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-14 px-2">
        {filteredCountries?.map((country: CountryInfo) => (
          <Card
            onClick={() => {
              handleNavigation(country);
            }}
            key={country.name.common}
            className={`animate-slide-up-and-fade
            overflow-hidden w-[300px] lg:w-auto h-96 sm:h-[375px]
            dark:bg-dark-blue-dark-mode-elements bg-white
            border-0 shadow-md cursor-pointer`}
          >
            <div className="aspect-video max-h-[40%] w-full">
              <img
                className="block object-cover h-full w-full"
                src={country.flags.png}
                alt={country.name.common}
              />
            </div>

            <CardHeader className="mt-4">
              <CardTitle>{country.name.common}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col justify-center">
              <span>
                <strong>Population:</strong>{" "}
                {formatPopulationNumber(country.population)}
              </span>

              <span>
                <strong>Region:</strong> {country.region}
              </span>

              <span>
                <strong>Capital:</strong> {country.capital}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
